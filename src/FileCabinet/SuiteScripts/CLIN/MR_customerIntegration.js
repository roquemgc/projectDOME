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
define(["require", "exports", "N/log", "./controllers/request.controller", "./controllers/record.controller"], function (require, exports, log_1, RequestController, RecordController) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    log_1 = __importDefault(log_1);
    RequestController = __importStar(RequestController);
    RecordController = __importStar(RecordController);
    var getInputData = function () {
        return RequestController.getExtFormsCustomers();
    };
    exports.getInputData = getInputData;
    var map = function (ctx) {
        var customer = JSON.parse(ctx.value);
        var convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
        var suiteTalkResponse;
        var customerID = RecordController.searchCustomerByEXTFormsID(customer.id);
        log_1.default.debug('customer', customer);
        if (customerID)
            suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer);
        else
            suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer, customerID);
        if (suiteTalkResponse.code === 204)
            log_1.default.audit('Customer integrated', customer);
        else
            log_1.default.audit('Failed to integrate customer', customer);
    };
    exports.map = map;
    var summarize = function (_ctx) {
        log_1.default.audit('EXTForms - Customers Integration executed', "ClientIntegration finished on " + new Date());
    };
    exports.summarize = summarize;
    var convertCustomerToSuiteTalkFormat = function (customer) {
        try {
            var convertedCustomer = {
                id: customer.id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                fullName: customer.fullName,
                email: customer.email,
                adressList: customer.adressList,
                contactList: customer.contactList
            };
            convertedCustomer.addressList.forEach(function (address) {
                // suiteTalkField: address.id,
                // suiteTalkField: address.street,
                // suiteTalkField: address.number,
                // suiteTalkField: address.neighborhood,
                // suiteTalkField: address.zipCode,
                // suiteTalkField: address.stateCode,
                // suiteTalkField: address.city,
                // suiteTalkField: address.cityIbgeCode,
                // suiteTalkField: address.type
            });
            convertedCustomer.contactList.forEach(function (contact) {
                // suiteTalkField: contact.id,
                // suiteTalkField: contact.name,
                // suiteTalkField: contact.email
            });
            return convertedCustomer;
        }
        catch (e) {
            log_1.default.error('convertCustomerToSuiteTalkFormat error', e);
        }
    };
});
