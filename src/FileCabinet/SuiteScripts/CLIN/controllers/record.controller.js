var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/record", "N/search"], function (require, exports, record_1, search_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    record_1 = __importDefault(record_1);
    search_1 = __importDefault(search_1);
    exports.searchCustomerByEXTFormsID = function (customerEXTFormsID) {
        try {
            var searchedCustomer = search_1.default.create({
                type: search_1.default.Type.CUSTOMER,
                filters: [
                    ['custentity_clin_extform_id', search_1.default.Operator.IS, String(customerEXTFormsID)]
                ]
            }).run().getRange({ start: 0, end: 1 });
            if (searchedCustomer.length)
                return searchedCustomer[0].id;
            else
                return 0;
        }
        catch (e) {
            throw e;
        }
    };
    exports.searchContactByEmail = function (contactEmail, customerID) {
        try {
            var searchedCustomer = search_1.default.create({
                type: search_1.default.Type.CONTACT,
                filters: [
                    ['email', search_1.default.Operator.IS, contactEmail],
                    'AND',
                    ['customer.internalid', search_1.default.Operator.IS, customerID]
                ]
            }).run().getRange({ start: 0, end: 1 });
            if (searchedCustomer.length)
                return searchedCustomer[0];
            else
                return 0;
        }
        catch (e) {
            throw e;
        }
    };
    exports.updateCustomer = function (customer, customerID) {
        try {
            var loadedCustomerRec = record_1.default.load({
                type: record_1.default.Type.CUSTOMER,
                id: customerID
            });
            loadedCustomerRec.setValue({ fieldId: 'custentity_clin_extform_id', value: customer.id });
            loadedCustomerRec.setValue({ fieldId: 'subsidiary', value: 1 });
            loadedCustomerRec.setValue({ fieldId: 'isperson', value: 'T' });
            loadedCustomerRec.setValue({ fieldId: 'firstname', value: customer.firstName });
            loadedCustomerRec.setValue({ fieldId: 'lastname', value: customer.lastName });
            loadedCustomerRec.setValue({ fieldId: 'custentity_clin_fullname', value: customer.fullName });
            loadedCustomerRec.setValue({ fieldId: 'email', value: customer.email });
            return loadedCustomerRec.save();
        }
        catch (e) {
            throw e;
        }
    };
    exports.updateCustomerContact = function (contact, contactID, customerID) {
        try {
            var loadedContactRed = record_1.default.load({
                type: record_1.default.Type.CONTACT,
                id: contactID
            });
            loadedContactRed.setValue({ fieldId: 'company', value: customerID });
            loadedContactRed.setValue({ fieldId: 'subsidiary', value: 1 });
            loadedContactRed.setValue({ fieldId: 'firstName', value: contact.name });
            loadedContactRed.setValue({ fieldId: 'email', value: contact.email });
            return loadedContactRed.save();
        }
        catch (e) {
            throw e;
        }
    };
});
