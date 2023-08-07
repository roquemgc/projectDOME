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
<<<<<<< HEAD
define(["require", "exports", "N/log", "./controllers/request.controller", "./controllers/record.controller", "./customerIntegration"], function (require, exports, log_1, RequestController, RecordController, CustomerIntegration) {
=======
define(["require", "exports", "N/log", "N/record", "./controllers/request.controller", "./controllers/record.controller", "./customerIntegration"], function (require, exports, log_1, record_1, RequestController, RecordController, CustomerIntegration) {
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    log_1 = __importDefault(log_1);
<<<<<<< HEAD
=======
    record_1 = __importDefault(record_1);
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    RequestController = __importStar(RequestController);
    RecordController = __importStar(RecordController);
    CustomerIntegration = __importStar(CustomerIntegration);
    var getInputData = function () {
<<<<<<< HEAD
=======
        var rec = record_1.default.load({
            type: record_1.default.Type.CUSTOMER,
            id: '54207'
        });
        var x = rec.getSublistSubrecord({
            fieldId: 'addressbookaddress',
            line: 1,
            sublistId: 'addressbook'
        });
        log_1.default.debug('teste', x.getFields());
        log_1.default.debug('teste2', x);
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
        return RequestController.getExtFormsCustomers(String(CustomerIntegration.getAuthenticationToken()));
    };
    exports.getInputData = getInputData;
    var map = function (ctx) {
        var customer = JSON.parse(ctx.value);
<<<<<<< HEAD
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
=======
        log_1.default.debug('customer', customer);
        var convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
        log_1.default.debug('convertedCustomer', convertedCustomer);
        var searchedCustomer = RecordController.searchCustomerByEXTFormsID(customer.id);
        log_1.default.debug('customerID', searchedCustomer);
        var suiteTalkResponse;
        if (searchedCustomer) {
            suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer, searchedCustomer.id);
            RequestController.updateContactBySuiteTalk(convertedCustomer.contactList, searchedCustomer.contactID);
        }
        else {
            suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer);
            RequestController.createCustomerBySuiteTalk(convertedCustomer.contactList);
        }
        log_1.default.debug('suiteTalkResponse', suiteTalkResponse);
        if (suiteTalkResponse.code === 204)
            log_1.default.audit('Customer integrated', customer);
        else
            log_1.default.audit('Failed to integrate customer', customer);
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    };
    exports.map = map;
    var summarize = function (_ctx) {
        log_1.default.audit('EXTForms - Customers Integration', "Customers Integration finished on " + new Date());
    };
    exports.summarize = summarize;
    var convertCustomerToSuiteTalkFormat = function (customer) {
        try {
            var convertedCustomer_1 = {
<<<<<<< HEAD
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
=======
                id: customer.id,
                firstname: customer.firstName,
                lastname: customer.lastName,
                custentity_clin_fullname: customer.fullName,
                email: customer.email,
                addressbook: {
                    items: []
                },
                contactList: []
            };
            customer.addressList.forEach(function (address) {
                convertedCustomer_1.items.adressList.push({
                    addressbookaddress: {
                        internalid: address.id,
                        custrecord_sit_address_l_tp_logr: address.type,
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        custrecord_sit_codigo_ige: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        custrecord_sit_address_i_numero: address.number,
                        custrecord_sit_address_t_bairro: address.neighborhood,
<<<<<<< HEAD
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
=======
                    }
                });
            });
            customer.contactList.forEach(function (contact) {
                convertedCustomer_1.contactList.push({
                    internalid: contact.id,
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
                    firstname: contact.name,
                    email: contact.email
                });
            });
<<<<<<< HEAD
            return convertedContactList_1;
        }
        catch (e) {
            log_1.default.error('convertCustomerContactToSuiteTalkFormat error', e);
            throw e;
=======
            return convertedCustomer_1;
        }
        catch (e) {
            log_1.default.error('convertCustomerToSuiteTalkFormat error', e);
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
        }
    };
});
