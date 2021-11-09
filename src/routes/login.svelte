<script>
    // Helper functions
    import {goto} from "$app/navigation";
    import {onMount} from 'svelte';
    import {setUserToken, userData} from "$lib/store";
    import {buttonProcessingState, buttonProcessingStateEnable} from "$lib/functions/buttonProcessingState";

    // Components
    import AlertBar from "$lib/page-components/AlertBar.svelte";

    // Variables
    let formData = {};

    // Error messaging
    let messageLogOut = false;
    let errorMessage = "";


    onMount(async() => {
        let message = window.location.search;
        if(message.includes("message=logout")) messageLogOut = true
    })

    async function onSubmit(e) {
        e.preventDefault();

        // Reset error message
        errorMessage = "";

        buttonProcessingState("#submitBtn");

        // Login!
        try {
            let loginResponse = await Backendless.UserService.login(
                formData.email,
                formData.password,
                true
            );

            // Checkmark the button
            buttonProcessingState("#submitBtn", true);

            // Reset cache essentially
            localStorage.removeItem("characters");
            localStorage.removeItem("campaigns");
            localStorage.removeItem("campaignsPlaying");

            // Store the user info
            setUserToken();

            // Save the return values from Backendless
            userData.set(loginResponse);

            // Send user to their new account page
            await goto("/account");
        }
        catch(error) {
            errorMessage = error.message;
            setTimeout(() => {buttonProcessingStateEnable("#submitBtn", "Login");}, 1500);
        }
    }
</script>


<svelte:head>
    <title>Sign In</title>
</svelte:head>


<section class="container">
    <h1 class="display-1 mb-5">Sign In</h1>

    <div class="row mb-5">
        <div class="col-xl-4 col-md-6">
            {#if messageLogOut}
                <div class="alert alert-warning" role="alert">You have been logged out.</div>
            {/if}

            <form class="card card-body" on:submit={onSubmit}>
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email"
                           class="form-control"
                           id="email"
                           bind:value={formData.email}
                           placeholder="name@example.com">
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password"
                           class="form-control"
                           id="password"
                           bind:value={formData.password}>
                </div>

                {#if errorMessage !== ""}
                    <AlertBar text={errorMessage} />
                {/if}

                <button type="submit" id="submitBtn" class="btn btn-primary">Login</button>
            </form>
        </div><!-- end col -->
    </div><!-- end row -->

    <p class="font-24 mb-0">Need to create an account?</p>
    <p class="font-24"><a href="/register">Register here!</a></p>
</section>