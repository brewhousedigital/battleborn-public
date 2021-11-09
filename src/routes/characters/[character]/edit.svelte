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

    // Loop through and find their character from localstorage
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {getCharacters} from "$lib/functions/getCharacters";
    import {buildCharacterData} from "$lib/functions/buildCharacterData";


    // Import the entire Character Creation page
    import CharacterCreation from "$lib/page-components/CharacterCreation.svelte";


    let characters = [];
    let character = null;


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
    })
</script>


<svelte:head>
    <title>Edit Character</title>
</svelte:head>


{#if character !== null}
    <div class="container"><p><a href="/characters/{characterSlug}" sveltekit:prefetch class="btn btn-light">◀ Back to Character Sheet</a></p></div>

    <CharacterCreation type="edit" characterData={character} {characterSlug} />
{/if}