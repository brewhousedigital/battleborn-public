<script>
    import {onMount} from 'svelte';
    import {getCampaigns} from "$lib/functions/getCampaigns";
    import {getCampaignImages} from "$lib/data/campaignImages";

    export let characterView = false;
    export let campaigns = [];
    export let campaignsPlaying = [];
    let campaignsCompleted = [];

    function styleBG(image) {
        return "background-image: url('/images/campaigns/" + image + "')";
    }

    onMount(async () => {
        // First check if a custom list has already been passed
        if(!characterView) {
            // Get current campaign list
            let campaignsInfo = await getCampaigns();
            campaigns = campaignsInfo['campaigns'];
            campaignsPlaying = campaignsInfo['campaignsPlaying'];

            // Check which campaigns have been completed
            // let checkCampaignsCompleted = campaigns.filter(item => item.status === 3);
            // let checkCampaignsPlayedCompleted = campaignsPlaying.filter(item => item.status === 3);
            // campaignsCompleted = [...checkCampaignsCompleted, ...checkCampaignsPlayedCompleted];
        }
    })
</script>


<style>
    .award-icon {
        position: absolute;
        top: 0;
        right: 8px;
        z-index: 5;
        font-size: 32px;
    }
</style>


{#if !characterView}
<h3>Running</h3>
<div class="row pb-3 mb-5">
    {#each campaigns as campaign}
        <div class="col-xl-4 col-6 text-center position-relative  mb-4">
            <div class="py-5 text-white campaign-view-header rounded"
                 style={styleBG(campaign.imageName)}>

                <h3>{campaign.name}</h3>

                <a href={campaign.url}
                   class="stretched-link text-decoration-none d-block"
                   sveltekit:prefetch
                   style="height: 0;">&nbsp;</a>
            </div><!-- end campaign header -->
        </div><!-- end col -->
    {:else}
        <p>No campaigns found</p>
    {/each}
</div>
{/if}


{#if !characterView}<h3>Playing</h3>{/if}
<div class="row">
    {#each campaignsPlaying as campaign}
        <div class="col-xl-4 col-6 text-center position-relative mb-4">
            <div class="py-5 text-white campaign-view-header rounded position-relative h-100 d-flex align-items-center justify-content-center"
                 style={styleBG(campaign.imageName)}>

                <h3 class="mb-0">{campaign.name}</h3>

                <a href={campaign.url}
                   class="stretched-link text-decoration-none d-block"
                   sveltekit:prefetch
                   style="height: 0;">&nbsp;</a>

                {#if campaign.status === 3}<i class="bi bi-trophy-fill award-icon" title="This campaign is complete"></i>{/if}
            </div><!-- end card -->
        </div><!-- end col -->
    {:else}
        <p>No campaigns found</p>
    {/each}
</div>