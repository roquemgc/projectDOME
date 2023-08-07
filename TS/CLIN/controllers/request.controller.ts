import Https from 'N/https';

export const getExtFormsCustomers = (authenticationToken: string) => {
    try {
        return JSON.parse(Https.get({
            url: 'https://2569267.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=882&deploy=1&compid=2569267&h=6560b42975570f0ac89e',
            headers: {
                Authorization: `Basic ${authenticationToken}`
            }
        }).body);
    } catch (e) {
        throw e;
    }
}

export const createCustomerBySuiteTalk = (customer: any) => {
    try {
<<<<<<< HEAD
        const suiteTalkResponse = Https.requestSuiteTalkRest({
            url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer',
            method: Https.Method.POST,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(customer)
        });
        if (suiteTalkResponse.code == 204) 
            return 204;
        else 
            throw suiteTalkResponse.body;
=======
        return Https.requestSuiteTalkRest({
            url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer',
            body: JSON.stringify(customer)
        });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    } catch (e) {
        throw e;
    }
}

<<<<<<< HEAD
export const createContactBySuiteTalk = (contact: any) => {
    try {
        const suiteTalkResponse = Https.requestSuiteTalkRest({
            url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact',
            method: Https.Method.POST,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(contact),
        });
        if (suiteTalkResponse.code == 204) 
            return 204;
        else 
            throw suiteTalkResponse.body;
=======
export const updateCustomerBySuiteTalk = (customer: any, customerID: string | number) => {
    try {
        return Https.requestSuiteTalkRest({
            url: `https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer/${customerID}`,
            body: JSON.stringify(customer),
            method: 'PATCH'
        });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    } catch (e) {
        throw e;
    }
}

<<<<<<< HEAD
export const deleteCustomerById = (customerID: string | number) => {
    try {
        const suiteTalkResponse = Https.requestSuiteTalkRest({
            url: `https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer/${customerID}`,
            method: Https.Method.DELETE,
            headers: {
                'Content-type': 'application/json'
            }
        });
        if (suiteTalkResponse.code == 204) 
            return 204;
        else 
            throw suiteTalkResponse.body;
=======
export const createContactBySuiteTalk = (contact: any) => {
    try {
        return Https.requestSuiteTalkRest({
            url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact',
            body: JSON.stringify(contact),
        });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    } catch (e) {
        throw e;
    }
}

<<<<<<< HEAD
export const deleteContactById = (contactID: string | number) => {
    try {
        const suiteTalkResponse = Https.requestSuiteTalkRest({
            url: `https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact/${contactID}`,
            method: Https.Method.DELETE,
            headers: {
                'Content-type': 'application/json'
            }
        });
        if (suiteTalkResponse.code == 204) 
            return 204;
        else 
            throw suiteTalkResponse.body;
=======
export const updateContactBySuiteTalk = (contact: any, contactID: string | number) => {
    try {
        return Https.requestSuiteTalkRest({
            url: `https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact/${contactID}`,
            body: JSON.stringify(contact),
            method: 'PATCH'
        });
>>>>>>> 75c9173ed0983ae927be7f38cd949e578019eb35
    } catch (e) {
        throw e;
    }
}