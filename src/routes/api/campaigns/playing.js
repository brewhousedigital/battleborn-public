// This API returns all the players that a campaign has

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
    if(!data.user) {valid = false; errorMessage = "Unable to find your account.";}

    // Finish validation
    if(!valid) {return {body:{status: "failed", message: errorMessage}}}


    /**********************************************************/


    // Setup backendless API endpoint
    let endpoint = generateBackendlessRestAPI();


    // Validate user token
    let validToken = await fetch(endpoint + "/users/isvalidusertoken/" + data.token);
    if(!validToken) {return {body:{status: "failed", message: "Unable to sync your account."}}}


    // Retrieve all campaign participation records
    // Users are able to insert their own records so their objectId is stored as the table's ownerId
    let participatingWhere = "?where=" + encodeURIComponent(`ownerId = '${data.user}'`);
    // Check if a character ID was passed along in the POST request
    if(data.characterId) {
        participatingWhere += encodeURIComponent(` and character_id = '${data.characterId}'`);
    }
    let participatingCampaigns = await fetch(endpoint + "/data/d20_campaign_participants" + participatingWhere);
    participatingCampaigns = await participatingCampaigns.json();


    // Could potentially include the character ID too and
    // create some UI that shows what character is on what campaign
    let campaignIds = participatingCampaigns.map(item => item.campaign_id);


    // Build the WHERE clause. This gets encoded later
    let campaignWhereClause = "objectId = '" + campaignIds.join("' OR objectId = '") + "'";


    // Retrieve specific campaigns
    let specificCampaignsWhere = "?where=" + encodeURIComponent(campaignWhereClause);
    let specificCampaigns = await fetch(endpoint + "/data/d20_campaigns" + specificCampaignsWhere);
    specificCampaigns = await specificCampaigns.json();


    // Clean up data
    specificCampaigns.forEach(item => {
        if(item.lore)       delete item.lore;
        if(item.linearity)  delete item.linearity;
        if(item.ownerId)    delete item.ownerId;
        if(item.difficulty) delete item.difficulty;
        if(item.___class)   delete item.___class;
        if(item.story)      delete item.story;
    })


    // Return the participating campaigns to the user
    return {
        body: {
            status: "success",
            data: specificCampaigns
        }
    };
}
