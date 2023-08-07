/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 * UserEvent aplicado à Cliente para evitar a edição de campos integrados via script
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/log"], function (require, exports, log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeSubmit = void 0;
    log_1 = __importDefault(log_1);
    var beforeSubmit = function (ctx) {
        try {
            var newCustomerRec = ctx.newRecord;
            var oldCustomerRec = ctx.oldRecord;
            if ((ctx.type == ctx.UserEventType.EDIT || ctx.type == ctx.UserEventType.XEDIT)) {
                var newFieldsValue = getFieldsToCompare(newCustomerRec);
                var oldFieldsValue = getFieldsToCompare(oldCustomerRec);
                var equalsCheck = function (a, b) {
                    return JSON.stringify(a) === JSON.stringify(b);
                };
                if (!equalsCheck(newFieldsValue, oldFieldsValue))
                    throw 'O campo E-mail e os campos de Endereço de Faturamento são editados somente via integração';
            }
        }
        catch (e) {
            log_1.default.error('beforeSubmit error', e);
            throw e;
        }
    };
    exports.beforeSubmit = beforeSubmit;
    var getFieldsToCompare = function (customerRec) {
        var addressLineCount = customerRec.getLineCount({ sublistId: 'addressbook' });
        var addressSubRecordValues = [];
        addressSubRecordValues.push(customerRec.getValue('email'));
        for (var i = addressLineCount - 1; i >= 0; i--) {
            var isBilligAddress = customerRec.getSublistValue({
                sublistId: 'addressbook',
                line: i,
                fieldId: 'defaultbilling',
            });
            if (isBilligAddress) {
                addressSubRecordValues.push(customerRec.getSublistValue({
                    sublistId: 'addressbook',
                    line: i,
                    fieldId: 'defaultshipping',
                }));
                addressSubRecordValues.push(isBilligAddress);
                var addressSubRecord = customerRec.getSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress',
                    line: i
                });
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'country' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'state' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'city' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'custrecord_sit_codigo_ige' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'zip' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'addr1' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'custrecord_sit_address_i_numero' }));
                addressSubRecordValues.push(addressSubRecord.getValue({ fieldId: 'custrecord_sit_address_t_bairro' }));
            }
        }
        return addressSubRecordValues;
    };
});
