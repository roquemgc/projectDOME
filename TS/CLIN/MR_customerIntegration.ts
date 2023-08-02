/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *
 * Script MapReduce responsável por realizar a integração de clientes da EXTForms com Netsuite
 * 
 */

import { EntryPoints } from 'N/types';
import Log from 'N/log';
import * as RequestController from './controllers/request.controller';
import * as RecordController from './controllers/record.controller';

export const getInputData: EntryPoints.MapReduce.getInputData = () => {
    return RequestController.getExtFormsCustomers();
}

export const map: EntryPoints.MapReduce.map = (ctx: EntryPoints.MapReduce.mapContext) => {
    const customer = JSON.parse(ctx.value);
    Log.debug('customer', customer);
    const convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
    Log.debug('convertedCustomer', convertedCustomer);
    const customerID = RecordController.searchCustomerByEXTFormsID(customer.id);
    Log.debug('customerID', customerID);
    let suiteTalkResponse;

    if (customerID) 
        suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer, customerID);
    else 
        suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer);
    
    
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
                        suiteTalkField: address.id,
                        suiteTalkField: address.type,
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        suiteTalkField: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        suiteTalkField: address.number,
                        suiteTalkField: address.neighborhood,
                    }
                }
            );
        });

        customer.contactList.forEach((contact: any) => {
            convertedCustomer.contactList.push({
                // suiteTalkField: contact.id,
                // suiteTalkField: contact.name,
                // suiteTalkField: contact.email
            });
        });

        return convertedCustomer;
        
    } catch (e) {
        Log.error('convertCustomerToSuiteTalkFormat error', e);
    }
}
  