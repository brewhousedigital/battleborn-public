<script>
    // Helper functions
    import {buttonProcessingState, buttonProcessingStateEnable} from "$lib/functions/buttonProcessingState";
    import {setUserToken, userData} from "$lib/store";
    import {goto} from "$app/navigation";

    // Components
    import AlertBar from "$lib/page-components/AlertBar.svelte";

    // Variables
    let formData = {};
    
    // Error message handling
    let errorMessage = "";

    async function onSubmit(e) {
        e.preventDefault();

        // Reset error message
        errorMessage = "";

        buttonProcessingState("#submitBtn");

        // Register!
        try {
            // Build the user Object
            let newUser = new Backendless.User();
            newUser.email = formData.email;
            newUser.password = formData.password;

            // Register them in the system to trigger the confirmation email
            await Backendless.UserService.register(newUser);

            // Checkmark the button
            buttonProcessingState("#submitBtn", true);

            // Reset cache essentially
            localStorage.removeItem("characters");
            localStorage.removeItem("campaigns");
            localStorage.removeItem("campaignsPlaying");
            localStorage.removeItem("Backendless_BFD3873C-0565-EBFE-FFA8-8001D60AC000");

            // Send user to a page telling them to confirm their account
            await goto("/register/confirm-email");
        }
        catch(error) {
            errorMessage = error.message;
            setTimeout(() => {buttonProcessingStateEnable("#submitBtn", "Register");}, 1500);
        }
    }
</script>


<svelte:head>
    <title>Create an Account</title>
</svelte:head>


<section class="container">
    <h1 class="display-1 mb-5">Create an Account</h1>

    <div class="row mb-5">
        <div class="col-xl-4 col-md-6">

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

                <button type="submit" id="submitBtn" class="btn btn-primary">Register</button>
            </form>
        </div><!-- end col -->
    </div><!-- end row -->

    <p class="font-24 mb-0">Already have an account?</p>
    <p class="font-24"><a href="/register">Log In here!</a></p>
</section>