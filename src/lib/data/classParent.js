let classParent = [
    {
        "id": 1,
        "name": "Warrior",
        "description": "Warriors combine strength, leadership, and a vast knowledge of arms and armor to wreak havoc in glorious combat."
    },

    {
        "id": 2,
        "name": "Ranger",
        "description": "For those who relish the thrill of the hunt, there are only predators and prey. Be they scouts, trackers, or bounty hunters, rangers share much in common: unique mastery of specialized weapons, skill at stalking even the most elusive game, and the expertise to defeat a wide range of enemies."
    },

    {
        "id": 3,
        "name": "Cleric",
        "description": "Characters who study the Divines can become followers of any deity. Morality is a social construct in the eyes of the gods."
    },

    {
        "id": 4,
        "name": "Druid",
        "description": "Characters who take on druidism must choose a path that fits their nature. Beastform, Elementform, or a Spirit Bond with nature. Once a path has been chosen, a druid may not go into another path without first absolving all they know about their current spells."
    },

    {
        "id": 5,
        "name": "Mage",
        "description": "Characters who take on Sorcery can study many schools of magic. Become a jack of all trades or study extensively in one subject to gain mastery."
    },

    {
        "id": 6,
        "name": "Seer",
        "description": "Characters who develop their mind's eye can become powerful in the avoidance of danger. Many Seers live to a long age due to their uncanny ability to protect themselves against enemies."
    }
];

export const getClassParent = (id) => {
    let array;

    if(id === "all") {
        array = classParent;
    } else {
        array = classParent.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}