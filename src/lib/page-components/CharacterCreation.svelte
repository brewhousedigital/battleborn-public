<script>
    // Check if existing data is being imported in
    import AlertBar from "$lib/page-components/AlertBar.svelte";

    export let characterData = {};
    export let characterSlug = "";
    export let type = "new";
    
    let saveAsGuestCharacterToggle = false;

    import {slideToggle} from "$lib/functions/slideToggle";
    import {goto} from "$app/navigation";
    import {slugify} from "$lib/functions/slugify";
    import {authenticated, guestCharacter, setGuestCharacter} from "$lib/store";
    import {buttonProcessingState, buttonProcessingStateEnable} from "$lib/functions/buttonProcessingState";

    // Get internal database items
    import {getRaces} from "$lib/data/characterRaces";
    import {getClass} from "$lib/data/classList";
    import {getClassParent} from "$lib/data/classParent";
    import {getHeights} from "$lib/data/characterHeights";
    import {getProfessions} from "$lib/data/characterProfessions";
    import {getDeities} from "$lib/data/characterDeities";
    import {onMount} from "svelte";
    import AccordionContainer from "$lib/page-components/AccordionContainer.svelte";
    import AccordionItem from "$lib/page-components/AccordionItem.svelte";

    // Swap the integers for actual terms
    let races = getRaces("all");
    let classList = getClass("all");
    let heights = getHeights("all");
    let professions = getProfessions("all");
    let deities = getDeities("all");


    // First loop through and build the parent list with an empty array for the classes
    let temporaryParentItem = 0;
    let formattedClassList = [];
    classList.forEach(item => {
        if(temporaryParentItem !== item.parent) {
            formattedClassList = [...formattedClassList, {
                parent: item.parent,
                parentName: getClassParent(item.parent)['name'],
                parentDescription: getClassParent(item.parent)['description'],
                classes: []
            }];

            temporaryParentItem = item.parent;
        }
    })

    // Then loop through again and add each class to where it needs to be
    classList.forEach(item => {
        let index = item.parent - 1;
        formattedClassList[index]["classes"] = [...formattedClassList[index]["classes"], item]
    })


    // Question text changes depending on new/edit mode
    let questions = {
        "title": {new: "Create a New Character", edit: "Edit Character"},
        "name": {new: "What is your character's name?", edit: "Edit Your Character's Name"},
        "race": {new: "Choose your race", edit: "Race"},
        "class": {new: "Choose your class", edit: "Change your class"},
        "height": {new: "Height", edit: "Height"},
        "profession": {new: "Choose a profession", edit: "Profession"},
        "deity": {new: "Choose a Deity", edit: "Deity"},
        "button": {new: "Create Your Character", edit: "Save Your Character"}
    }


    // Set up error messaging
    let errorMessage = "";


    onMount(() => {
        // Read the URL incase someone directly links and wants a guest character setup
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const guestChar = urlParams.get('guest-character');
        if(guestChar === "true") {
            saveAsGuestCharacterToggle = true;
        }
    })


    // Helper function to so style attributes dont get mad
    function styleBG(image) {
        return `background-image: url('/images/races/${image}');`;
    }

    function handleCreateCharacter(e) {
        e.preventDefault();

        buttonProcessingState("#submitBtn")

        party.confetti(e.target);

        if(type === "new") {
            // Add in the ID for Simple Clothes for every new character
            characterData.inventory = [20];

            // Check for Guest Mode
            if($authenticated && !saveAsGuestCharacterToggle) {
                // User is logged in
                Backendless.Data.of("d20_characters").save(characterData)
                    .then(function(response) {
                        // Checkmark the button
                        buttonProcessingState("#submitBtn", true);

                        localStorage.removeItem("characters");

                        // Generate the new url in case name changes
                        let url = slugify(response['name'] + " " + response['id']);
                        goto("/characters/" + url + "?new=character");
                    })
                    .catch(function(error) {
                        errorMessage = error;
                    })
                    .finally(() => {
                        setTimeout(() => {
                            buttonProcessingStateEnable("#submitBtn", "Try Again");
                        })
                    });
            }
            else {
                // User is not logged in
                let guestCharacterSetup = {
                    "name":"",
                    "level":1,
                    "maxHP":10,
                    "currentHP":10,
                    "str":0,
                    "dex":0,
                    "con":0,
                    "int":0,
                    "wis":0,
                    "cha":0,
                    "speed":5,
                    "gold":0,
                    "backstory":"",
                    "journal":"",
                    "class":1,
                    "physicalArmor":0,
                    "magicArmor":0,
                    "race":1,
                    "height":4,
                    "profession":8,
                    "deity":9
                }

                guestCharacterSetup = {...guestCharacterSetup, ...characterData}
                localStorage.setItem("guestCharacter", JSON.stringify(guestCharacterSetup));
                setGuestCharacter();
                goto("/characters/guest");
            }
        }


        if(type === "edit") {
            // Check for Guest Mode
            if($authenticated) {
                Backendless.Data.of("d20_characters").save(characterData)
                    .then(function(response) {
                        // Reset the cached characters
                        localStorage.removeItem("characters")

                        // Generate the new url in case name changes
                        let url = slugify(response['name'] + " " + response['id']);

                        // Take them to new character page
                        goto("/characters/" + url)
                    })
                    .catch(function(error) {
                        // TODO: error message
                        console.log("error", error)
                    });
            }
            else {
                // User is not logged in
                let guestCharacterSetup = {...characterData}
                localStorage.setItem("guestCharacter", JSON.stringify(guestCharacterSetup));
                setGuestCharacter();
                goto("/characters/guest")
            }
        }
    }

