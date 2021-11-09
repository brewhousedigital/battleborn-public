let campaignImages = [
    {"id": 1, "name": "Drawing on parchment", "image": "campaign-bg-autocad.jpg"},
    {"id": 2, "name": "Brick pattern", "image": "campaign-bg-bricks.jpg"},
    {"id": 3, "name": "Creepy Castle", "image": "campaign-bg-creepy-castle.jpg"},
    {"id": 4, "name": "Dark City", "image": "campaign-bg-dark-city.jpg"},
    {"id": 5, "name": "Dark Magic", "image": "campaign-bg-dark-magic.jpg"},
    {"id": 6, "name": "Dark Forest", "image": "campaign-bg-darker-forest.jpg"},
    {"id": 7, "name": "Dark Forest #2", "image": "campaign-bg-darker-forest2.jpg"},
    {"id": 8, "name": "Night Sky", "image": "campaign-bg-default.jpg"},
    {"id": 9, "name": "Dragon Attack", "image": "campaign-bg-default.jpg"},
    {"id": 10, "name": "Dragon Attack #2", "image": "campaign-bg-default.jpg"},
    {"id": 11, "name": "Dragon Attack #3", "image": "campaign-bg-default.jpg"},
    {"id": 12, "name": "Enchanted Forest", "image": "campaign-bg-enchanted-forest.jpg"},
    {"id": 13, "name": "Enchanted Forest #2", "image": "campaign-bg-enchanted-forest2.jpg"},
    {"id": 14, "name": "Lush Forest", "image": "campaign-bg-forest.jpg"},
    {"id": 15, "name": "Green Forest", "image": "campaign-bg-green-forest.jpg"},
    {"id": 16, "name": "House in the Woods", "image": "campaign-bg-house-in-the-forest.jpg"},
    {"id": 17, "name": "Castle Interior", "image": "campaign-bg-inside-castle.jpg"},
    {"id": 18, "name": "Town Interior", "image": "campaign-bg-inside-town.jpg"},
    {"id": 19, "name": "Leaves on the ground", "image": "campaign-bg-leaves.jpg"},
    {"id": 20, "name": "Magic Forest", "image": "campaign-bg-magic-forest.jpg"},
    {"id": 21, "name": "Mountains", "image": "campaign-bg-mountains.jpg"},
    {"id": 22, "name": "Old Book", "image": "campaign-bg-old-book.jpg"},
    {"id": 23, "name": "Old Book with Fire", "image": "campaign-bg-old-book-fire.jpg"},
    {"id": 24, "name": "Scrolls of Parchment", "image": "campaign-bg-parchment.jpg"},
    {"id": 25, "name": "Dark Enchantment", "image": "campaign-bg-premade-dark-enchantment.jpg"},
    {"id": 26, "name": "Rainbow Magic", "image": "campaign-bg-rainbow-magic.jpg"},
    {"id": 27, "name": "Rainbow Magic #2", "image": "campaign-bg-rainbow-magic2.jpg"},
    {"id": 28, "name": "Throne Room", "image": "campaign-bg-throne-room-fire.jpg"},
    {"id": 29, "name": "Island", "image": "campaign-island.jpg"},
    {"id": 30, "name": "Island #2", "image": "campaign-island2.jpg"}
];


export const getCampaignImages = (id) => {
    let array;

    if(id === "all") {
        array = campaignImages;
    } else {
        array = campaignImages.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}