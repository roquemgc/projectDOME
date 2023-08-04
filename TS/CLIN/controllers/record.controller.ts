import Search from 'N/search';

export const searchCustomerByEXTFormsID = (customerEXTFormsID: string | number) => {
    try {
        const searchedCustomer = Search.create({
            type: Search.Type.CUSTOMER,
            filters: [
                ['custentity_clin_extform_id', Search.Operator.IS, customerEXTFormsID]
            ],
            columns: [
                'adressbook.id',
                'contactroles.contact'
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

export const searchContactByEmail = (contactEmail: string) => {
    try {
        const searchedCustomer = Search.create({
            type: Search.Type.CONTACT,
            filters: [
                ['email', Search.Operator.IS, contactEmail]
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
