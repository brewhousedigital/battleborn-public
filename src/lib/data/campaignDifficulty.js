let campaignDifficulty = [
    {"id": 1, "name": "Easy", "description": "This type of story is typically shorter and the chance of death is low. Enemies can be lower level and the quests can be a cakewalk."},
    {"id": 2, "name": "Intermediate", "description": "This type of story requires a bit more thinking on the player's side. Puzzles and enemies can be stronger and more strategy will be required to defeat them."},
    {"id": 3, "name": "Advanced", "description": "This type of story is very challenging and will require the players to work together on every action they take. The chance of dying is highly likely in this type of campaign."}
];


export const getCampaignDifficulty = (id) => {
    let array;

    if(id === "all") {
        array = campaignDifficulty;
    } else {
        array = campaignDifficulty.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}