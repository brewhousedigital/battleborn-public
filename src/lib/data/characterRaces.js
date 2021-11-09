const characterRaces = [
    {"id": 1, "name": "Human", "image": "create-character_human.jpg", "description": "One of the three original races. Humans are smart, cunning, and adventurous"},
    {"id": 2, "name": "High Elf", "image": "create-character_highelf.jpg", "description": "One of the three original races. High elves value magic and tradition above all else."},
    {"id": 3, "name": "Dwarf", "image": "create-character_dwarf.jpg", "description": "One of the three original races. Dwarves value gold and gems, rarely leaving their mountain fortresses."},
    {"id": 4, "name": "Wood Elf", "image": "create-character_woodelf.jpg", "description": "Wood elves left behind their immortal blood to seek a better communion with nature"},
    {"id": 5, "name": "Gnome", "image": "create-character_gnome.jpg", "description": "Skilled in engineering and technology, gnomes typically are found residing among the fortresses of the dwarves."},
    {"id": 6, "name": "Halfling", "image": "create-character_halfing.jpg", "description": "Halflings prefer the countryside more than their taller counterparts and likely live on small, rural farms."},
    {"id": 7, "name": "Orc", "image": "create-character_orc.jpg", "description": "Found high in the mountainside, Orcs make their living by farming and hunting. They are a very religious race, valuing war and fighting."},
    {"id": 8, "name": "Khajiit", "image": "create-character_khajiit.jpg", "description": "A relative newcomer to the world, the catfolk, Khajiit, make their lives travelling in caravans selling goods all around."},
    {"id": 9, "name": "Argonian", "image": "create-character_argonian.jpg", "description": "Another newcomer to the world, the lizardfolk, Argonians, live deep within the swamps."},
];

export const getRaces = (id) => {
    let array;

    if(id === "all") {
        array = characterRaces;
    } else {
        array = characterRaces.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}