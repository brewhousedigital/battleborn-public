<script context="module">
    export async function load(ctx) {
        // "Character" is the folder name. That is where the parameter comes from
        let slug = ctx.page.params.character
        return {props: {characterSlug: slug}};
    }
</script>

<script>
    // This brings in the {props} value
    export let characterSlug;

    // Load components
    import InventoryItem from "$lib/page-components/character/InventoryItem.svelte";

    // Loop through and find their character from localstorage
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {getCharacters} from "$lib/functions/getCharacters";
    import {getItems} from "$lib/data/items";
    import {buildCharacterData} from "$lib/functions/buildCharacterData";


    let characters = [];
    let character = null;
    let allItems = null;
    let allItemsSortArray = [];


    onMount(async () => {
        if(characterSlug === "guest") {
            character = JSON.parse(localStorage.getItem("guestCharacter"));
            if(character === null) await goto("/");

            // Set up the guest character with the right information
            character = buildCharacterData([character])[0];
        } else {
            // Get all characters
            characters = await getCharacters();
            // Check if user has character based on slug
            character = characters.filter((item) => {return item.url === characterSlug})
            // Reduce from its array into just an object
            character.length === 1 ? character = character[0] : await goto("/account");
        }


        allItems = getItems("all");
        allItemsSortArray = [...allItems];
    })


    async function sortItems(sort) {
        // Reset
        allItemsSortArray = [...allItems];

        // 1: Potion, 2: Armor, 3: Weapon, 4: Artifact
        switch (sort) {
            case "all": allItemsSortArray = [...allItems]; break;
            case "armor": allItemsSortArray = allItemsSortArray.filter((el) => {return el.type === 2;}); break;
            case "weapons": allItemsSortArray = allItemsSortArray.filter((el) => {return el.type === 3;}); break;
            case "potions": allItemsSortArray = allItemsSortArray.filter((el) => {return el.type === 1;}); break;
            case "artifact": allItemsSortArray = allItemsSortArray.filter((el) => {return el.type === 4;}); break;
            default: allItemsSortArray = [...allItems];
        }
    }

    async function handleInventoryUpdate(e) {
        character = e.detail.data;
    }
</script>


<svelte:head>
    <title>Edit Items</title>
</svelte:head>


{#if character !== null}
    <div class="container">
        <p><a href="/characters/{characterSlug}" sveltekit:prefetch class="btn btn-light">◀ Back to Character Sheet</a></p>

        <div class="d-flex align-items-center justify-content-between mb-5">
            <h1 class="col-auto display-1">Game Items</h1>

            <div class="col-auto"></div>
        </div><!-- end d flex -->

        <div class="row pb-5 border-bottom mb-5">
            <div class="col-lg-5 mb-5">
                <h2 class="col-auto">{character.name}'s Inventory</h2>

                <div id="current-items-list" class="card shadow mb-3 inventory-spell-box p-4">
                    <ul class="list-group list-group-flush">
                        {#each character['inventoryItems'] as item}
                            <InventoryItem {character} {characterSlug} {item}
                                           on:updateCharacter={handleInventoryUpdate} />
                        {:else}
                            <li class="list-group-item">No Items Found</li>
                        {/each}
                    </ul>
                </div><!-- end inventory -->
            </div><!-- end col -->


            <div class="col-lg-7 mb-5">
                <div class="d-flex align-items-center justify-content-between">
                    <h2 class="col-auto">All Items</h2>
                    <div class="col-auto">
                        <span class="d-inline-block  small text-muted align-middle">Sort:</span>
                        <button class="btn btn-sm" on:click={() => {sortItems('all')}}>All</button>
                        <button class="btn btn-sm" on:click={() => {sortItems('armor')}}>Armor</button>
                        <button class="btn btn-sm" on:click={() => {sortItems('weapons')}}>Weapons</button>
                        <button class="btn btn-sm" on:click={() => {sortItems('potions')}}>Potions</button>
                        <button class="btn btn-sm" on:click={() => {sortItems('artifact')}}>Artifacts</button>
                    </div>
                </div><!-- end row -->

                <div id="all-items-list" class="card shadow mb-3 inventory-spell-box p-4">
                    <ul class="list-group list-group-flush">
                        {#each allItemsSortArray as item}
                            <InventoryItem {character} {characterSlug} {item}
                                           on:updateCharacter={(e) => {
                                               character = e.detail.data;
                                           }} />

                        {:else}
                            <li class="list-group-item">No Items Found</li>
                        {/each}
                    </ul>
                </div><!-- end inventory -->
            </div><!-- end col -->
        </div><!-- end row -->
    </div>
{/if}