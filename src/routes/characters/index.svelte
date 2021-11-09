<script>
    import "$lib/css/paper.css"
    import CharacterList from "$lib/page-components/CharacterList.svelte";
</script>


<svelte:head>
    <title>Your Characters</title>
</svelte:head>


<div class="container">
    <CharacterList size="large" />
</div><!-- end container -->