import Record from 'N/record';
import Search from 'N/search';

export const searchCustomerByEXTFormsID = (customerEXTFormsID: string) => {
    try {
        const searchedCustomer = Search.create({
            type: Search.Type.CUSTOMER,
            filters: [
               ['custentity_clin_extform_id', Search.Operator.IS, String(customerEXTFormsID)]
            ]
        }).run().getRange({ start: 0, end: 1 }) as any;

        if (searchedCustomer.length) 
            return searchedCustomer[0].id;
        else 
            return 0;

    } catch (e) {
        throw e;
    }
}

export const searchCurrentCustomerContacts = (customerID: string | number) => {
    try {
        const contactIDList = [] as any; 

        Search.create({
            type: Search.Type.CONTACT,
            filters: [
                ['customer.internalid', Search.Operator.ANYOF, customerID]
            ]
        }).run().each((contact: any) => {
            contactIDList.push(contact.id);

            return true;
        });

        return contactIDList;

    } catch (e) {
        throw e;
    }
}

export const updateCustomer = (customer: any, customerID: string | number) => {
    try {
        const loadedCustomerRec = Record.load({
            type: Record.Type.CUSTOMER,
            id: customerID
        });

        loadedCustomerRec.setValue({ fieldId: 'custentity_clin_extform_id', value: customer.id });
        loadedCustomerRec.setValue({ fieldId: 'subsidiary', value: 1 });
        loadedCustomerRec.setValue({ fieldId: 'isperson', value: 'F' });
        loadedCustomerRec.setValue({ fieldId: 'firstname', value: customer.firstName });
        loadedCustomerRec.setValue({ fieldId: 'lastname', value: customer.lastName });
        loadedCustomerRec.setValue({ fieldId: 'companyname', value: customer.fullName });
        loadedCustomerRec.setValue({ fieldId: 'email', value: customer.email });

        const addressLineCount = loadedCustomerRec.getLineCount({ sublistId: 'addressbook' });

        for (let i = addressLineCount - 1; i >= 0; i--) {
            loadedCustomerRec.removeLine({ sublistId: 'addressbook', line: i });
        }

        customer.addressList.forEach((address: any, index: number) => {
            loadedCustomerRec.setSublistValue({ 
                sublistId: 'addressbook', 
                line: index, 
                fieldId: 'defaultbilling', 
                value: address.type == 'billing-address' ? true : false 
            });
            loadedCustomerRec.setSublistValue({ 
                sublistId: 'addressbook', 
                line: index, 
                fieldId: 'defaultshipping', 
                value: address.type == 'shipping-address' ? true : false 
            });

            const addressSubRecord = loadedCustomerRec.getSublistSubrecord({
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

        return loadedCustomerRec.save();

    } catch (e) {
        throw e;
    }
}

export const updateCustomerContact = (contact: any, contactID: string | number, customerID: string | number) => {
    try {
        const loadedContactRed = Record.load({
            type: Record.Type.CONTACT,
            id: contactID
        });
        loadedContactRed.setValue({ fieldId: 'company', value: customerID });
        loadedContactRed.setValue({ fieldId: 'subsidiary', value: 1 });
        loadedContactRed.setValue({ fieldId: 'firstName', value: contact.name });
        loadedContactRed.setValue({ fieldId: 'email', value: contact.email });

        return loadedContactRed.save();

    } catch (e) {
        throw e;
    }
}
