/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *
 * Script MapReduce responsável por realizar a integração de clientes da EXTForms com Netsuite
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "N/log", "./controllers/request.controller", "./controllers/record.controller", "./customerIntegration"], function (require, exports, log_1, RequestController, RecordController, CustomerIntegration) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    log_1 = __importDefault(log_1);
    RequestController = __importStar(RequestController);
    RecordController = __importStar(RecordController);
    CustomerIntegration = __importStar(CustomerIntegration);
    exports.getInputData = function () {
        return RequestController.getExtFormsCustomers(String(CustomerIntegration.getAuthenticationToken()));
    };
    exports.map = function (ctx) {
        var customer = JSON.parse(ctx.value);
        try {
            var searchedCustomerID_1 = RecordController.searchCustomerByEXTFormsID(String(customer.id));
            if (searchedCustomerID_1) {
                if (RecordController.updateCustomer(customer, searchedCustomerID_1)) {
                    var convertedContactList = convertCustomerContactToSuiteTalkFormat(customer.contactList, searchedCustomerID_1);
                    convertedContactList.forEach(function (contact) {
                        log_1.default.debug('contact.email,', contact.email);
                        log_1.default.debug('contact.email,', searchedCustomerID_1);
                        var contactID = RecordController.searchContactByEmail(contact.email, searchedCustomerID_1);
                        log_1.default.debug('contactID', contactID);
                        RecordController.updateCustomerContact(contact, contactID, searchedCustomerID_1);
                    });
                }
            }
            // } else { 
            //     let suiteTalkResponse;
            //     const convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
            //     suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer);
            //     if (suiteTalkResponse.code == 204) {
            //         const searchedCustomerID = RecordController.searchCustomerByEXTFormsID(convertedCustomer.id);
            //         RequestController.createContactBySuiteTalk(convertedCustomer.contactList);
            //         const convertedContactList = convertCustomerContactToSuiteTalkFormat(customer.contactList, searchedCustomerID);
            //         convertedContactList.forEach((contact: any) => {
            //             Log.debug('respe1', RequestController.createContactBySuiteTalk(contact));
            //         });
            //     }
            // }
        }
        catch (e) {
            log_1.default.audit('Failed to integrate customer', "Customer: " + JSON.stringify(customer.id) + "\nErro: " + e);
        }
    };
    exports.summarize = function (_ctx) {
        log_1.default.audit('EXTForms - Customers Integration', "Customers Integration finished on " + new Date());
    };
    var convertCustomerToSuiteTalkFormat = function (customer) {
        try {
            var convertedCustomer_1 = {
                custentity_clin_extform_id: customer.id,
                subsidiary: 1,
                isperson: true,
                firstname: customer.firstName,
                lastname: customer.lastName,
                custentity_clin_fullname: customer.fullName,
                email: customer.email,
                addressbook: {
                    items: []
                }
            };
            customer.addressList.forEach(function (address) {
                convertedCustomer_1.addressbook.items.push({
                    addressbookaddress: {
                        internalid: address.id,
                        defaultbilling: address.type == 'billing-address' ? true : false,
                        defaultshipping: address.type == 'shipping-address' ? true : false,
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        custrecord_sit_codigo_ige: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        custrecord_sit_address_i_numero: address.number,
                        custrecord_sit_address_t_bairro: address.neighborhood,
                    }
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
                    internalid: contact.id,
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
