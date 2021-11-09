<script context="module">
    export async function load(ctx) {
        // "Character" is the file name. That is where the parameter comes from
        let slug = ctx.page.params.class
        return {props: {classSlug: slug}};
    }
</script>

<script>
    // This brings in the {props} value
    import CharacterSpells from "$lib/page-components/CharacterSpells.svelte";

    export let classSlug;

    import {afterUpdate} from "svelte";
    import {getClass} from "$lib/data/classList";
    import {getSpells} from "$lib/data/classSpells";

    let classInfo = {};
    let spells = [];

    let allClasses = [];
    let relatedClasses = [];

    classInfo = getClass(parseInt(classSlug));
    spells = getSpells(parseInt(classSlug));

    allClasses = getClass("all");
    relatedClasses = allClasses.filter((el) => {
        return el.parent === classInfo.parent;
    })

    afterUpdate(() => {
        classInfo = getClass(parseInt(classSlug));
        spells = getSpells(parseInt(classSlug));

        allClasses = getClass("all");
        relatedClasses = allClasses.filter((el) => {
            return el.parent === classInfo.parent;
        })
    })

</script>

<div class="d-flex pb-5 border-bottom mb-5">
    <div class="col-lg">
        <h1>{classInfo.name}</h1>
        <p class="mb-5">{classInfo.description}</p>
    </div>

    <div class="col-lg-auto ps-5 text-center">
        <h2>Related Classes</h2>
        {#each relatedClasses as relatedItem}
            <div class="p-3 d-inline-block">
                <a href="/rules/classes/{relatedItem.id}"
                   sveltekit:prefetch
                   class="btn btn-outline-primary btn-lg">{relatedItem.name}</a>
            </div>
        {/each}
    </div>
</div>



<div class="pb-5  mb-5">
    <h2>Spells</h2>
    <CharacterSpells {spells} />
</div>