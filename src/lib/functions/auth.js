import {
    authenticated,
    loading,
    userToken,
    setUserToken,
    userData
} from "$lib/store";
import privateRoutes from "$lib/data/privateRoutes.json";
import {navigating} from '$app/stores';
import {onDestroy} from 'svelte';
import {get} from "svelte/store";


export const initAuthentication = async() => {
    try {
        let response = await Backendless.UserService.getCurrentUser()

        // Update state
        setUserToken();

        // Check if user is logged in
        if(response !== null) {
            // User is logged in
            authenticated.set(true);
            userData.set(response);

            // Loading complete
            loading.set(false);
        } else {
            // Confirm what page they're on
            if(!privateRoutes.includes(window.location.pathname)) {
                // User is on a restricted page
                loading.set(true);
                window.location = "/login?error=restricted-page";
            } else {
                // Loading complete
                loading.set(false);
            }
        }
    }
    catch(error) {
        console.log(error);

        // Clear out user details
        localStorage.removeItem("Backendless_BFD3873C-0565-EBFE-FFA8-8001D60AC000");
        userToken.set(null);

        // Send them to the login page if an error occurs
        window.location = "/login?error=something-went-wrong";
    }
}


export const verifyPrivateRoutes = async () => {
    // Protected Routes system
    let navigationSubscription = navigating.subscribe(async(item) => {
        if(item !== null) {
            // User is currently navigating
            let destination = item.to.path;

            // See if user is logged out
            let checkForUserToken = get(userToken);
            if(checkForUserToken === null || checkForUserToken === undefined) {
                // Scan through whitelist
                if(!privateRoutes.includes(destination)) {
                    // Block page while redirect is happening
                    loading.set(true);
                    window.location = "/login?error=unable-to-navigate";
                }
            }
        }
    })

    // Always unsubscribe from subscriptions
    onDestroy(navigationSubscription);
}