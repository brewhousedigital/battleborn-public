// This API returns a single campaign by objectId in the url. This API does not validate a user token since it needs to be available to guest users

import dotenv from 'dotenv';
dotenv.config();


// Import utilities
import {generateBackendlessRestAPI} from "$lib/functions/apiUtilities";


/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(request) {
    const campaign = request.params.campaign;


    // Setup backendless API endpoint
    let endpoint = generateBackendlessRestAPI();


    // Retrieve all campaign participation records
    let campaignDataWhere = "?where=" + encodeURIComponent(`objectId = '${campaign}'`);
    let campaignData = await fetch(endpoint + "/data/d20_campaigns" + campaignDataWhere);
    campaignData = await campaignData.json();


    // Check if a campaign was returned
    if(campaignData.length !== 1) {
        return {body:{status: "failed", message: "Unable to find campaign"}}
    }


    // Bring the campaign down to a single object
    campaignData = campaignData[0];


    // Retrieve all campaign participation records
    let logsWhere = "?where=" + encodeURIComponent(`campaign_id = '${campaign}'`);
    let logsSort = "&sortBy=" + encodeURIComponent('created ASC');
    let campaignLogs = await fetch(endpoint + "/data/d20_campaign_logs" + logsWhere + logsSort);
    campaignLogs = await campaignLogs.json();


    // Clean up data
    campaignLogs.forEach(item => {
        if(item.objectId)   delete item.objectId;
        if(item.ownerId)    delete item.ownerId;
        if(item.updated)    delete item.updated;
        if(item.___class)   delete item.___class;
    })


    // Combine with the campaign data
    campaignData['logs'] = campaignLogs;


    // Clean up data
    if(campaignData.story)      delete campaignData.story;
    if(campaignData.id)         delete campaignData.id;
    if(campaignData.objectId)   delete campaignData.objectId;
    if(campaignData.ownerId)    delete campaignData.ownerId;
    if(campaignData.created)    delete campaignData.created;
    if(campaignData.___class)   delete campaignData.___class;
    if(campaignData.updated)    delete campaignData.updated;


    // Return the participating characters to the user
    return {
        body: {
            status: "success",
            data: campaignData
        }
    };
}
