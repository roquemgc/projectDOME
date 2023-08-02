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
define(["require", "exports", "N/https", "../customerIntegration"], function (require, exports, https_1, CustomerIntegration) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCustomerBySuiteTalk = exports.createCustomerBySuiteTalk = exports.getExtFormsCustomers = void 0;
    https_1 = __importDefault(https_1);
    CustomerIntegration = __importStar(CustomerIntegration);
    var getExtFormsCustomers = function () {
        try {
            return JSON.parse(https_1.default.get({
                url: 'https://2569267.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=882&deploy=1&compid=2569267&h=6560b42975570f0ac89e',
                headers: {
                    Authorization: "Basic " + CustomerIntegration.getAuthenticationToken()
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
});
