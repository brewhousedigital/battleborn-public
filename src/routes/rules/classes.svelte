<script>
    import {getClass} from "$lib/data/classList";
    import {getClassParent} from "$lib/data/classParent";

    let classList = getClass("all");
    let classParentList = getClassParent("all");
</script>

<svelte:head>
    <title>Game Rules - Classes</title>
</svelte:head>

<style>
    .classes-title {
        padding-top: 3rem;

        border-top: 1px solid #fff;
    }

    .classes-title:first-of-type {
        padding-top: 0;
        margin-top: 0;
        border-top: 0;
    }

    .classes-container {
        padding-bottom: 3rem;
        margin-bottom: 3rem;
        border-bottom: 1px solid #fff;
    }
</style>

<div class="row classes-container">
{#each classList as item}
    {#if item.startingChild}
        <div class="classes-title col-12 mb-4">
            <p class="h1">{getClassParent(item.parent).name}</p>
            <p>{getClassParent(item.parent).description}</p>
        </div>
    {/if}

    <div class="col-lg-4 mb-5">
        <p class="h4">{item.name}</p>
        <p>{item.description}</p>
        <p>
            <a href="/rules/classes/{item.id}"
               sveltekit:prefetch>Read More</a>
        </p>
    </div>
{/each}
</div>