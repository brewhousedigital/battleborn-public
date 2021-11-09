const characterProfessions = [
    {"id": 1, "name": "Historian", "description": "Knowledge of historical fact so you aren't doomed to repeat it. Uses: Wisdom"},
    {"id": 2, "name": "Linguist", "description": "Learning and knowing new languages become second nature to you. Uses: Wisdom"},
    {"id": 3, "name": "Locksmith", "description": "Locked doors and chests become only a slight nuisance. Uses: Dexterity"},
    {"id": 4, "name": "Alchemist", "description": "Ability to craft potions of any caliber. Uses: Intelligence"},
    {"id": 5, "name": "Royal Courtier", "description": "You are seen as a learned, and respectful person. Uses: Charisma"},
    {"id": 6, "name": "Tailor", "description": "Ability to craft fine cloth armor, bandages, and gear. Uses: Dexterity"},
    {"id": 7, "name": "Blacksmith", "description": "Ability to restore and craft weapons of all kinds. Uses: Strength"},
    {"id": 8, "name": "None", "description": "Your mind is blank and ready to be filled with adventure."}
];

export const getProfessions = (id) => {
    let array;

    if(id === "all") {
        array = characterProfessions;
    } else {
        array = characterProfessions.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}