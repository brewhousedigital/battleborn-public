<script>
    import {onMount} from 'svelte';
    import {getCharacters} from "$lib/functions/getCharacters";
    import {getClass} from "$lib/data/classList";
    import {getHeights} from "$lib/data/characterHeights";
    import {getRaces} from "$lib/data/characterRaces";
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();


    let characters = [];
    export let type = "view";
    export let hideCharacterByList = [];
    export let showListOfCharacters = [];
    export let campaignID = "";
    export let size = "small";

    let attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    onMount(async () => {
        // Retrieve the player's characters
        if(type === "view" || type === "join-campaign") {
            characters = await getCharacters();
        }

        // Remove the characters currently participating from the Join Campaign view
        if(type === "join-campaign") {
            // Loop through and remove the characters already added to the campaign
            // https://stackoverflow.com/questions/31005396/filter-array-of-objects-with-another-array-of-objects#answer-64395104
            characters = characters.filter(character => hideCharacterByList.every(filtered => filtered.id !== character.id));
        }

        // Show custom list of characters
        if(type === "campaign-players") {
            showListOfCharacters.forEach((character) => {
                // Deity and a few other things are hidden in this mode
                if(character['class']) character['shield'] = getClass(character['class'])['image'];
                if(character['class']) character['className'] = getClass(character['class'])['name'];
                if(character['height']) character['heightName'] = getHeights(character['height'])['name'];
                if(character['race']) character['raceName'] = getRaces(character['race'])['name'];
            });

            characters = showListOfCharacters;
        }
    })


    async function handleClickJoinCampaign(e) {
        let joinCampaign = e.target;
        let id = joinCampaign.getAttribute("data-id");
        let campaignID = joinCampaign.getAttribute("data-campaignID");

        joinCampaign.disabled = true;

        // This is saving to the database as a 1:n relationship in the campaign
        await Backendless.Data.of("d20_campaign_participants").save({
            campaign_id:campaignID,
            character_id:id
        })

        // When user joins campaign, dispatch event to parent to refetch the data
        dispatch('refetch', {data: "joined"});
    }
</script>



<style>
    .large-character-list img {
        max-width: 120px;
    }

    .major-abilities {
        border: 0;
        /*padding: 0 30px;*/
    }

    .major-abilities > div {
        padding: 0;
    }

    .major-abilities > div span {
        font-size: 22px;

    }
</style>



{#if size === "small"}
    <div class="row">
        {#each characters as character}
            <div class="col-xl-2 col-lg-4 col-6 position-relative text-center">
                <img src="/images/classes/{character['shield']}"
                     alt="Class Shield for {character['className']}"
                     width="250"
                     height="250"
                     class="d-block mx-auto img-fluid">

                <h3>{character['name']}</h3>

                <p>Level {character['level']} {character['className']}</p>

                {#if type === "view"}
                    <a href="/characters/{character['url']}"
                       sveltekit:prefetch
                       class="stretched-link text-decoration-none text-muted small">View</a>
                {/if}

                {#if type === "join-campaign"}
                    <button type="button"
                            class="btn btn-primary px-4"
                            data-id={character.objectId}
                            data-campaignID={campaignID}
                            on:click={handleClickJoinCampaign}>Join</button>
                {/if}
            </div>
        {:else}
            <p>No characters found</p>
        {/each}
    </div>
{/if}











{#if size === "large"}
    <div class="row large-character-list">
        {#each characters as character}
            <div class="col-xl-6">
                <div class="card card-body paper-border position-relative d-flex flex-row flex-wrap align-items-center mb-5">
                    <div class="col-lg-auto col-12 pe-lg-4">
                        <img src="/images/classes/{character['shield']}"
                             alt="Class Shield for {character['className']}"
                             width="250"
                             height="250"
                             class="d-block mx-auto img-fluid">
                    </div><!-- end col -->

                    <div class="col-lg col-12">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h3 class="mb-0">{character['name']}</h3>
                                <p>Level {character['level']} {character['className']}</p>
                            </div>

                            <div>
                                <a href="/characters/{character['url']}"
                                   sveltekit:prefetch
                                   class="stretched-link text-decoration-none text-muted small">View <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>

                        <!-- Major abilities -->
                        <div class="major-abilities row justify-content-center">
                            {#each attributes as item}
                                <div class="col-lg-2 col-4 stat-controller">
                                    <div>
                                        <span>{character[item]}</span> {item}
                                        <span class="temporary-change" style="opacity: 0;">0</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div><!-- end col -->
                </div><!-- end card -->
            </div><!-- end div -->
        {:else}
            <p>No characters found</p>
        {/each}
    </div><!-- end row -->
{/if}