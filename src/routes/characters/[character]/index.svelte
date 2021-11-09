<script context="module">
    export async function load(ctx) {
        // "Character" is the folder name. That is where the parameter comes from
        let slug = ctx.page.params.character
        return {props: {characterSlug: slug}};
    }
</script>

<script>
    // This brings in the {props} value
    import {get} from "svelte/store";

    export let characterSlug;

    // Helper functions
    import "$lib/css/paper.css";
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {buildCharacterData} from "$lib/functions/buildCharacterData";
    import {getCharacters} from "$lib/functions/getCharacters";
    import {slideToggle} from "$lib/functions/slideToggle";
    import {buttonProcessingState, buttonProcessingStateEnable} from "$lib/functions/buttonProcessingState";
    import {authenticated, guestCharacter, setGuestCharacter, userId, userToken} from "$lib/store";


    // Components
    import DiceRoller from "$lib/page-components/DiceRoller.svelte";
    import DiceIcon from "$lib/page-components/DiceIcon.svelte";
    import InventoryItem from "$lib/page-components/character/InventoryItem.svelte";
    import AlertBar from "$lib/page-components/AlertBar.svelte";
    import CampaignList from "$lib/page-components/CampaignList.svelte";
    import {getCampaignImages} from "$lib/data/campaignImages";
    import {getCampaignStatus} from "$lib/data/campaignStatus";


    // Variables
    let characters = [];
    let character = null;
    let attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    let temporaryHealth = 0;
    let healthPercent;
    let healthWarning = false;
    let temporaryGold = 0;
    let campaignsPlaying = [];

    let errorMessage = "";
    let deleteCharacterErrorMessage = "";
    let errorMessageEditStats = "";


    onMount(async () => {
        // Check if this is a guest account or not
        if(characterSlug === "guest") {
            character = $guestCharacter;
            if(character === null) await goto("/?error=no-guest-character-found");

            // Set up the guest character with the right information
            character = buildCharacterData([character])[0];
        } else {
            // Get all characters
            characters = await getCharacters();

            // Check if user has character based on slug
            character = characters.filter((item) => {return item.url === characterSlug})

            // Reduce from its array into just an object
            character.length === 1 ? character = character[0] : await goto("/account");


            // See if this character is participating in any campaigns
            let body = JSON.stringify({token: get(userToken), user: get(userId), characterId: character.objectId})
            let campaignsPlayingFetch = await fetch("/api/campaigns/playing", {
                method: "POST", headers: {"Content-type": "application/json"}, body: body
            })
            campaignsPlayingFetch = await campaignsPlayingFetch.json();
            campaignsPlaying = campaignsPlayingFetch.data;

            // TODO: remove this duplicate code from getCampaigns.js
            campaignsPlaying.forEach((campaign) => {
                campaign['url'] = "/play/" + campaign['objectId'];
                campaign['imageName'] = getCampaignImages(campaign['image'])['image'];
                campaign['statusName'] = getCampaignStatus(campaign['status'])['name'];
                campaign['statusDescription'] = getCampaignStatus(campaign['status'])['description'];
            })

        }

        // Set health after "character" value is loaded
        temporaryHealth = character.currentHP;
        await updateHealthPercent()

        // Set gold after "character" value is loaded
        temporaryGold = character.gold;

        console.log(">>character['inventoryItems']", character['inventoryItems'])
    })


    // Set health after "character" value is loaded
    async function updateHealthPercent() {
        healthPercent = Math.round(((temporaryHealth / character.maxHP) * 100));
        if(healthPercent > 100) healthPercent = 100;
    }


    async function handleCharacterEdit(e) {
        e.preventDefault();

        errorMessageEditStats = "";

        // Get form input fields
        let form = new FormData(e.target);
        let elements = e.target.elements;
        buttonProcessingState("#saveCharStatsBtn");

        // Update the character object
        character = {
            ...character,
            level: parseInt(form.get("level")),
            maxHP: parseInt(form.get("maxHP")),
            speed: parseInt(form.get("speed")),
            physicalArmor: parseInt(form.get("physicalArmor")),
            magicArmor: parseInt(form.get("magicArmor")),
            str: parseInt(form.get("str")),
            dex: parseInt(form.get("dex")),
            con: parseInt(form.get("con")),
            int: parseInt(form.get("int")),
            wis: parseInt(form.get("wis")),
            cha: parseInt(form.get("cha")),
        }

        // This allows the user to not modify their character stats until they're ready
        if(characterSlug === "guest") {
            localStorage.setItem("guestCharacter", JSON.stringify(character));
            setGuestCharacter();
        }
        else {
            try {
                // Add in the character's objectId
                await Backendless.Data.of("d20_characters").save(character);

                // Then reset the localstorage value
                localStorage.removeItem("characters")
            }
            catch(error) {
                console.log(error);
                errorMessageEditStats = error;
            }
        }

        party.confetti(document.getElementById("saveCharStatsBtn"));
        buttonProcessingState("#saveCharStatsBtn", true);

        setTimeout(() => {buttonProcessingStateEnable("#saveCharStatsBtn", "Save Character")}, 2000)
    }


    async function healthReduce(e) {
        let lostHealth = parseInt(e.target.previousElementSibling.value);
        temporaryHealth = temporaryHealth - lostHealth;
        if(temporaryHealth < 0) temporaryHealth = 0;

        // Update percent value
        await updateHealthPercent();
    }


    async function healthIncrease(e) {
        let gainHealth = parseInt(e.target.previousElementSibling.value);
        temporaryHealth = temporaryHealth + gainHealth;

        // Update percent value
        await updateHealthPercent();
    }


    async function handleCharacterHealth(e) {
        e.preventDefault();

        let elements = e.target.elements;

        // Update character value
        character.currentHP = temporaryHealth;

        // Update backendless
        if(characterSlug === "guest") {
            localStorage.setItem("guestCharacter", JSON.stringify(character));
            setGuestCharacter();
        } else {
            try {
                await Backendless.Data.of("d20_characters").save(character);

                // Then reset the localstorage value
                localStorage.removeItem("characters")
            }
            catch(error) {
                console.log(error)
            }
        }

        party.confetti(elements['submit']);
    }


    async function goldReduce(e) {
        let lostGold = parseInt(e.target.previousElementSibling.value);
        temporaryGold = temporaryGold - lostGold;
        if(temporaryGold < 0) temporaryGold = 0;
    }


    async function goldIncrease(e) {
        let gainGold = parseInt(e.target.previousElementSibling.value);
        temporaryGold = temporaryGold + gainGold;
    }


    async function handleCharacterGold(e) {
        e.preventDefault();

        let elements = e.target.elements;

        // Update character value
        character.gold = temporaryGold;

        // Update backendless
        if(characterSlug === "guest") {
            localStorage.setItem("guestCharacter", JSON.stringify(character));
            setGuestCharacter();
        } else {
            try {
                await Backendless.Data.of("d20_characters").save(character);

                // Then reset the localstorage value
                localStorage.removeItem("characters")
            }
            catch(error) {
                console.log(error)
            }
        }

        party.confetti(elements['submit']);
    }


    async function handleJournalBackstory(e) {
        e.preventDefault();

        // Get form input fields
        let elements = e.target.elements;

        let key = "";
        let value = "";
        let form = new FormData(this);

        if(form.get('journal') !== null) {
            key = "journal";
            value = character.journal;
        } else {
            key = "backstory";
            value = character.backstory;
        }

        if(characterSlug === "guest") {
            localStorage.setItem("guestCharacter", JSON.stringify(character));
            setGuestCharacter();
        } else {
            await Backendless.Data.of("d20_characters").save({
                objectId: character.objectId,
                [key]: value
            });
        }

        // TODO: this isn't using any kind of error messaging
        party.confetti(elements['submit']);
        localStorage.removeItem("characters")
    }


    async function deleteCharacter() {
        deleteCharacterErrorMessage = '';
        buttonProcessingState("#deleteBtn");

        let confirmDelete = confirm("Are you sure you want to delete " + character.name + "?");

        if(confirmDelete) {
            if(characterSlug === "guest") {
                localStorage.removeItem("guestCharacter");
                setGuestCharacter();
                await goto("/")
            } else {
                await Backendless.Data.of("d20_characters").remove({objectId:character.objectId})
                buttonProcessingState("#deleteBtn", true);
                localStorage.removeItem("characters")
                await goto("/characters")
                setTimeout(() => {buttonProcessingStateEnable("#deleteBtn", "Delete Character")}, 2000)
            }
        }
    }

    async function handleSaveGuestCharacter() {
        await Backendless.Data.of("d20_characters").save(character)
        localStorage.removeItem("characters");
        localStorage.removeItem("guestCharacter")
        await goto("/characters");
    }

    async function handleInventoryUpdate(e) {
        character = e.detail.data;
    }
