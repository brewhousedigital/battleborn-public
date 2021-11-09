<script>
    // Helper functions
    import {afterUpdate, onMount} from 'svelte';
    import {slideToggle} from "$lib/functions/slideToggle";
    import {getAvatar} from "$lib/data/avatars";
    import {getTheme} from "$lib/data/themes";
    import {userData, theme} from "$lib/store";

    // Components
    import CharacterList from "$lib/page-components/CharacterList.svelte"
    import CampaignList from "$lib/page-components/CampaignList.svelte"

    // Variables
    let campaigns = [];
    let avatars = [];
    let themes = [];

    let characterBlockToggle = false;
    let characterBlockSize = "small";

    // Backup object for the Update function to reset to
    let backupUserData = {...$userData};

    let startedPlayingDate = "";

    onMount(async () => {
        avatars = getAvatar("all");
        themes = getTheme("all");

        let startedPlayingTimestamp = String(new Date($userData.created));
        let time = startedPlayingTimestamp.split(" ");
        startedPlayingDate = `${time[1]} ${time[2]}, ${time[3]}`;
    })

    afterUpdate(() => {
        console.log("how many times does this run")
        characterBlockToggle
            ? characterBlockSize = "large"
            : characterBlockSize = "small";
    })

    async function handleAccountEdit(e) {
        e.preventDefault();

        let form = new FormData(e.target);
        let elements = e.target.elements;

        // Themes
        // 1 = light
        // 2 = dark

        userData.set({
            ...$userData,
            name: form.get("name"),
            avatar: parseInt(form.get("avatar")),
            theme: parseInt(form.get("theme"))
        });

        await Backendless.Data.of("Users").save($userData)
        party.confetti(elements['submit']);

        if(parseInt(form.get("theme")) === 1) {theme.set("light")}
        if(parseInt(form.get("theme")) === 2) {theme.set("dark")}
    }


</script>


<svelte:head>
    <title>Account</title>
</svelte:head>


<!-- Authenticated -->
{#if $userData !== null || $userData !== undefined}
    <section class="container">
        <div class="pb-5 border-bottom mb-5">
            <div class="row align-items-center">
                <div class="col" style="max-width: 200px">
                    <img src="/images/avatars/{getAvatar($userData.avatar).image}"
                         alt="Shield for {$userData.name}"
                         width="250"
                         height="250"
                         class="img-fluid">
                </div><!-- end col -->

                <div class="col">
                    <h1 class="mb-2">Welcome to your account, {$userData.name}</h1>
                    <p class="mb-0 text-muted"><strong>Started Playing</strong> {startedPlayingDate}</p>
                </div><!-- end col -->

                <div class="col-auto">
                    <button class="btn btn-outline-primary"
                            on:click={() => {slideToggle("#edit-account-card")}}
                            type="button">Edit Account</button>
                </div>
            </div><!-- end row -->


            <div id="edit-account-card" class="slideToggle">
                <form on:submit={handleAccountEdit} class="card card-body shadow mb-3 mt-4 p-4">
                    <h2 class="mb-3">Edit Account</h2>

                    <div class="row mb-4">
                        <div class="col-xl-4">
                            <div class="mb-3">
                                <label for="account-name">Name</label>
                                <input type="text"
                                       class="form-control"
                                       id="account-name"
                                       name="name"
                                       maxlength="32"
                                       bind:value={$userData.name}>
                            </div><!-- end form group -->
                        </div><!-- end col -->

                        <div class="col-xl-4">
                            <div class="mb-3">
                                <label for="account-avatar">Avatar</label>
                                <select class="form-select"
                                        id="account-avatar"
                                        name="avatar"
                                        bind:value={$userData.avatar}>
                                    {#each avatars as avatar}
                                        <option value={avatar.id}>{avatar.name}</option>
                                    {/each}
                                </select>
                            </div><!-- end form group -->
                        </div><!-- end col -->

                        <div class="col-xl-4">
                            <div class="mb-3">
                                <label for="account-theme">Theme</label>
                                <select class="form-select" id="account-theme" name="theme" bind:value={$userData.theme}>
                                    {#each themes as theme}
                                        <option value={theme.id}>{theme.name}</option>
                                    {/each}
                                </select>
                            </div><!-- end form group -->
                        </div><!-- end col -->
                    </div><!-- end row -->


                    <div class="text-end">
                        <button type="submit"
                                name="submit"
                                class="btn btn-primary px-5"
                                on:click={() => {setTimeout(() => {slideToggle("#edit-account-card")}, 1000)}}
                                data-text="Save">Save</button>

                        <button type="button"
                                on:click={() => {
                                    slideToggle("#edit-account-card");
                                    $userData.set(backupUserData);
                                }}
                                class="btn btn-secondary">Close</button>
                    </div>
                </form><!-- end card -->
            </div>
        </div>

        <div class="pb-5 border-bottom mb-5">
            <div class="row justify-content-between align-items-center mb-5">
                <div class="col-md-auto col-12 mb-md-0 mb-5 ">
                    <h2 class="display-1 mb-0">Characters</h2>

                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="character-card-size-toggle" bind:checked={characterBlockToggle}>
                        <label class="form-check-label" for="character-card-size-toggle">Toggle Character Card View</label>
                    </div>
                </div>

                <div class="text-center col-md-auto col-12">
                    <a href="/characters/create" sveltekit:prefetch class="btn btn-primary px-4">Create New Character</a>
                </div>
            </div><!-- end row -->


            {#key characterBlockSize}
                <CharacterList size={characterBlockSize} />
            {/key}
        </div><!-- end div -->



        <div class="pb-5 mb-5">
            <div class="row justify-content-between align-items-center mb-5">
                <h2 class="col-md-auto col-12 mb-md-0 mb-5 display-1">Campaigns</h2>
                <div class="col-md-auto col-12 text-center">
                    <a href="/campaigns/create" sveltekit:prefetch class="btn btn-primary px-4">Create New Campaign</a>
                </div>
            </div><!-- end row -->

            <CampaignList />
        </div>
    </section>
{/if}
