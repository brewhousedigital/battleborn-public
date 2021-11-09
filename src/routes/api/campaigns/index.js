// This API returns all the campaigns in the database
// Currently not being used for anything

import dotenv from 'dotenv';
dotenv.config();


// Import utilities
import {generateBackendlessRestAPI} from "$lib/functions/apiUtilities";


/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request) {
    const data = request.body;

    // Validate POST data
    let valid = true;
    let errorMessage = "Something went wrong";

    if(!data.token) {valid = false; errorMessage = "Unable to find your account.";}

    // Finish validation
    if(!valid) {return {body:{status: "failed", message: errorMessage}}}


    /**********************************************************/


    // Setup backendless API endpoint
    let endpoint = generateBackendlessRestAPI();


    // Validate user token
    let validToken = await fetch(endpoint + "/users/isvalidusertoken/" + data.token);
    if(!validToken) {return {body:{status: "failed", message: "Unable to sync your account."}}}


    // Retrieve all campaigns
    let allCampaigns = await fetch(endpoint + "/data/d20_campaigns");
    allCampaigns = await allCampaigns.json();


    // Don't reveal all the campaign info
    return {
        body: {
            status: "success",
            data: "I know you believe you understand what I said, but I am not sure you realize that what you heard is not what I meant!"
        }
    };
}