</script>


<svelte:head>
    <title>Character</title>
</svelte:head>


{#if character !== null}
    <div id="character-sheet" class="container">

        <!-- Check if authenticated -->
        <!-- Check if user is on their guest character -->
        {#if $authenticated}
            {#if characterSlug === "guest"}
                <div class="alert alert-warning mb-5 ps-4">
                    <div class="d-flex align-items-center">
                        <span class="me-4 font-24">💾</span>

                        <div>
                            <h4 class="alert-heading mb-0">Want to save this character?</h4>
                            <p class="">This Guest Character is not saved to your account yet. Theres a chance you could lose it in the future. Would you like to save it to your account to use for later?</p>
                            <button class="btn btn-success px-4" on:click={handleSaveGuestCharacter}>Save {character.name} to your account</button>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}

        <!-- Page title -->
        <div class="d-flex align-items-center justify-content-between mb-5">
            <h1 class="col-auto display-4">Character</h1>

            <div class="col-auto">
                <button type="button"
                        on:click={() => {slideToggle("#edit-character-stats-card")}}
                        class="btn btn-outline-primary">Edit Stats</button>

                <a href="/characters/{characterSlug}/edit"
                   sveltekit:prefetch
                   class="btn btn-outline-primary">Edit Character</a>
            </div>
        </div><!-- end d flex -->


        <!-- Edit stats collapse sections -->
        <div id="edit-character-stats-card" class="slideToggle">
            <form on:submit={handleCharacterEdit} class="card card-body shadow mb-5 p-4 paper-border">
                <h2 class="mb-3">Edit Stats</h2>

                <div class="row mb-3">
                    <div class="col-lg mb-4">
                        <label for="modal-level">Level</label>
                        <input type="number"
                               class="form-control form-control-lg"
                               id="modal-level"
                               name="level"
                               min="0"
                               max="99"
                               step="1"
                               value="{character.level}">
                    </div><!-- end col -->


                    <div class="col-lg mb-4">
                        <label for="modal-maxHP">Max Health</label>
                        <input type="number"
                               class="form-control form-control-lg"
                               id="modal-maxHP"
                               name="maxHP"
                               min="0"
                               max="1000"
                               step="1"
                               value="{character.maxHP}">
                    </div><!-- end col -->


                    <div class="col-lg mb-4">
                        <label for="modal-speed">Speed</label>
                        <input type="number"
                               class="form-control form-control-lg"
                               id="modal-speed"
                               name="speed"
                               min="0"
                               max="99"
                               step="1"
                               value="{character.speed}">
                    </div><!-- end col -->


                    <div class="col-lg mb-4">
                        <label for="modal-physicalArmor">Physical Armor</label>
                        <input type="number"
                               class="form-control form-control-lg"
                               id="modal-physicalArmor"
                               name="physicalArmor"
                               min="0"
                               max="99"
                               step="1"
                               value="{character.physicalArmor}">
                    </div><!-- end col -->


                    <div class="col-lg mb-4">
                        <label for="modal-magicArmor">Magic Armor</label>
                        <input type="number"
                               class="form-control form-control-lg"
                               id="modal-magicArmor"
                               name="magicArmor"
                               min="0"
                               max="99"
                               step="1"
                               value="{character.magicArmor}">
                    </div><!-- end col -->


                    <div class="w-100"></div>

                    <h2 class="mb-3">Edit Attribute Points</h2>

                    {#each attributes as item}
                        <div class="col-lg-2 col-6 mb-4">
                            <label for="modal-{item}" style="text-transform: capitalize">{item}</label>
                            <input type="number"
                                   class="form-control form-control-lg"
                                   id="modal-{item}"
                                   name="{item}"
                                   min="0"
                                   max="99"
                                   step="1"
                                   value="{character[item]}">
                        </div><!-- end col -->
                    {/each}
                </div><!-- end row -->

                {#if errorMessageEditStats !== ""}
                    <AlertBar text={errorMessageEditStats} />
                {/if}

                <div class="text-end">
                    <button type="submit"
                            id="saveCharStatsBtn"
                            class="btn btn-primary px-4"
                            on:click={() => {setTimeout(() => {slideToggle("#edit-character-stats-card")}, 1000)}}
                            data-text="Save">Save Character</button>

                    <button type="button"
                            on:click={() => {slideToggle("#edit-character-stats-card")}}
                            class="btn btn-secondary">Close</button>
                </div>
            </form><!-- end card -->
        </div>


        <!-- Character card info -->
        <div class="row pb-5 border-bottom mb-5">
            <div class="col-lg-3 col-md-12 mb-md-0 mb-2">
                <div class="mx-auto" style="max-width: 275px;">
                    <img src="/images/classes/{character.shield}"
                         alt="Shield for {character.className}"
                         width="300"
                         height="300"
                         class="img-fluid">
                </div>
            </div>


            <!-- Character stats -->
            <div class="col-md-6 text-center mb-md-0 mb-5 me-auto">
                <h2 class="display-1 font-header">{character.name}</h2>

                <p class="mb-4">
                    Level
                    {character.level}
                    {character.heightName}
                    {character.raceName}
                    {character.className}
                </p>


                <!-- Major abilities -->
                <div class="major-abilities row justify-content-center mb-5">
                    {#each attributes as item}
                        <div class="col-lg-2 col-4 stat-controller">
                            <div>
                                <span>{character[item]}</span> {item}
                                <span class="temporary-change" style="opacity: 0;">0</span>
                            </div>
                        </div>
                    {/each}
                </div>


                <!-- Minor abilities -->
                <div class="minor-abilities">
                    <div class="mb-4">
                        <div class="d-block d-md-inline-block px-md-3 stat-controller">
                            <p class="mb-0">Armor: {character.physicalArmor} <span class="temporary-change" style="opacity: 0;">0</span></p>
                        </div>

                        <div class="d-block d-md-inline-block px-md-3 stat-controller">
                            <p class="mb-0">Spell Armor: {character.magicArmor} <span class="temporary-change" style="opacity: 0;">0</span></p>
                        </div>

                        <div class="d-block d-md-inline-block px-md-3 stat-controller">
                            <p class="mb-0">Speed: {character.speed} <span class="temporary-change" style="opacity: 0;">0</span></p>
                        </div>
                    </div>


                    <!-- Health and Gold buttons -->
                    <div>
                        <div class="d-block mb-4">
                            <button type="button"
                                    on:click={() => {slideToggle("#edit-character-health-card")}}
                                    class="btn btn-outline-danger btn-lg mx-3 mb-4"
                                    style="min-width: 225px">Health:
                                {character.currentHP}/{character.maxHP}
                            </button>

                            <button type="button"
                                    on:click={() => {slideToggle("#edit-character-gold-card")}}
                                    class="btn btn-outline-success btn-lg mx-3 mb-4"
                                    style="min-width: 225px">Gold:
                                {character.gold}
                            </button>
                        </div>

                        <!-- Health and Gold collapse sections -->
                        <div class="row justify-content-center">
                            <div id="edit-character-health-card" class="col-xl-6 mb-5 slideToggle">
                                <form on:submit={handleCharacterHealth} class="card card-body shadow p-4 text-start h-100 paper-border">
                                    <h2 class="mb-3">Edit Health</h2>

                                    <div class="progress mb-4" style="height: 34px;">
                                        <div class="progress-bar bg-pomegranate {healthWarning ? 'healthWarning' : ''}"
                                             role="progressbar"
                                             id="health-progress-bar"
                                             style="width: { healthPercent }%;"
                                             aria-valuenow="{ temporaryHealth }"
                                             aria-valuemin="0"
                                             aria-valuemax="{ character.maxHP }">{ healthPercent }%</div>
                                    </div>

                                    <div class="mb-4">
                                        <div class="d-flex align-items-end justify-content-between">
                                            <label class="col-auto" for="modal-current_health">Current Health</label>
                                            <div class="col-auto small text-muted">Max Health: { character.maxHP }</div>
                                        </div><!-- end row -->

                                        <input type="number"
                                               class="form-control form-control-lg"
                                               id="modal-current_health"
                                               name="health"
                                               min="0"
                                               max="1000"
                                               step="1"
                                               on:change={updateHealthPercent}
                                               on:keyup={updateHealthPercent}
                                               bind:value="{ temporaryHealth }">
                                    </div><!-- end margin -->


                                    <div class="mb-4">
                                        <label for="health-reduce">Reduce Health By:</label>
                                        <div class="input-group">
                                            <input type="number"
                                                   class="form-control"
                                                   step="1"
                                                   min="1"
                                                   max="1000"
                                                   value="1"
                                                   id="health-reduce">
                                            <button class="btn btn-outline-secondary btn-sm"
                                                    on:click={healthReduce}
                                                    type="button">Reduce</button>
                                        </div>
                                    </div><!-- end col -->

                                    <div class="mb-4">
                                        <label for="health-increase">Increase Health By:</label>
                                        <div class="input-group">
                                            <input type="number"
                                                   class="form-control"
                                                   step="1"
                                                   min="1"
                                                   max="1000"
                                                   value="1"
                                                   id="health-increase">
                                            <button class="btn btn-outline-secondary btn-sm"
                                                    on:click={healthIncrease}
                                                    type="button">Increase</button>
                                        </div>
                                    </div><!-- end col -->


                                    <div class="mt-auto">
                                        <div class="alert alert-warning error-message" role="alert" style="display: none;"></div>

                                        <div class="text-end">
                                            <button type="submit"
                                                    name="submit"
                                                    class="btn btn-primary px-4"
                                                    data-text="Save">Save</button>
                                            <button type="button"
                                                    on:click={() => {slideToggle("#edit-character-health-card")}}
                                                    class="btn btn-secondary">Close</button>
                                        </div>
                                    </div><!-- end margin top -->
                                </form><!-- end card -->
                            </div>

                            <div id="edit-character-gold-card" class="col-xl-6 mb-5 slideToggle">
                                <form on:submit={handleCharacterGold} class="card card-body shadow p-4 text-start h-100 paper-border">
                                    <h2 class="mb-3">Edit Gold</h2>

                                    <div class="progress mb-4" style="height: 34px;">
                                        <div class="progress-bar bg-greensea"
                                             role="progressbar"
                                             style="width: 100%;"></div>
                                    </div>

                                    <div class="mb-4">
                                        <label class="col-auto" for="modal-current_gold">Current Gold</label>

                                        <input type="number"
                                               class="form-control form-control-lg"
                                               id="modal-current_gold"
                                               name="gold"
                                               min="0"
                                               max="999999"
                                               step="1"
                                               bind:value="{ temporaryGold }">
                                    </div><!-- end margin -->


                                    <div class="mb-4">
                                        <label for="gold-reduce">Reduce Gold By:</label>
                                        <div class="input-group">
                                            <input type="number"
                                                   class="form-control"
                                                   step="1"
                                                   min="1"
                                                   value="1"
                                                   id="gold-reduce">
                                            <button class="btn btn-outline-secondary btn-sm"
                                                    on:click={goldReduce}
                                                    type="button">Reduce</button>
                                        </div>
                                    </div><!-- end col -->

                                    <div class="mb-4">
                                        <label for="gold-increase">Increase Gold By:</label>
                                        <div class="input-group">
                                            <input type="number"
                                                   class="form-control"
                                                   step="1"
                                                   min="1"
                                                   value="1"
                                                   id="gold-increase">
                                            <button class="btn btn-outline-secondary btn-sm"
                                                    on:click={goldIncrease}
                                                    type="button">Increase</button>
                                        </div>
                                    </div><!-- end col -->


                                    <div class="mt-auto">
                                        <div class="alert alert-warning error-message" role="alert" style="display: none;"></div>

                                        <div class="text-end">
                                            <button type="submit"
                                                    name="submit"
                                                    class="btn btn-primary px-4"
                                                    data-text="Save">Save</button>
                                            <button type="button"
                                                    on:click={() => {slideToggle("#edit-character-gold-card")}}
                                                    class="btn btn-secondary">Close</button>
                                        </div>
                                    </div><!-- end margin top -->
                                </form><!-- end card -->
                            </div>
                        </div>
                    </div>


                </div><!-- end minor abilities -->
            </div><!-- end col -->


            <div class="col-lg-2 col-md-6 text-center">
                <h3>Actions</h3>
                <p>2 Actions per round</p>

                <div data-bs-toggle="tooltip" data-bs-placement="right" title="Dice Roller">
                    <button class="btn dice-roller-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#dice-modal">
                        <DiceIcon/>
                    </button>
                </div>
            </div><!-- end col -->
        </div><!-- end row -->


        <!-- Spells and Inventory -->
        <div class="row pb-5 border-bottom mb-5">
            <div class="col-lg-6 mb-5">
                <h2>Spells</h2>

                <div class="card shadow mb-3 inventory-spell-box p-4 paper-border">
                    {#each character.spells as spell (spell.id)}
                        <div class="row mb-3 {spell.level > character.level ? 'opacity-30' : ''}">
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
                </div><!-- end card -->
            </div><!-- end col -->


            <div class="col-lg-6 mb-5">
                <div class="d-flex align-items-center justify-content-between">
                    <h2 class="col-auto">Inventory</h2>
                    <div class="col-auto">
                        <a href="/characters/{characterSlug}/items/"
                           sveltekit:prefetch
                           class="btn">Manage / Add Items</a>
                    </div>
                </div><!-- end row -->

                <!-- Type -->
                <!-- Inventory returns null when empty -->
                <!-- 1: Potion, 2: Armor, 3: Weapon, 4: Accessory -->
                <div id="current-items-list" class="card shadow mb-3 inventory-spell-box p-4 paper-border">
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
        </div><!-- end row -->


        <!-- About / Backstory / Journal -->
        <div class="row pb-5 border-bottom mb-5">
            <div class="col-lg-4 mb-5">
                <h3>About</h3>
                <div class="card shadow mb-3 paper-border">
                    <div class="d-flex justify-content-between align-items-center py-2 px-4">
                        <span class="small fw-bold">Profession</span> {character.professionName}
                    </div>
                    <div class="d-flex justify-content-between align-items-center py-2 px-4">
                        <span class="small fw-bold">Race</span> {character.raceName}
                    </div>
                    <div class="d-flex justify-content-between align-items-center py-2 px-4">
                        <span class="small fw-bold">Size</span> {character.heightName}
                    </div>
                    <div class="d-flex justify-content-between align-items-center py-2 px-4">
                        <span class="small fw-bold">Deity</span> {character.deityName}
                    </div>
                </div><!-- end card -->
            </div><!-- end col -->


            <div id="journal-backstory-container" class="col-lg-8 mb-5">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="backstory" class="h3">Backstory</label>

                        <form on:submit={handleJournalBackstory} class="card shadow mb-3 position-relative paper-border">
                            <textarea class="form-control border-0 character-textarea"
                                      rows="4"
                                      id="backstory"
                                      name="backstory"
                                      bind:value={character.backstory}
                                      placeholder="I was born to a well-to-do family in the City of Lino's Castle. My family was involved in politics and the theater. As a young human, I moved to the City of Ledale where I found my calling as a bard. I found I could draw people to me by playing my lute."></textarea>

                            <div class="character-textarea-btn-save">
                                <button type="submit" name="submit" data-text="Save" class="btn btn-outline-primary px-5">Save</button>
                            </div>

                            <div class="alert alert-warning mb-3 form-error" role="alert" style="display: none;"></div>
                        </form>
                    </div><!-- end col -->

                    <div class="col-md-6 mb-3">
                        <label for="journal" class="h3">Journal</label>

                        <form on:submit={handleJournalBackstory} class="card shadow mb-3 position-relative paper-border">
                    <textarea class="form-control border-0 character-textarea"
                              rows="4"
                              id="journal"
                              name="journal"
                              bind:value={character.journal}
                              placeholder="The group didn't suspect a thing after solving the mystery of the enchanted king's court. They couldn't tell that the enchantment was caused by my magic lute. Soon I'll lead them to their demise and collect the bounty on each of them. I'll get revenge for what they did to my family..."></textarea>

                            <div class="character-textarea-btn-save">
                                <button type="submit" name="submit" data-text="Save" class="btn btn-outline-primary px-5">Save</button>
                            </div>

                            <div class="alert alert-warning mb-3 form-error" role="alert" style="display: none;"></div>
                        </form>
                    </div><!-- end col -->
                </div><!-- end row -->

                <div class="alert alert-warning error-message" role="alert" style="display: none;"></div>
            </div><!-- end col -->
        </div><!-- end row -->


        <!-- Current Campaigns -->
        <div class="pb-5 border-bottom mb-5">
            <h3>Campaigns that {character.name} is playing in</h3>
            {#if characterSlug === "guest"}
                <p>Create an account to be able to join campaigns!</p>
                <p><a href="/register" class="btn btn-outline-primary px-4">Register</a></p>
            {:else}
                <CampaignList characterView={true} {campaignsPlaying} />
            {/if}
        </div><!-- end current campaign -->


        <!-- Delete character button -->
        <div class="text-center py-5">
            <button class="btn btn-outline-danger btn-lg px-5 d-block mx-auto mb-4"
                    id="deleteBtn"
                    on:click={deleteCharacter}>Delete Character</button>

            {#if deleteCharacterErrorMessage !== ""}
                <AlertBar text={deleteCharacterErrorMessage} />
            {/if}
        </div>
    </div><!-- end container -->





    <!-- Dice modal -->
    <div class="modal fade" id="dice-modal" tabindex="-1" aria-labelledby="dice-modal-label" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content paper-border shadow">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="dice-modal-label">Dice Roller</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <DiceRoller {attributes} {character} />
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Close Dice Roller</button>
                </div>
            </div>
        </div>
    </div>
{/if}