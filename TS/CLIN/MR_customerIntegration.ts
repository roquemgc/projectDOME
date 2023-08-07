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
    let newCustomerID = 0;

    try {
        const searchedCustomerID = RecordController.searchCustomerByEXTFormsID(String(customer.id));

        if (searchedCustomerID) {
            if (RecordController.updateCustomer(customer, searchedCustomerID)) {
                const convertedContactList = convertCustomerContactToSuiteTalkFormat(customer.contactList, searchedCustomerID);
                const contactIDList = RecordController.searchCurrentCustomerContacts(searchedCustomerID);

                contactIDList.forEach((contactID: any) => {
                    RequestController.deleteContactById(contactID);
                });

                convertedContactList.forEach((contact: any) => {
                    RequestController.createContactBySuiteTalk(contact);
                });
            }
        } else { 
            const convertedCustomer = convertCustomerToSuiteTalkFormat(customer);
            const suiteTalkResponseCode = RequestController.createCustomerBySuiteTalk(convertedCustomer);

            if (suiteTalkResponseCode == 204) {
                newCustomerID = RecordController.searchCustomerByEXTFormsID(customer.id);
                Log.debug('newCustomerID', newCustomerID);
                const convertedContactList = convertCustomerContactToSuiteTalkFormat(customer.contactList, newCustomerID);
                
                convertedContactList.forEach((convertedContact: any) => {
                    Log.debug('convertedContact', convertedContact);
                    const x = RequestController.createContactBySuiteTalk(convertedContact);
                    Log.debug('x', x);
                });
            }
        }
    } catch (e) {
        Log.audit('Failed to integrate customer', `Customer: ${JSON.stringify(customer.id)}\nErro: ${e}`);
        if (newCustomerID)
            RequestController.deleteCustomerById(newCustomerID);
    }
}

export const summarize: EntryPoints.MapReduce.summarize = (_ctx: EntryPoints.MapReduce.summarizeContext) => {
    Log.audit('EXTForms - Customers Integration', `Customers Integration finished on ${new Date()}`);
}

const convertCustomerToSuiteTalkFormat = (customer: any) => {
    try {
        const convertedCustomer = {
            custentity_clin_extform_id: customer.id,
            subsidiary: 1,
            firstname: customer.firstName,
            lastname: customer.lastName,
            companyname: customer.fullName,
            email: customer.email,
            addressbook: {
                items: []
            }
        } as any;
    
        customer.addressList.forEach((address: any) => {
            convertedCustomer.addressbook.items.push(
                {
                    addressbookaddress: {
                        internalid: address.id,
                        country: 'BR',
                        state: address.stateCode,
                        city: address.city,
                        custrecord_sit_codigo_ige: address.cityIbgeCode,
                        zip: address.zipCode,
                        addr1: address.street,
                        custrecord_sit_address_i_numero: address.number,
                        custrecord_sit_address_t_bairro: address.neighborhood,
                    },
                    defaultbilling: address.type == 'billing-address' ? true : false,
                    defaultshipping: address.type == 'shipping-address' ? true : false,
                }
            );
        });

        return convertedCustomer;
        
    } catch (e) {
        Log.error('convertCustomerToSuiteTalkFormat error', e);
        throw e;
    }
}

const convertCustomerContactToSuiteTalkFormat = (contactList: any, customerID: string | number) => {
    try {
        const convertedContactList = [] as any;

        contactList.forEach((contact: any) => {
            convertedContactList.push({
                company: customerID,
                subsidiary: 1,
                firstname: contact.name,
                email: contact.email
            });
        });

        return convertedContactList;
        
    } catch (e) {
        Log.error('convertCustomerContactToSuiteTalkFormat error', e);
        throw e;
    }
}
  