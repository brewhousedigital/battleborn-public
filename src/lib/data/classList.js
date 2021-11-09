let classList = [
    {
        "id": 1,
        "name": "Barbarian",
        "parent": 1,
        "startingChild": true,
        "image": "char-icon-barbarian-c.png",
        "description": "These warriors forgo the shield and unleash their rage at the closest threat with a variety of deadly weapons."
    },

    {
        "id": 2,
        "name": "Knight",
        "parent": 1,
        "startingChild": false,
        "image": "char-icon-knight-c.png",
        "description": "Some take up arms for glory, wealth, or revenge. Others do battle to prove themselves, to protect others, or because they know nothing else. Still others learn the ways of weaponcraft to hone their bodies in battle and prove their mettle in the forge of war."
    },

    {
        "id": 3,
        "name": "Rogue",
        "parent": 1,
        "startingChild": false,
        "image": "char-icon-rogue-c.png",
        "description": "Life is an endless adventure for those who live by their wits. Ever just one step ahead of danger, rogues bank on their cunning, skill, and charm to bend fate to their favor. Never knowing what to expect, they prepare for everything, becoming masters of a wide variety of skills."
    },

    {
        "id": 4,
        "name": "Marksman",
        "parent": 2,
        "startingChild": true,
        "image": "char-icon-marksman-c.png",
        "description": "For those who relish the thrill of the hunt, there are only predators and prey. Skilled at stalking even the most elusive game, and the expertise to defeat a wide range of enemies."
    },

    {
        "id": 5,
        "name": "Survivalist",
        "parent": 2,
        "startingChild": false,
        "image": "char-icon-survivialist-c.png",
        "description": "Be they scouts, trackers, or bounty hunters, survivalists share much in common: unique mastery of specialized weapons, and the expertise survive where others fail."
    },

    {"id": 6, "name": "Priest", "parent": 3, "startingChild": true, "image": "char-icon-priest-c.png", "description": "Life only exists to serve the Divines."},

    {"id": 7, "name": "Necromancer", "parent": 3, "startingChild": false, "image": "char-icon-necromancer-c.png", "description": "The dead only exist to serve the living."},

    {
        "id": 8,
        "name": "Beastform",
        "parent": 4,
        "startingChild": true,
        "image": "char-icon-druid-beastform-c.png",
        "description": "Druids who study the path of beastform gain the ability to shapeshift into animals and commune with wildlife."
    },

    {
        "id": 9,
        "name": "Elementform",
        "parent": 4,
        "startingChild": false,
        "image": "char-icon-druid-elementform-c.png",
        "description": "Druids who study the path of elementform gain the ability to shapeshift into Elemental beings and commune with otherworldly planes."
    },

    {
        "id": 10,
        "name": "Spirit Bond",
        "parent": 4,
        "startingChild": false,
        "image": "char-icon-druid-spiritbond-c.png",
        "description": "Druids who study the path of spirit bond gain the ability to commune with nature."
    },

    {"id": 11, "name": "Conjurer", "parent": 5, "startingChild": true, "image": "char-icon-mage-conjurer-c.png", "description": "The magic school of Summoning."},

    {"id": 12, "name": "Evoker", "parent": 5, "startingChild": false, "image": "char-icon-mage-evoker-c.png", "description": "The magic school of Arcane."},

    {"id": 13, "name": "Illusionist", "parent": 5, "startingChild": false, "image": "char-icon-mage-illusion-c.png", "description": "The magic school of Dreams."},

    {"id": 14, "name": "Transmuter", "parent": 5, "startingChild": false, "image": "char-icon-mage-transmutation-c.png", "description": "The magic school of Change."},

    {"id": 15, "name": "Abjurer", "parent": 6, "startingChild": true, "image": "char-icon-seer-abjuration-c.png", "description": "The magic school of Resisting."},

    {"id": 16, "name": "Diviner", "parent": 6, "startingChild": false, "image": "char-icon-seer-divination-c.png", "description": "The magic school of Sight."},

    {"id": 17, "name": "Enchanter", "parent": 6, "startingChild": false, "image": "char-icon-seer-enchanting-c.png", "description": "The magic school of Runes."},
];

export const getClass = (id) => {
    let array;

    if(id === "all") {
        array = classList;
    } else {
        array = classList.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}