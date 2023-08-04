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
        return Https.requestSuiteTalkRest({
            url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer',
            body: JSON.stringify(customer)
        });
    } catch (e) {
        throw e;
    }
}

export const updateCustomerBySuiteTalk = (customer: any, customerID: string | number) => {
    try {
        return Https.requestSuiteTalkRest({
            url: `https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer/${customerID}`,
            body: JSON.stringify(customer),
            method: 'PATCH'
        });
    } catch (e) {
        throw e;
    }
}

export const createContactBySuiteTalk = (contact: any) => {
    try {
        return Https.requestSuiteTalkRest({
            url: 'https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact',
            body: JSON.stringify(contact),
        });
    } catch (e) {
        throw e;
    }
}

export const updateContactBySuiteTalk = (contact: any, contactID: string | number) => {
    try {
        return Https.requestSuiteTalkRest({
            url: `https://4857231-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/contact/${contactID}`,
            body: JSON.stringify(contact),
            method: 'PATCH'
        });
    } catch (e) {
        throw e;
    }
}