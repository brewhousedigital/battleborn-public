let campaignStatus = [
    {"id": 1, "name": "Active - Open Invitation", "description": "This campaign is currently in progress, and new players are able to join."},
    {"id": 2, "name": "Active - Closed", "description": "This campaign is currently in progress, and no additional players can join."},
    {"id": 3, "name": "Completed", "description": "This campaign has concluded."}
];

export const getCampaignStatus = (id) => {
    let array;

    if(id === "all") {
        array = campaignStatus;
    } else {
        array = campaignStatus.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}