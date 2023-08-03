/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *
 * Script MapReduce responsável por realizar a integração de clientes da EXTForms com Netsuite
 * 
 */

import { EntryPoints } from 'N/types';
import Log from 'N/log';
import Record from 'N/record';
import * as RequestController from './controllers/request.controller';
import * as RecordController from './controllers/record.controller';
import * as CustomerIntegration from './customerIntegration';

export const getInputData: EntryPoints.MapReduce.getInputData = () => {

    const rec = Record.load({
        type: Record.Type.CUSTOMER,
        id: '54207'
    });

    const x = rec.getSublistSubrecord({
        fieldId: 'addressbookaddress',
        line: 1,
        sublistId: 'addressbook'
    });

    Log.debug('teste', x.getFields());
    Log.debug('teste2', x);

    return RequestController.getExtFormsCustomers(String(CustomerIntegration.getAuthenticationToken()));
}

export const map: EntryPoints.MapReduce.map = (ctx: EntryPoints.MapReduce.mapContext) => {
    
    const customer = JSON.parse(ctx.value);
    Log.debug('customer', customer);
    const convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
    Log.debug('convertedCustomer', convertedCustomer);
    const searchedCustomer = RecordController.searchCustomerByEXTFormsID(customer.id);
    Log.debug('customerID', searchedCustomer);
    let suiteTalkResponse;

    if (searchedCustomer) {
        suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer, searchedCustomer.id);
        RequestController.updateContactBySuiteTalk(convertedCustomer.contactList, searchedCustomer.contactID)
    } else {
        suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer);
        RequestController.createCustomerBySuiteTalk(convertedCustomer.contactList)
    }
    
    Log.debug('suiteTalkResponse', suiteTalkResponse);

    if (suiteTalkResponse.code === 204) 
        Log.audit('Customer integrated', customer);
    else 
        Log.audit('Failed to integrate customer', customer);

}

export const summarize: EntryPoints.MapReduce.summarize = (_ctx: EntryPoints.MapReduce.summarizeContext) => {
    Log.audit('EXTForms - Customers Integration', `Customers Integration finished on ${new Date()}`);
}

const convertCustomerToSuiteTalkFormat = (customer: any) => {
    try {
        const convertedCustomer = {
            id: customer.id,
            firstname: customer.firstName,
            lastname: customer.lastName,
            custentity_clin_fullname: customer.fullName,
            email: customer.email,
            addressbook: {
                items: []
            },
            contactList: []
        } as any;
    
        customer.addressList.forEach((address: any) => {
            convertedCustomer.items.adressList.push(
                {
                    addressbookaddress: {
                        internalid: address.id,
                        custrecord_sit_address_l_tp_logr: address.type,
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        custrecord_sit_codigo_ige: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        custrecord_sit_address_i_numero: address.number,
                        custrecord_sit_address_t_bairro: address.neighborhood,
                    }
                }
            );
        });

        customer.contactList.forEach((contact: any) => {
            convertedCustomer.contactList.push({
                internalid: contact.id,
                firstname: contact.name,
                email: contact.email
            });
        });

        return convertedCustomer;
        
    } catch (e) {
        Log.error('convertCustomerToSuiteTalkFormat error', e);
    }
}
  