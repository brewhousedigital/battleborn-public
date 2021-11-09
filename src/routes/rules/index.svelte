<script>
    import PaperCardLink from "$lib/page-components/PaperCardLink.svelte";
    import {authenticated} from "$lib/store";

    let createCharacterText = "Create Guest Character";
    $authenticated ?
        createCharacterText = "Create Character"
        : createCharacterText = "Create Guest Character";
</script>


<svelte:head>
    <title>Game Rules - Quickstart</title>
</svelte:head>


<div class="row">
    <div class="col-auto d-lg-block d-none">

    </div><!-- end col auto -->

    <div class="col">
        <h3>Quickstart</h3>

        <p>There are two ways to get started with Battleborn. If you are looking for a quick, one-off game where you dont need to track anything, you can create a Guest Character. If you are looking for more long term play, or more in-depth campaign tools, you can create an account to save all of your information.</p>

        <div class="row align-items-center justify-content-around text-center mb-5">
            <div class="col-lg-5 mb-4">
                <PaperCardLink title={createCharacterText} link="/characters/create" />
            </div><!-- end col -->

            <div class="col-auto d-xl-block d-none mb-4">
                <img src="/images/graphics/scroll.png" alt="game rules scroll" class="img-fluid" style="max-width: 120px">
            </div>

            <div class="col-lg-5 mb-4">
                <PaperCardLink title="Create an Account" link="/register" />
            </div><!-- end col -->
        </div>

        <h3>Setting up your new character</h3>
        <p>When you create a new character, you can spend six attribute points. You can change your attribute points by clicking on "Edit Stats" in the top right corner of your character screen. You can read more about what Attributes are in the rules sidebar!</p>

        <p>Now you are ready to play!</p>
    </div><!-- end col -->
</div><!-- end row -->