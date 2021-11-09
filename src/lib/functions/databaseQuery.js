import {goto} from "$app/navigation";

export const databaseQuery = async (callback) => {
    try {
        await callback();
    }
    catch(error) {
        // TODO: every catch, see if you can use the Backendless Log feature
        console.log(error);
        if(error.message.slice(0,15) === "Session timeout") {
            goto("/logout")
        }
    }
}