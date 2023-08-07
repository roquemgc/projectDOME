var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/https"], function (require, exports, https_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
    exports.deleteContactById = exports.deleteCustomerById = exports.createContactBySuiteTalk = exports.createCustomerBySuiteTalk = exports.getExtFormsCustomers = void 0;
=======
    exports.updateContactBySuiteTalk = exports.createContactBySuiteTalk = exports.updateCustomerBySuiteTalk = exports.createCustomerBySuiteTalk = exports.getExtFormsCustomers = void 0;
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
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
<<<<<<< HEAD
            var suiteTalkResponse = https_1.default.requestSuiteTalkRest({
                url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer',
                method: https_1.default.Method.POST,
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(customer)
            });
            if (suiteTalkResponse.code == 204)
                return 204;
            else
                throw suiteTalkResponse.body;
=======
            return https_1.default.requestSuiteTalkRest({
                url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer',
                body: JSON.stringify(customer)
            });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
        }
        catch (e) {
            throw e;
        }
    };
    exports.createCustomerBySuiteTalk = createCustomerBySuiteTalk;
<<<<<<< HEAD
    var createContactBySuiteTalk = function (contact) {
        try {
            var suiteTalkResponse = https_1.default.requestSuiteTalkRest({
                url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact',
                method: https_1.default.Method.POST,
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(contact),
            });
            if (suiteTalkResponse.code == 204)
                return 204;
            else
                throw suiteTalkResponse.body;
=======
    var updateCustomerBySuiteTalk = function (customer, customerID) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: "https://12345.suitetalk.api.netsuite.com/services/rest/record/v1/customer/" + customerID,
                body: JSON.stringify(customer),
                method: 'PATCH'
            });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
        }
        catch (e) {
            throw e;
        }
    };
<<<<<<< HEAD
    exports.createContactBySuiteTalk = createContactBySuiteTalk;
    var deleteCustomerById = function (customerID) {
        try {
            var suiteTalkResponse = https_1.default.requestSuiteTalkRest({
                url: "https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer/" + customerID,
                method: https_1.default.Method.DELETE,
                headers: {
                    'Content-type': 'application/json'
                }
            });
            if (suiteTalkResponse.code == 204)
                return 204;
            else
                throw suiteTalkResponse.body;
=======
    exports.updateCustomerBySuiteTalk = updateCustomerBySuiteTalk;
    var createContactBySuiteTalk = function (contact) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact',
                body: JSON.stringify(contact),
            });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
        }
        catch (e) {
            throw e;
        }
    };
<<<<<<< HEAD
    exports.deleteCustomerById = deleteCustomerById;
    var deleteContactById = function (contactID) {
        try {
            var suiteTalkResponse = https_1.default.requestSuiteTalkRest({
                url: "https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact/" + contactID,
                method: https_1.default.Method.DELETE,
                headers: {
                    'Content-type': 'application/json'
                }
            });
            if (suiteTalkResponse.code == 204)
                return 204;
            else
                throw suiteTalkResponse.body;
=======
    exports.createContactBySuiteTalk = createContactBySuiteTalk;
    var updateContactBySuiteTalk = function (contact, contactID) {
        try {
            return https_1.default.requestSuiteTalkRest({
                url: "https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact/" + contactID,
                body: JSON.stringify(contact),
                method: 'PATCH'
            });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
        }
        catch (e) {
            throw e;
        }
    };
<<<<<<< HEAD
    exports.deleteContactById = deleteContactById;
=======
    exports.updateContactBySuiteTalk = updateContactBySuiteTalk;
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
});
