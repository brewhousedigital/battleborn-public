<script>
    export let spells;
    export let level = 99999;
</script>

{#each spells as spell (spell.id)}
    <div class="row mb-3 {spell.level > level ? 'opacity-30' : ''}">
        <div class="col-auto text-center {spell.startingSpell ? '' : 'invisible'}">
            <div class="small">Level</div>
            <div class="h4">{spell.level}</div>
        </div>
        <div class="col">
            <p class="mb-0 fw-bold">{spell.name} {#if spell.passive}<span class="badge bg-secondary opacity-50">passive</span>{/if}</p>
            <p class="mb-3 small">{spell.description}</p>
        </div>
    </div>
{/each}