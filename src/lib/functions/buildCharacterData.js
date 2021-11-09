import {getClass} from "$lib/data/classList";
import {slugify} from "$lib/functions/slugify";
import {getDeities} from "$lib/data/characterDeities";
import {getHeights} from "$lib/data/characterHeights";
import {getProfessions} from "$lib/data/characterProfessions";
import {getRaces} from "$lib/data/characterRaces";
import {getClassParent} from "$lib/data/classParent";
import {getSpells} from "$lib/data/classSpells";
import {getItems} from "$lib/data/items";

export const buildCharacterData = (arrayOfCharacters) => {
    arrayOfCharacters.forEach((character) => {
        character['shield'] = getClass(character['class'])['image'];
        character['className'] = getClass(character['class'])['name'];
        character['url'] = slugify(character['name'] + " " + character['id']);

        character['deityName'] = getDeities(character['deity'])['name'];
        character['heightName'] = getHeights(character['height'])['name'];
        character['professionName'] = getProfessions(character['profession'])['name'];
        character['raceName'] = getRaces(character['race'])['name'];

        character['classParent'] = getClassParent(
            getClass(character['class'])['parent']
        )['name'];

        character['spells'] = getSpells(character['class']);

        // Reset inventory if null
        if(character['inventory'] === null) character['inventory'] = [];

        // Grab inventory items
        let inventoryItems = [];

        character['inventory'].forEach((item) => {
            inventoryItems = [...inventoryItems, getItems(item)]
        })

        character['inventoryItems'] = inventoryItems;
    });

    return arrayOfCharacters;
}