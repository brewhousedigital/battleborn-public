import {getItems} from "$lib/data/items";
import {guestCharacter} from "$lib/store";


export const characterInventoryRemove = (character, characterSlug, itemID, sell = false) => {
    let text = sell ? 'sell' : 'delete';
    let confirmDelete = confirm(`Are you sure you want to ${text} this item?`);

    if(confirmDelete) {
        // Remove from inventory first
        let found1 = 0;
        character.inventory.forEach((item, index) => {
            if(!found1) {
                if(item === itemID) {
                    character.inventory.splice(index, 1);
                    found1 = 1;
                }
            }
        })

        character.inventory = [...character.inventory]


        // Then remove from inventory items. Also get the gold amount for selling
        let found2 = 0;
        let price = 0;
        character.inventoryItems.forEach((item, index) => {
            if(!found2) {
                if(item.rowid === itemID) {
                    price = item.price;
                    character.inventoryItems.splice(index, 1);
                    found2 = 1;
                }
            }
        })

        character.inventoryItems = [...character.inventoryItems]

        // Sell item if needed
        if(sell) {
            character.gold = character.gold + price;
        }

        if(characterSlug === "guest") {
            localStorage.setItem("guestCharacter", JSON.stringify(character));
            guestCharacter.set(character);
        } else {
            // TODO: Rebuild this to be async
            Backendless.Data.of("d20_characters").save(character)
                .then(function(response) {console.log(response)/* TODO: A toast might be cool */})
                .catch(function(error) {console.log(error)});
        }

        // Clear out localstorage
        localStorage.removeItem("characters");

        return character;
    }

    return character;
}


export const characterInventoryAdd = (character, characterSlug, itemID) => {
    // Add from inventory first
    character.inventory = [...character.inventory, itemID];

    // Then add to inventory items.
    let newItem = getItems(itemID);
    character.inventoryItems = [...character.inventoryItems, newItem];

    if(characterSlug === "guest") {
        localStorage.setItem("guestCharacter", JSON.stringify(character));
        guestCharacter.set(character);
    } else {
        // TODO: Rebuild this to be Async
        Backendless.Data.of("d20_characters").save(character)
            .then(function(response) {console.log(response)/* TODO: A toast might be cool */})
            .catch(function(error) {console.log(error)});
    }

    // Clear out localstorage
    localStorage.removeItem("characters");

    return character;
}