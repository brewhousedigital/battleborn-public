let campaignLinearity = [
    {"id": 1, "name": "Linear", "description": "This type of story follows a set path and players should take the hints from the DM and the NPCs instead of forging their own path."},
    {"id": 2, "name": "Linear-flexible", "description": "This type of story allows for some story arc and player-made decisions but for the most part should follow the path outlined by the DM and NPCs."},
    {"id": 3, "name": "Open World", "description": "This type of story is completely up to the players to live through. Their choices affect their environment and actions can cascade into other parts of the campaign. This is an advanced play type and is not recommended for new players."}
];

export const getCampaignLinearity = (id) => {
    let array;

    if(id === "all") {
        array = campaignLinearity;
    } else {
        array = campaignLinearity.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}