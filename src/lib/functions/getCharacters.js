import {goto} from "$app/navigation";
import {buildCharacterData} from "$lib/functions/buildCharacterData";

export const getCharacters = async () => {
    let characters = [];

    if(localStorage.getItem("characters") === null) {
        try {
            characters = await Backendless.Data.of("d20_characters").find();
        }
        catch(error) {
            console.log(error.message);
            if(error.message.slice(0,15) === "Session timeout") {goto("/logout")}
        }
    } else {
        characters = JSON.parse(localStorage.getItem("characters"))
    }

    localStorage.setItem("characters", JSON.stringify(characters))

    // Set up characters with the right information
    characters = buildCharacterData(characters);

    return characters;
}