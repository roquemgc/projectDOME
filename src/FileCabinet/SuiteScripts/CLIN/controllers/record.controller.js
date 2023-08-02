var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/search"], function (require, exports, search_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.searchCustomerByEXTFormsID = void 0;
    search_1 = __importDefault(search_1);
    var searchCustomerByEXTFormsID = function (customerEXTFormsID) {
        try {
            var searchedCustomer = search_1.default.create({
                type: search_1.default.Type.CUSTOMER,
                filters: [
                    ['custbody_clin_extform_id', search_1.default.Operator.IS, customerEXTFormsID]
                ]
            }).run().getRange({ start: 0, end: 1 });
            if (searchedCustomer)
                return searchedCustomer[0].id;
            else
                return 0;
        }
        catch (e) {
            throw e;
        }
    };
    exports.searchCustomerByEXTFormsID = searchCustomerByEXTFormsID;
});
