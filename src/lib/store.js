import {writable} from 'svelte/store';

// Controls visibility of authenticated components
export const authenticated = writable(false);
// User's log in token
export const userToken = writable(null);
// User's ObjectId
export const userId = writable(null);
// All user data from the Users table
export const userData = writable(null);
// Controls visibility of the site
export const loading = writable(true);
// Global theme
export const theme = writable("light");


// Handle guest character information
export const guestCharacter = writable(null);


// Helper functions
export const setUserToken = () => {
    let token = localStorage.getItem("Backendless_BFD3873C-0565-EBFE-FFA8-8001D60AC000");

    if(token !== null) {
        // Grab the user's authentication token
        token = JSON.parse(token);
        userToken.set(token['user-token']);
        userId.set(token['current-user-id']);
        authenticated.set(true);
    } else {
        // No token found
        authenticated.set(false);
        userToken.set(null);
        userId.set(null);
    }
}


export const setGuestCharacter = () => {
    let checkForGuestCharacter = JSON.parse(localStorage.getItem("guestCharacter"));

    if(checkForGuestCharacter !== null) {
        guestCharacter.set(checkForGuestCharacter);
    } else {
        guestCharacter.set(null);
    }
}


// Subscriptions