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
import * as CustomerIntegration from './customerIntegration';

export const getInputData: EntryPoints.MapReduce.getInputData = () => {
    return RequestController.getExtFormsCustomers(String(CustomerIntegration.getAuthenticationToken()));
}

export const map: EntryPoints.MapReduce.map = (ctx: EntryPoints.MapReduce.mapContext) => {
    const customer = JSON.parse(ctx.value);
    try {
        Log.debug('customer', customer);
        const convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
        Log.debug('convertedCustomer', convertedCustomer);
        const searchedCustomer = RecordController.searchCustomerByEXTFormsID(customer.id);
        Log.debug('customerID', searchedCustomer);
        let suiteTalkResponse;
    
        if (searchedCustomer) {
            suiteTalkResponse = RequestController.updateCustomerBySuiteTalk(convertedCustomer, searchedCustomer.id);
    
            convertedCustomer.contactList.forEach((contact: any) => {
                const contactID = RecordController.searchContactByEmail(contact.email);
                
                contact['company'] = searchedCustomer.id;
    
                RequestController.updateContactBySuiteTalk(contact, contactID);
            });
    
        } else { 
            suiteTalkResponse = RequestController.createCustomerBySuiteTalk(convertedCustomer);
            const searchedCustomerID = RecordController.searchCustomerByEXTFormsID(convertedCustomer.id);
            RequestController.createContactBySuiteTalk(convertedCustomer.contactList);
    
            convertedCustomer.contactList.forEach((contact: any) => {
                contact['company'] = searchedCustomerID;
    
                RequestController.createContactBySuiteTalk(contact);
            });
        }
        
        Log.debug('suiteTalkResponse', suiteTalkResponse);
        Log.audit('Customer integrated', customer);

    } catch (e) {
        Log.audit('Failed to integrate customer', `Customer: ${customer}\nErro: ${e}`);
    }
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
                        defaultbilling: address.type == 'billing-address' ? true : false,
                        defaultshipping: address.type == 'shipping-address' ? true : false,
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
        throw e;
    }
}
  