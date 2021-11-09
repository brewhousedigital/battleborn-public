// This API returns all the campaigns that the user is playing in. This API does not validate a user token since it needs to be available to guest users

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
    let participatingWhere = "?where=" + encodeURIComponent(`campaign_id = '${campaign}'`);
    let participatingCampaigns = await fetch(endpoint + "/data/d20_campaign_participants" + participatingWhere);
    participatingCampaigns = await participatingCampaigns.json();


    // Get all the character IDs in their own array
    let characterIds = participatingCampaigns.map(item => item.character_id);


    // Build the WHERE clause. This gets encoded later
    let characterWhereClause = "objectId = '" + characterIds.join("' OR objectId = '") + "'";


    // Retrieve specific campaigns
    let specificCharactersWhere = "?where=" + encodeURIComponent(characterWhereClause);
    let specificCharacters = await fetch(endpoint + "/data/d20_characters" + specificCharactersWhere);
    specificCharacters = await specificCharacters.json();


    // Clean up data
    specificCharacters.forEach(item => {
        if(item.journal)    delete item.journal;
        if(item.objectId)   delete item.objectId;
        if(item.ownerId)    delete item.ownerId;
        if(item.created)    delete item.created;
        if(item.___class)   delete item.___class;
        if(item.updated)    delete item.updated;

        // Sneaky check. This isn't really secure but someone would have to be really clever to test this
        if(!request.headers.referer.includes("/campaigns/")) {
            if(item.backstory)    delete item.backstory;
        }
    })


    // Return the participating characters to the user
    return {
        body: {
            status: "success",
            data: specificCharacters
        }
    };
}
