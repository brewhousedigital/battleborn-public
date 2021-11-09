<svelte:head>
    <title>Game Rules</title>
</svelte:head>

<style>
    #game-rules-sidebar > a {
        display: block;
        padding: 10px 0;
    }
</style>

<section class="container">
    <h1 class="display-1 mb-5">Game Rules</h1>

    <div class="row">
        <aside class="col-lg-auto pe-5 border-end me-5" id="game-rules-sidebar">
            <a sveltekit:prefetch href="/rules">Quickstart</a>
            <a sveltekit:prefetch href="/rules/attributes">Attributes</a>
            <a sveltekit:prefetch href="/rules/classes">Classes</a>
            <a sveltekit:prefetch href="/rules/combat">Combat</a>
            <a sveltekit:prefetch href="/rules/leveling-up">Leveling Up</a>
            <a sveltekit:prefetch href="/rules/skill-checks">Skill Checks</a>
            <!-- Advanced Rules? -->
            <!--<a sveltekit:prefetch href="/rules/traveling">Travel</a>-->
        </aside>

        <section class="col-lg" id="game-rules-content">
            <slot />
        </section>
    </div><!-- end row -->
</section>