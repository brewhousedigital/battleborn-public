<script context="module">
    export async function load(ctx) {
        // "Character" is the file name. That is where the parameter comes from
        let slug = ctx.page.params.campaignID
        return {props: {campaignID: slug}};
    }
</script>

<script>
    // This brings in the {props} value
    export let campaignID;


    // Helpers
    import {onMount} from 'svelte';
    import {getCampaignDifficulty} from "$lib/data/campaignDifficulty";
    import {getCampaignImages} from "$lib/data/campaignImages";
    import {getCampaignLinearity} from "$lib/data/campaignLinearity";
    import {getCampaignStatus} from "$lib/data/campaignStatus";
    import {getCampaignPlayers} from "$lib/functions/getCampaignPlayers";


    // Components
    import CharacterList from "$lib/page-components/CharacterList.svelte";
    import CampaignLogs from "$lib/page-components/CampaignLogs.svelte";


    // Variables
    let campaign = null;
    let campaignPlayers = [];
    let backgroundCSS = "";


    onMount(async () => {
        let campaignFetch = await fetch('/api/campaigns/' + campaignID);
        campaignFetch = await campaignFetch.json();

        if(campaignFetch.status === "success") {
            campaign = campaignFetch.data;

            campaign['difficultyName'] = getCampaignDifficulty(campaign['difficulty'])['name'];
            campaign['difficultyDescription'] = getCampaignDifficulty(campaign['difficulty'])['description'];
            campaign['imageName'] = getCampaignImages(campaign['image'])['image'];
            campaign['linearityName'] = getCampaignLinearity(campaign['linearity'])['name'];
            campaign['linearityDescription'] = getCampaignLinearity(campaign['linearity'])['description'];
            campaign['statusName'] = getCampaignStatus(campaign['status'])['name'];
            campaign['statusDescription'] = getCampaignStatus(campaign['status'])['description'];


            // Get players
            campaignPlayers = await getCampaignPlayers(campaignID);


            // Style tags don't like svelte tags
            backgroundCSS = "background-image: url('/images/campaigns/" + campaign.imageName + "')";
        }
    })

    async function handleLeaveCampaign(e) {
        let thisEl = e.target;
        thisEl.disabled = true;

        let deleteConfirm = confirm("Are you sure you want to leave " + campaign.name + "?");
        if(deleteConfirm) {
            await Backendless.Data.of("d20_campaign_participants").bulkDelete(`campaign_id = '${campaignID}'`);
            // Regenerate the campaign players list so the UI updates
            campaignPlayers = await getCampaignPlayers(campaignID);
        }

        thisEl.disabled = false;
    }

    async function handleReFetchCharacters() {
        // Regenerate the campaign players list so the UI updates
        campaignPlayers = await getCampaignPlayers(campaignID);
    }
</script>


<svelte:head>
    <title>Join Campaign</title>
</svelte:head>


<style>
    /* To offset the <main> tag padding */
    .campaign-view-header {margin-top: -45px}
</style>


<div style="min-height: 1330px">
    {#if campaign !== null}
        <div class="campaign-view-header py-5 mb-5" style={backgroundCSS}>
            <div class="container py-5">
                <div class="py-3 text-center text-white">
                    <p class="fw-bold h3 mb-0">Welcome to</p>
                    <h1 class="display-1 mb-0">{campaign.name}</h1>
                </div><!-- end d flex -->
            </div><!-- end container -->
        </div><!-- end header bg -->


        <div class="container">
            <h2>Description</h2>
            <p class="pb-5 border-bottom mb-5">{campaign.description}</p>


            <h2>Campaign Logs</h2>
            <div class="pb-5 border-bottom mb-5">
                <CampaignLogs {campaign} DMView={false} />
            </div>


            <div class="row border-bottom mb-5">
                <div class="col-lg-6 mb-5">
                    <h2>Linearity</h2>
                    <p>This campaign is marked as: <span class="fw-bold">{campaign.linearityName}</span></p>
                    <p class="small">{campaign.linearityDescription}</p>
                </div><!-- end col -->

                <div class="col-lg-6 mb-5">
                    <h2>Difficulty</h2>
                    <p>This campaign is marked as: <span class="fw-bold">{campaign.difficultyName}</span></p>
                    <p class="small">{campaign.difficultyDescription}</p>
                </div><!-- end col -->
            </div><!-- end row -->


            <!-- This will trigger a rerender once the value updates -->
            {#key campaignPlayers}
                <div class="mb-5">
                    <h2>Current Players</h2>
                    <CharacterList type="campaign-players" showListOfCharacters={campaignPlayers} />
                </div>
            {/key}


            <!-- This checks if the campaign is locked or not -->
            {#if campaign.status === 1}
            {#key campaignPlayers}
                <div class="pb-5 border-bottom mb-5">
                    <h2>Choose a character to join</h2>
                    <CharacterList type="join-campaign"
                                   {campaignID}
                                   on:refetch={handleReFetchCharacters}
                                   hideCharacterByList={campaignPlayers} />
                </div>
            {/key}
            {/if}


            <p class="text-center">
                <button class="btn btn-outline-danger btn-lg px-4"
                        on:click={handleLeaveCampaign}>Leave Campaign</button>
            </p>

        </div><!-- end container -->
    {/if}
</div>