</script>


<style>
    .class-form-radio {
        padding-left: 40px;
        display: flex;
        align-items: center;
    }

    .class-form-radio-label {
        cursor: pointer;
    }
</style>


<form id="create-a-character" class="container" on:submit={handleCreateCharacter} autocomplete="off">

    {#if $authenticated}
        <div class="row align-items-center justify-content-between mb-5">
            <div class="col-md-auto">
                <h1 class="display-1 mb-md-0 mb-4">{questions['title'][type]}</h1>
            </div><!-- end col -->

            <div class="col-md-auto">
                <div class="form-check form-switch">
                    <input class="form-check-input" 
                           type="checkbox" 
                           bind:checked={saveAsGuestCharacterToggle}
                           id="saveAsGuestCharacterToggle">
                    <label class="form-check-label text-muted"
                           for="saveAsGuestCharacterToggle">Save As Guest Character</label>
                </div>
            </div><!-- end col -->
        </div><!-- end row -->

    {:else}
        <h1 class="display-1">{questions['title'][type]}</h1>

        <div class="alert alert-warning mb-5 ps-4">
            <div class="d-flex align-items-center">
                <span class="me-4 font-24">💾</span>

                <div>
                    <h4 class="alert-heading mb-0">Log in to create additional characters!</h4>
                    <p class="mb-0">While you are in guest mode, you can only create one character at a time.</p>
                </div>
            </div>
        </div>

        <!-- Check if user has a current Guest character -->
        {#if $guestCharacter !== null && type === "new"}
            <div class="pb-5 border-bottom mb-5">
                <div class="alert alert-warning ps-4">
                    <div class="d-flex align-items-center">
                        <span class="me-4 font-24">🖐</span>

                        <div>
                            <h4 class="alert-heading mb-0">Wait up!</h4>
                            <p class="mb-0">You currently have a saved Guest Character. Creating a new character will delete that one.</p>
                            <p class="mb-0">Would you like to <a href="/register">create an account</a> and save all of your characters? Or <a href="/characters/guest">view your current character</a>?</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    {/if}

    <label class="h2 text-center d-block" for="name">{questions['name'][type]}</label>
    <div class="pb-5 border-bottom mb-5">
        <input type="text"
               class="form-control form-control-lg text-center"
               id="name"
               maxlength="50"
               name="name"
               bind:value={characterData.name}
               required>
    </div><!-- end name -->










    <h2 class="text-center">{questions['race'][type]}</h2>
    <div class="row justify-content-center pb-5 border-bottom mb-5">
        {#each races as race, index}
            <div class="col-lg-4 col-md-6 mb-4">
                <input type="radio"
                       class="btn-check btn-check-races"
                       name="race"
                       id="race{ index }"
                       autocomplete="off"
                       value="{ race.id }"
                       bind:group={characterData.race}
                       required>
                <label class="btn-race btn-rainbow"
                       style={styleBG(race.image)}
                       for="race{ index }">{ race.name }</label>
            </div><!-- end col -->
        {/each}
    </div><!-- end row -->














    <div class="pb-5 border-bottom mb-5">
        <h2 class="text-center">{questions['class'][type]}</h2>

        <AccordionContainer id="class-accordion">
            {#each formattedClassList as item, parentIndex}
                <AccordionItem parentId="class-accordion" id="accordion-item-{parentIndex}">
                    <span slot="title">
                        <span class="h3 d-block">{item.parentName}</span>
                        <span class="p d-block">{item.parentDescription}</span>
                    </span>

                    <div slot="content">
                    {#each item.classes as classItem, index}
                        <div class="form-check border mb-4 class-form-radio">
                            <input class="form-check-input"
                                   type="radio"
                                   name="class"
                                   id="class-{parentIndex}-{index}"
                                   value="{classItem.id}"
                                   bind:group={characterData.class}
                                   required>
                            <label class="form-check-label class-form-radio-label p-4 w-100 d-block" for="class-{parentIndex}-{index}">
                                <span class="d-block fw-bold">{classItem.name}</span>
                                <span>{classItem.description}</span>
                            </label>
                        </div><!-- end radio -->
                    {/each}
                    </div>
                </AccordionItem>
            {/each}
        </AccordionContainer>
    </div><!-- end border -->











    <h2 class="text-center">{questions['height'][type]}</h2>
    <div class="row align-items-end pb-5 border-bottom mb-5">
        {#each heights as height, index}
            <div class="col-lg mb-4">
                <input type="radio"
                       class="btn-check btn-check-races"
                       name="height"
                       id="height{index}"
                       autocomplete="off"
                       value="{height.id}"
                       bind:group={characterData.height}>
                <label class="btn-race btn-rainbow bg-greensea"
                       style="padding: {height.height}px 0"
                       for="height{index}">{height.name}</label>
            </div><!-- end col -->
        {/each}
    </div><!-- end row -->









    <div class="pb-5 border-bottom mb-5">
        <h2 class="text-center mb-4">Advanced Character Options</h2>

        <button class="btn btn-outline-primary btn-lg w-100"
                on:click={() => {slideToggle("#advanced-character-options-content")}}
                type="button">Expand</button>

        <div id="advanced-character-options-content" class="slideToggle mb-5">
            <div class="py-5">

                <h2 class="text-center">{questions['profession'][type]}</h2>
                <p class="text-center">This acts as a "free" spell to use during roleplaying and sometimes combat.</p>
                <div class="row pb-5 border-bottom mb-5">
                    {#each professions as profession, index}
                        <div class="col-lg-3 col-md-6 mb-4">
                            <input type="radio"
                                   class="btn-check btn-check-races"
                                   name="profession"
                                   id="profession{index}"
                                   autocomplete="off"
                                   value="{profession.id}"
                                   bind:group={characterData.profession}>
                            <label class="btn-race btn-rainbow bg-pomegranate py-4"
                                   for="profession{index}">{profession.name}</label>
                        </div><!-- end col -->
                    {/each}
                </div><!-- end row -->


                <h2 class="text-center">{questions['deity'][type]}</h2>
                <h3 class="text-center">Do you want to follow the god of:</h3>
                <div class="row align-items-end">
                    {#each deities as deity, index}
                        <div class="col-lg-4 col-6 mb-4">
                            <input type="radio"
                                   class="btn-check btn-check-races"
                                   name="deity"
                                   id="deity{index}"
                                   autocomplete="off"
                                   value="{deity.id}"
                                   bind:group={characterData.deity}>
                            <label class="btn-race btn-rainbow bg-midnightblue py-4"
                                   for="deity{index}">{deity.name}</label>
                        </div><!-- end col -->
                    {/each}
                </div><!-- end row -->

            </div><!-- end padding -->
        </div><!-- end slide toggle -->
    </div><!-- end spacing -->

    {#if errorMessage !== ""}
        <AlertBar text="" />
    {/if}

    <p class="text-center">
        <button type="submit" id="submitBtn" class="btn btn-primary btn-lg">{questions['button'][type]}</button>
    </p>

</form>
