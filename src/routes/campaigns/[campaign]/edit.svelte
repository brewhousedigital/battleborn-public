<script context="module">
    export async function load(ctx) {
        // "Campaign" is the folder name. That is where the parameter comes from
        let slug = ctx.page.params.campaign
        return {props: {campaignSlug: slug}};
    }
</script>

<script>
    export let campaignSlug;

    // Loop through and find their campaign from localstorage
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {getCampaigns} from "$lib/functions/getCampaigns";


    // Import the entire Campaign Creation page
    import CampaignCreation from "$lib/page-components/CampaignCreation.svelte";


    let campaigns = [];
    let campaign = null;


    onMount(async () => {
        // Get all campaigns
        campaigns = await getCampaigns();
        campaigns = campaigns['campaigns'];
        // Check if user has campaign based on slug
        campaign = campaigns.filter((item) => {return item.url === "/campaigns/" + campaignSlug})
        // Reduce from its array into just an object
        campaign.length === 1 ? campaign = campaign[0] : await goto("/campaigns");
    })
</script>


<svelte:head>
    <title>Edit Campaign</title>
</svelte:head>


{#if campaign !== null}
    <div class="container">
        <p><a href="/campaigns/{campaignSlug}" sveltekit:prefetch class="btn btn-light">◀ Back to Campaign</a></p>

        <CampaignCreation type="edit" campaignData={campaign} />
    </div>
{/if}
