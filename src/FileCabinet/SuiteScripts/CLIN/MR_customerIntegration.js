/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *
 * Script MapReduce responsável por realizar a integração de clientes da EXTForms com Netsuite
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/log", "./controllers/request.controller", "./controllers/record.controller", "./customerIntegration"], function (require, exports, log_1, RequestController, RecordController, CustomerIntegration) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    log_1 = __importDefault(log_1);
    RequestController = __importStar(RequestController);
    RecordController = __importStar(RecordController);
    CustomerIntegration = __importStar(CustomerIntegration);
    var getInputData = function () {
        return RequestController.getExtFormsCustomers(String(CustomerIntegration.getAuthenticationToken()));
    };
    exports.getInputData = getInputData;
    var map = function (ctx) {
        var customer = JSON.parse(ctx.value);
        var newCustomerID = 0;
        try {
            var searchedCustomerID = RecordController.searchCustomerByEXTFormsID(String(customer.id));
            if (searchedCustomerID) {
                if (RecordController.updateCustomer(customer, searchedCustomerID)) {
                    var convertedContactList = convertCustomerContactToSuiteTalkFormat(customer.contactList, searchedCustomerID);
                    var contactIDList = RecordController.searchCurrentCustomerContacts(searchedCustomerID);
                    contactIDList.forEach(function (contactID) {
                        RequestController.deleteContactById(contactID);
                    });
                    convertedContactList.forEach(function (contact) {
                        RequestController.createContactBySuiteTalk(contact);
                    });
                }
            }
            else {
                var convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
                var suiteTalkResponseCode = RequestController.createCustomerBySuiteTalk(convertedCustomer);
                if (suiteTalkResponseCode == 204) {
                    newCustomerID = RecordController.searchCustomerByEXTFormsID(customer.id);
                    var convertedContactList = convertCustomerContactToSuiteTalkFormat(customer.contactList, newCustomerID);
                    convertedContactList.forEach(function (convertedContact) {
                        RequestController.createContactBySuiteTalk(convertedContact);
                    });
                }
            }
        }
        catch (e) {
            log_1.default.audit('Failed to integrate customer', "Customer: " + JSON.stringify(customer.id) + "\nErro: " + e);
            if (newCustomerID)
                RequestController.deleteCustomerById(newCustomerID);
        }
        log_1.default.audit('Customer integrated', "Customer: " + JSON.stringify(customer.id));
    };
    exports.map = map;
    var summarize = function (_ctx) {
        log_1.default.audit('EXTForms - Customers Integration', "Customers Integration finished on " + new Date());
    };
    exports.summarize = summarize;
    var convertCustomerToSuiteTalkFormat = function (customer) {
        try {
            var convertedCustomer_1 = {
                custentity_clin_extform_id: customer.id,
                subsidiary: 1,
                firstname: customer.firstName,
                lastname: customer.lastName,
                companyname: customer.fullName,
                email: customer.email,
                addressbook: {
                    items: []
                }
            };
            customer.addressList.forEach(function (address) {
                convertedCustomer_1.addressbook.items.push({
                    addressbookaddress: {
                        internalid: address.id,
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        custrecord_sit_codigo_ige: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        custrecord_sit_address_i_numero: address.number,
                        custrecord_sit_address_t_bairro: address.neighborhood,
                    },
                    defaultbilling: address.type == 'billing-address' ? true : false,
                    defaultshipping: address.type == 'shipping-address' ? true : false,
                });
            });
            return convertedCustomer_1;
        }
        catch (e) {
            log_1.default.error('convertCustomerToSuiteTalkFormat error', e);
            throw e;
        }
    };
    var convertCustomerContactToSuiteTalkFormat = function (contactList, customerID) {
        try {
            var convertedContactList_1 = [];
            contactList.forEach(function (contact) {
                convertedContactList_1.push({
                    company: customerID,
                    subsidiary: 1,
                    firstname: contact.name,
                    email: contact.email
                });
            });
            return convertedContactList_1;
        }
        catch (e) {
            log_1.default.error('convertCustomerContactToSuiteTalkFormat error', e);
            throw e;
        }
    };
});
