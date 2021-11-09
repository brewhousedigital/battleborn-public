export const getCampaignPlayers = async(campaignID) => {
    let playersFetch = await fetch(`/api/campaigns/${campaignID}/players`);
    playersFetch = await playersFetch.json();
    return playersFetch.data;
}