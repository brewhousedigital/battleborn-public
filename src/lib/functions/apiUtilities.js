// Sanitize value using regex
export const sanitize = (value) => {
    return value.replace(/[^a-zA-Z0-9 '@+./#-]/g, "")
}


// Generate standard Backendless REST url
export const generateBackendlessRestAPI = () => {
    const APP_URL = "https://api.backendless.com/";
    const APP_ID = process.env['BACKENDLESS_APP_ID'];
    const API_KEY = process.env['BACKENDLESS_API_KEY_REST'];
    return APP_URL + APP_ID + "/" + API_KEY;
}