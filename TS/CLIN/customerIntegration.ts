import Runtime from 'N/runtime';

export const getAuthenticationToken = () => {
    try {
        return Runtime.getCurrentScript().getParameter({ name: 'custscript_clin_integration_token' });    
    } catch (e) {
        throw e;
    }
}