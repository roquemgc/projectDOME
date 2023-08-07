/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 * UserEvent aplicado à Cliente para evitar a edição de campos integrados via script
 * 
 */

import { EntryPoints } from 'N/types';
import Log from 'N/log';

export const beforeSubmit: EntryPoints.UserEvent.beforeSubmit = (ctx: EntryPoints.UserEvent.beforeSubmitContext) => {
    try {
        const newCustomerRec = ctx.newRecord;
        const oldCustomerRec = ctx.oldRecord;

        if ((ctx.type == ctx.UserEventType.EDIT || ctx.type == ctx.UserEventType.XEDIT)) {
            const newFieldsValue = getFieldsToCompare(newCustomerRec);
            const oldFieldsValue = getFieldsToCompare(oldCustomerRec);

            const equalsCheck = (a: any, b: any) => {
                return JSON.stringify(a) === JSON.stringify(b);
            }

            if (!equalsCheck(newFieldsValue, oldFieldsValue))
                throw 'O campo E-mail e os campos de Endereço de Faturamento são editados somente via integração';
        }
    } catch (e) {
        Log.error('beforeSubmit error', e);
        throw e;
    }
}

const getFieldsToCompare = (customerRec: any) => {
    const addressLineCount = customerRec.getLineCount({ sublistId: 'addressbook' });
    const addressSubRecordValues = [];

    addressSubRecordValues.push(customerRec.getValue('email'));

    for (let i = addressLineCount - 1; i >= 0; i--) {
        const isBilligAddress = customerRec.getSublistValue({ 
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
            const addressSubRecord = customerRec.getSublistSubrecord({
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
}
 