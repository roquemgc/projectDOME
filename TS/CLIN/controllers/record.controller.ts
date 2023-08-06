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

export const searchContactByEmail = (contactEmail: string, customerID: string | number) => {
    try {
        const searchedCustomer = Search.create({
            type: Search.Type.CONTACT,
            filters: [
                ['email', Search.Operator.IS, contactEmail],
                'AND',
                ['customer.internalid', Search.Operator.IS, customerID]
            ]
        }).run().getRange({ start: 0, end: 1 }) as any;

        if (searchedCustomer.length) 
            return searchedCustomer[0];
        else 
            return 0;

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
        loadedCustomerRec.setValue({ fieldId: 'isperson', value: 'T' });
        loadedCustomerRec.setValue({ fieldId: 'firstname', value: customer.firstName });
        loadedCustomerRec.setValue({ fieldId: 'lastname', value: customer.lastName });
        loadedCustomerRec.setValue({ fieldId: 'custentity_clin_fullname', value: customer.fullName });
        loadedCustomerRec.setValue({ fieldId: 'email', value: customer.email })

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
