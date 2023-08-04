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
define(["require", "exports", "N/log", "N/record", "./controllers/request.controller", "./controllers/record.controller"], function (require, exports, log_1, record_1, RequestController, RecordController) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    log_1 = __importDefault(log_1);
    record_1 = __importDefault(record_1);
    RequestController = __importStar(RequestController);
    RecordController = __importStar(RecordController);
    var getInputData = function () {
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
        return RequestController.getExtFormsCustomers();
    };
    exports.getInputData = getInputData;
    var map = function (ctx) {
        var customer = JSON.parse(ctx.value);
        log_1.default.debug('customer', customer);
        var convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
        log_1.default.debug('convertedCustomer', convertedCustomer);
        var customerID = RecordController.searchCustomerByEXTFormsID(customer.id);
        log_1.default.debug('customerID', customerID);
        var suiteTalkResponse;
        if (customerID) {
            suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer, customerID);
            RequestController.createCustomerBySuiteTalk(convertedCustomer.contactList);
        }
        else {
            suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer);
        }
        log_1.default.debug('suiteTalkResponse', suiteTalkResponse);
        if (suiteTalkResponse.code === 204)
            log_1.default.audit('Customer integrated', customer);
        else
            log_1.default.audit('Failed to integrate customer', customer);
    };
    exports.map = map;
    var summarize = function (_ctx) {
        log_1.default.audit('EXTForms - Customers Integration', "Customers Integration finished on " + new Date());
    };
    exports.summarize = summarize;
    var convertCustomerToSuiteTalkFormat = function (customer) {
        try {
            var convertedCustomer_1 = {
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
                        suiteTalkField: address.id,
                        suiteTalkField: address.type,
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        suiteTalkField: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        suiteTalkField: address.number,
                        suiteTalkField: address.neighborhood,
                    }
                });
            });
            customer.contactList.forEach(function (contact) {
                convertedCustomer_1.contactList.push({
                    internalid: contact.id,
                    firstname: contact.name,
                    email: contact.email
                });
            });
            return convertedCustomer_1;
        }
        catch (e) {
            log_1.default.error('convertCustomerToSuiteTalkFormat error', e);
        }
    };
});
