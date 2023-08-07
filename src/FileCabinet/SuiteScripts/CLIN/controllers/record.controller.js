var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/record", "N/search"], function (require, exports, record_1, search_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCustomerContact = exports.updateCustomer = exports.searchCurrentCustomerContacts = exports.searchCustomerByEXTFormsID = void 0;
    record_1 = __importDefault(record_1);
    search_1 = __importDefault(search_1);
    var searchCustomerByEXTFormsID = function (customerEXTFormsID) {
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
    exports.searchCustomerByEXTFormsID = searchCustomerByEXTFormsID;
    var searchCurrentCustomerContacts = function (customerID) {
        try {
            var contactIDList_1 = [];
            search_1.default.create({
                type: search_1.default.Type.CONTACT,
                filters: [
                    ['customer.internalid', search_1.default.Operator.ANYOF, customerID]
                ]
            }).run().each(function (contact) {
                contactIDList_1.push(contact.id);
                return true;
            });
            return contactIDList_1;
        }
        catch (e) {
            throw e;
        }
    };
    exports.searchCurrentCustomerContacts = searchCurrentCustomerContacts;
    var updateCustomer = function (customer, customerID) {
        try {
            var loadedCustomerRec_1 = record_1.default.load({
                type: record_1.default.Type.CUSTOMER,
                id: customerID
            });
            loadedCustomerRec_1.setValue({ fieldId: 'custentity_clin_extform_id', value: customer.id });
            loadedCustomerRec_1.setValue({ fieldId: 'subsidiary', value: 1 });
            loadedCustomerRec_1.setValue({ fieldId: 'isperson', value: 'F' });
            loadedCustomerRec_1.setValue({ fieldId: 'firstname', value: customer.firstName });
            loadedCustomerRec_1.setValue({ fieldId: 'lastname', value: customer.lastName });
            loadedCustomerRec_1.setValue({ fieldId: 'companyname', value: customer.fullName });
            loadedCustomerRec_1.setValue({ fieldId: 'email', value: customer.email });
            var addressLineCount = loadedCustomerRec_1.getLineCount({ sublistId: 'addressbook' });
            for (var i = addressLineCount - 1; i >= 0; i--) {
                loadedCustomerRec_1.removeLine({ sublistId: 'addressbook', line: i });
            }
            customer.addressList.forEach(function (address, index) {
                loadedCustomerRec_1.setSublistValue({
                    sublistId: 'addressbook',
                    line: index,
                    fieldId: 'defaultbilling',
                    value: address.type == 'billing-address' ? true : false
                });
                loadedCustomerRec_1.setSublistValue({
                    sublistId: 'addressbook',
                    line: index,
                    fieldId: 'defaultshipping',
                    value: address.type == 'shipping-address' ? true : false
                });
                var addressSubRecord = loadedCustomerRec_1.getSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress',
                    line: index
                });
                addressSubRecord.setValue({ fieldId: 'country', value: 'BR' });
                addressSubRecord.setValue({ fieldId: 'state', value: address.stateCode });
                addressSubRecord.setValue({ fieldId: 'city', value: address.city });
                addressSubRecord.setValue({ fieldId: 'custrecord_sit_codigo_ige', value: address.cityIbgeCode });
                addressSubRecord.setValue({ fieldId: 'zip', value: address.zipCode });
                addressSubRecord.setValue({ fieldId: 'addr1', value: address.street });
                addressSubRecord.setValue({ fieldId: 'custrecord_sit_address_i_numero', value: address.number });
                addressSubRecord.setValue({ fieldId: 'custrecord_sit_address_t_bairro', value: address.neighborhood });
            });
            return loadedCustomerRec_1.save();
        }
        catch (e) {
            throw e;
        }
    };
    exports.updateCustomer = updateCustomer;
    var updateCustomerContact = function (contact, contactID, customerID) {
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
    exports.updateCustomerContact = updateCustomerContact;
});
