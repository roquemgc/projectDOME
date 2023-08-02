import Search from 'N/search';

export const searchCustomerByEXTFormsID = (customerEXTFormsID: string | number) => {
    try {
        const searchedCustomer = Search.create({
            type: Search.Type.CUSTOMER,
            filters: [
                ['custbody_clin_extform_id', Search.Operator.IS, customerEXTFormsID]
            ]
        }).run().getRange({ start: 0, end: 1 });

        if (searchedCustomer) 
            return searchedCustomer[0].id;
        else 
            return 0;

    } catch (e) {
        throw e;
    }
}
