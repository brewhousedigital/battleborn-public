<script context="module">
    export async function load(ctx) {
        // "Campaign" is the folder name. That is where the parameter comes from
        let slug = ctx.page.params.campaign
        return {props: {campaignSlug: slug}};
    }
</script>

<script>
    // This brings in the {props} value
    export let campaignSlug;


    // Helper functions
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {getCampaigns} from "$lib/functions/getCampaigns";
    import {getCampaignPlayers} from "$lib/functions/getCampaignPlayers";


    // Components
    import CampaignLogs from "$lib/page-components/CampaignLogs.svelte";
    import CharacterList from "$lib/page-components/CharacterList.svelte";


    // Variables
    let inviteLink = "#";
    let backgroundCSS = "";
    let campaigns = [];
    let players = [];
    let campaign = null;


    onMount(async () => {
        // Get all campaigns
        campaigns = await getCampaigns();
        campaigns = campaigns['campaigns'];
        // Check if user has campaign based on slug
        campaign = campaigns.filter((item) => {return item.url === "/campaigns/" + campaignSlug})
        // Reduce from its array into just an object
        campaign.length === 1 ? campaign = campaign[0] : await goto("/campaigns");


        // Get players
        players = await getCampaignPlayers(campaign.objectId);


        // Create invite link
        let currentLocation = window.location.host;
        currentLocation.includes("localhost")
            ? currentLocation = "http://" + currentLocation
            : currentLocation = "https://" + currentLocation;
        inviteLink = currentLocation + "/play/" + campaign['objectId'];

        // Style tags don't like svelte tags
        backgroundCSS = "background-image: url('/images/campaigns/" + campaign.imageName + "')";
    })


    async function deleteCampaign() {
        let confirmDelete = confirm("Are you sure you want to delete " + campaign.name + "?");

        if(confirmDelete) {
            Backendless.Data.of("d20_users_campaigns").remove({objectId:campaign.objectId})
                .then(function(response) {
                    localStorage.removeItem("campaigns");
                    localStorage.removeItem("campaignsPlaying");
                    goto("/campaigns");
                })
                .catch(function(error) {
                    console.log(">>error", error);
                });
        }
    }



</script>


<svelte:head>
    <title>View Campaign</title>
</svelte:head>


<style>
    /* To offset the <main> tag padding */
    .campaign-view-header {margin-top: -45px}
</style>

{#if campaign !== null}
    <div id="campaign-sheet">
        <div class="campaign-view-header py-5 mb-5" style={backgroundCSS}>
            <div class="container py-5">
                <div class="text-center text-white">
                    <p class="h1">Dungeon Master</p>
                    <h1 class="display-1 mb-3">{campaign.name}</h1>
                    <a href="/campaigns/{campaignSlug}/edit/"
                       sveltekit:prefetch
                       class="flex-fill btn btn-primary btn-lg mx-3 mb-4 btn-campaign-2">Edit Campaign</a>
                </div><!-- end d flex -->
            </div><!-- end container -->
        </div><!-- end header bg -->


        <div class="container">

            <h2 class="d-flex align-items-center">
                <span class="me-3">Invite / Player Link</span>
                <button class="btn btn-primary btn-sm fireworks-click"
                        on:click={(e) => {
                            let input = document.getElementById("campaign-invite-link");
                            input.select();
                            document.execCommand("copy");
                            party.confetti(e.target)
                        }}>Copy</button>
            </h2>

            <p class="pb-5 border-bottom mb-5">
                <a href="{inviteLink}" sveltekit:prefetch>{inviteLink}</a>
                <input aria-label="copy the invite link here"
                       type="text"
                       id="campaign-invite-link"
                       class="form-control"
                       value={inviteLink}>
            </p>






            <div class="pb-5 border-bottom mb-5">
                <h2>Story</h2>
                <p>{campaign.story}</p>
            </div>






            <div class="d-flex align-items-center justify-content-between mb-5">
                <h2>Campaign Logs</h2>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#campaign-log">
                    New Campaign Log
                </button>
            </div><!-- end row -->

            <div class="pb-5 border-bottom mb-5">
                <CampaignLogs {campaign} DMView={true} />
            </div><!-- end row -->




            {#if players.length > 0}
                <h2>Players</h2>
                <div class="row pb-5 border-bottom mb-5">
                    <CharacterList type="campaign-players" showListOfCharacters={players} />
                </div><!-- end row -->
            {/if}





            <div class="row border-bottom mb-5">
                <div class="col-lg-6 mb-5">
                    <h2>Linearity</h2>
                    <p class="small mb-3">This lets the players know how to play the campaign effectively and sets expectations from the beginning.</p>

                    <p>This campaign is marked as: <span class="fw-bold">{campaign.linearityName}</span></p>
                    <p class="small">{campaign.linearityDescription}</p>
                </div><!-- end col -->

                <div class="col-lg-6 mb-5">
                    <h2>Difficulty</h2>
                    <p class="small mb-3">This lets the players know how to plan their actions effectively and sets expectations from the beginning.</p>

                    <p>This campaign is marked as: <span class="fw-bold">{campaign.difficultyName}</span></p>
                    <p class="small">{campaign.difficultyDescription}</p>
                </div><!-- end col -->
            </div><!-- end row -->





            <div class="row border-bottom mb-5">
                <div class="col-lg-6 mb-5">
                    <h2>Description</h2>
                    <p>{campaign.description}</p>
                </div><!-- end col -->

                <div class="col-lg-6 mb-5">
                    <h2>Lore</h2>
                    {#if campaign.lore}
                        <p>{campaign.lore}</p>
                    {:else}
                        <p>No Lore yet. Edit the campaign to add Lore content.</p>
                    {/if}
                </div><!-- end col -->
            </div><!-- end row -->


            <div class="pb-5 border-bottom mb-5">
                <h2>Campaign Status</h2>
                <p class="fw-bold mb-1">{campaign.statusName}</p>
                <p>{campaign.statusDescription}</p>
            </div>


            <p class="text-center">
                <button type="button"
                        class="btn btn-danger btn-lg"
                        on:click={deleteCampaign}>Delete Campaign</button>
            </p>
        </div><!-- end container -->

    </div><!-- end campaign sheet -->



{/if}