import Runtime from 'N/runtime';

export const getAuthenticationToken = () => {
    try {
        return Runtime.getCurrentScript().getParameter({ name: 'a8f5f167f44f4964e6c998dee827110c' });    
    } catch (e) {
        throw e;
    }
}