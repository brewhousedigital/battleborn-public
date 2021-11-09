<script>
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {setUserToken} from "$lib/store";

    onMount(async() => {
        try {await Backendless.UserService.logout();}
        catch(error) {console.log(error)}

        // Reset cache essentially
        localStorage.removeItem("characters");
        localStorage.removeItem("campaigns");
        localStorage.removeItem("campaignsPlaying");
        localStorage.removeItem("Backendless_BFD3873C-0565-EBFE-FFA8-8001D60AC000");
        setUserToken();

        // Fake timer so it doesnt flash so dang fast
        setTimeout(() => {
            goto("/login?message=logout");
        }, 1000)
    })
</script>


<svelte:head>
    <title>Logging Out...</title>
</svelte:head>


<section class="container">
    <h1>Logging out...</h1>
</section>