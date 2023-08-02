import Search from 'N/search';

export const searchCustomerByEXTFormsID = (customerEXTFormsID: string | number) => {
    try {
        const searchedCustomer = Search.create({
            type: Search.Type.CUSTOMER,
            filters: [
                ['internalid', Search.Operator.IS, 1234444]
                // ['custbody_clin_extform_id', Search.Operator.IS, customerEXTFormsID]
            ]
        }).run().getRange({ start: 0, end: 1 });

        if (searchedCustomer.length) 
            return searchedCustomer[0].id;
        else 
            return 0;

    } catch (e) {
        throw e;
    }
}
