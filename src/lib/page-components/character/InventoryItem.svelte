<script>
    export let item = {};
    export let character;
    export let characterSlug;

    import {createEventDispatcher} from 'svelte';

    import {characterInventoryAdd, characterInventoryRemove} from "$lib/functions/characterInventory";

    // Alert any parent components that the character object has been updated
    const dispatch = createEventDispatcher();
</script>


<li class="list-group-item d-flex align-items-center">
    <div class="col">
        <p class="mb-0">{item.name}</p>
        <p class="mb-0 small">{item.description}</p>
        <div class="small">
            {@html item.damage_dice ? `<span class="badge bg-secondary">Damage Dice ${item.damage_dice}</span>` : ''}
            {@html item.damage_bonus ? `<span class="badge bg-secondary">Damage Bonus +${item.damage_bonus}</span>` : ''}

            {@html item.health ? `<span class="badge bg-secondary">Health +${item.health}</span>` : ''}

            {@html item.armor_physical ? `<span class="badge bg-secondary">Physical Armor +${item.armor_physical}</span>` : ''}
            {@html item.armor_magic ? `<span class="badge bg-secondary">Magic Armor +${item.armor_magic}</span>` : ''}

            {@html item.stat_str ? `<span class="badge bg-secondary">Str +${item.stat_str}</span>` : ''}
            {@html item.stat_dex ? `<span class="badge bg-secondary">Dex +${item.stat_dex}</span>` : ''}
            {@html item.stat_con ? `<span class="badge bg-secondary">Con +${item.stat_con}</span>` : ''}
            {@html item.stat_int ? `<span class="badge bg-secondary">Int +${item.stat_int}</span>` : ''}
            {@html item.stat_wis ? `<span class="badge bg-secondary">Wis +${item.stat_wis}</span>` : ''}
            {@html item.stat_cha ? `<span class="badge bg-secondary">Cha +${item.stat_cha}</span>` : ''}

            {@html item.duration ? `<span class="badge bg-secondary">Duration: ${item.duration} Rounds</span>` : ''}

            {@html item.price ? `<span class="badge bg-secondary">Price ${item.price}</span>` : ''}
        </div>
    </div>

    <div class="col-auto dropdown dropstart current-items-list-actions">
        <button class="btn btn-sm d-block text-end w-100" on:click={() => {
            character = characterInventoryRemove(character, characterSlug, item.rowid);
            dispatch('updateCharacter', {data: character});
        }}>Delete</button>

        <button class="btn btn-sm d-block text-end w-100" on:click={() => {
            dispatch('updateCharacter', {data: character});
            character = characterInventoryRemove(character, characterSlug, item.rowid, true);
        }}>Sell</button>

        <button class="btn btn-sm d-block text-end w-100" on:click={() => {
            dispatch('updateCharacter', {data: character});
            character = characterInventoryAdd(character, characterSlug, item.rowid);
        }}>Duplicate</button>
    </div>

    <div class="col-auto all-items-list-actions">
        <button class="btn btn-sm d-block text-end w-100" on:click={() => {
            dispatch('updateCharacter', {data: character});
            character = characterInventoryAdd(character, characterSlug, item.rowid);
        }}>Add</button>
    </div>
</li>