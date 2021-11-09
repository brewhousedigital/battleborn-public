import {getCampaignDifficulty} from "$lib/data/campaignDifficulty";
import {getCampaignImages} from "$lib/data/campaignImages";
import {getCampaignLinearity} from "$lib/data/campaignLinearity";
import {getCampaignStatus} from "$lib/data/campaignStatus";
import {slugify} from "$lib/functions/slugify";
import {userToken, userId} from "$lib/store";
import {get} from "svelte/store";


export const getCampaigns = async () => {
    let campaigns = [];
    let campaignsPlaying = [];


    // Check for campaigns
    let campaignCheck = localStorage.getItem("campaigns");
    if(campaignCheck === null) {
        campaigns = await Backendless.Data.of("d20_campaigns").find();
    } else {
        campaigns = JSON.parse(campaignCheck);
    }


    // Check for the campaigns you are playing
    let campaignPlayingCheck = localStorage.getItem("campaignsPlaying");
    if(campaignPlayingCheck === null) {
        let body = JSON.stringify({token: get(userToken), user: get(userId)})

        campaignsPlaying = await fetch("/api/campaigns/playing", {
            method: "POST", headers: {"Content-type": "application/json"}, body: body
        })
        campaignsPlaying = await campaignsPlaying.json();

        if(campaignsPlaying.status === "success") {
            campaignsPlaying = campaignsPlaying.data;
        } else {
            campaignsPlaying = [];
        }
    } else {
        campaignsPlaying = JSON.parse(campaignPlayingCheck);
    }


    // Save the most up-to-date values
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    localStorage.setItem("campaignsPlaying", JSON.stringify(campaignsPlaying));


    // Loop through and add additional information
    campaigns.forEach((campaign) => {
        campaign['url'] = "/campaigns/" + slugify(campaign['name'] + " " + campaign['id']);
        campaign['difficultyName'] = getCampaignDifficulty(campaign['difficulty'])['name'];
        campaign['difficultyDescription'] = getCampaignDifficulty(campaign['difficulty'])['description'];
        campaign['imageName'] = getCampaignImages(campaign['image'])['image'];
        campaign['linearityName'] = getCampaignLinearity(campaign['linearity'])['name'];
        campaign['linearityDescription'] = getCampaignLinearity(campaign['linearity'])['description'];
        campaign['statusName'] = getCampaignStatus(campaign['status'])['name'];
        campaign['statusDescription'] = getCampaignStatus(campaign['status'])['description'];
    })


    campaignsPlaying.forEach((campaign) => {
        campaign['url'] = "/play/" + campaign['objectId'];
        campaign['imageName'] = getCampaignImages(campaign['image'])['image'];
        campaign['statusName'] = getCampaignStatus(campaign['status'])['name'];
        campaign['statusDescription'] = getCampaignStatus(campaign['status'])['description'];
    })

    return {campaigns: campaigns, campaignsPlaying: campaignsPlaying};
}