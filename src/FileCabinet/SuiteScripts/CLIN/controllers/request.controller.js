var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/https"], function (require, exports, https_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateContactBySuiteTalk = exports.createContactBySuiteTalk = exports.updateCustomerBySuiteTalk = exports.createCustomerBySuiteTalk = exports.getExtFormsCustomers = void 0;
    https_1 = __importDefault(https_1);
    var getExtFormsCustomers = function (authenticationToken) {
        try {
            return JSON.parse(https_1.default.get({
                url: 'https://2569267.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=882&deploy=1&compid=2569267&h=6560b42975570f0ac89e',
                headers: {
                    Authorization: "Basic " + authenticationToken
                }
            }).body);
        }
        catch (e) {
            throw e;
        }
    };
    exports.getExtFormsCustomers = getExtFormsCustomers;
    var createCustomerBySuiteTalk = function (customer) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer',
                body: JSON.stringify(customer)
            });
        }
        catch (e) {
            throw e;
        }
    };
    exports.createCustomerBySuiteTalk = createCustomerBySuiteTalk;
    var updateCustomerBySuiteTalk = function (customer, customerID) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: "https://12345.suitetalk.api.netsuite.com/services/rest/record/v1/customer/" + customerID,
                body: JSON.stringify(customer),
                method: 'PATCH'
            });
        }
        catch (e) {
            throw e;
        }
    };
    exports.updateCustomerBySuiteTalk = updateCustomerBySuiteTalk;
    var createContactBySuiteTalk = function (contact) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact',
                body: JSON.stringify(contact),
            });
        }
        catch (e) {
            throw e;
        }
    };
    exports.createContactBySuiteTalk = createContactBySuiteTalk;
    var updateContactBySuiteTalk = function (contact, contactID) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: "https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact/" + contactID,
                body: JSON.stringify(contact),
                method: 'PATCH'
            });
        }
        catch (e) {
            throw e;
        }
    };
    exports.updateContactBySuiteTalk = updateContactBySuiteTalk;
});
