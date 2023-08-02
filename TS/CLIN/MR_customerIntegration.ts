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
    const convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
    let suiteTalkResponse;

    const customerID = RecordController.searchCustomerByEXTFormsID(customer.id);
    Log.debug('customer', customer);
    if (customerID) 
        suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer);
    else 
       suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer, customerID);
    
    if (suiteTalkResponse.code === 204) 
        Log.audit('Customer integrated', customer);
    else 
        Log.audit('Failed to integrate customer', customer);

}

export const summarize: EntryPoints.MapReduce.summarize = (_ctx: EntryPoints.MapReduce.summarizeContext) => {
    Log.audit('EXTForms - Customers Integration executed', `ClientIntegration finished on ${new Date()}`);
}

const convertCustomerToSuiteTalkFormat = (customer: any) => {
    try {
        const convertedCustomer = {
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            fullName: customer.fullName,
            email: customer.email,
            adressList: customer.adressList,
            contactList: customer.contactList
        } as any;
    
        convertedCustomer.addressList.forEach((address: any) => {
            // suiteTalkField: address.id,
            // suiteTalkField: address.street,
            // suiteTalkField: address.number,
            // suiteTalkField: address.neighborhood,
            // suiteTalkField: address.zipCode,
            // suiteTalkField: address.stateCode,
            // suiteTalkField: address.city,
            // suiteTalkField: address.cityIbgeCode,
            // suiteTalkField: address.type
        });

        convertedCustomer.contactList.forEach((contact: any) => {
            // suiteTalkField: contact.id,
            // suiteTalkField: contact.name,
            // suiteTalkField: contact.email
        });

        return convertedCustomer;
        
    } catch (e) {
        Log.error('convertCustomerToSuiteTalkFormat error', e);
    }
}
  