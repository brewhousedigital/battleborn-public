<script>
    import {getCampaignDifficulty} from "$lib/data/campaignDifficulty";
    import {getCampaignImages} from "$lib/data/campaignImages";
    import {getCampaignLinearity} from "$lib/data/campaignLinearity";
    import {getCampaignStatus} from "$lib/data/campaignStatus";

    import {slugify} from "$lib/functions/slugify";
    import {goto} from "$app/navigation";

    export let campaignData = {
        // Image needs a default
        image: 1
    };

    export let type = "new";

    let listOfDifficulties = getCampaignDifficulty("all");
    let listOfImages = getCampaignImages("all");
    let listOfCampaignLinearity = getCampaignLinearity("all");
    let listOfCampaignStatus = getCampaignStatus("all");

    function createStyleBG(image) {
        return `background-image: url('/images/campaigns/${image}');`;
    }


    function createCampaignPreview(image) {
        if(image !== undefined) {
            let background = getCampaignImages();
            if(background !== undefined && background.image !== undefined) {
                background = background.image
                return `background-image: url('/images/campaigns/${background}'`;
            }
        }

        return "";
    }


    async function handleCampaign(e) {
        e.preventDefault();

        party.confetti(e.target);

        // TODO: Turn this into an async function
        Backendless.Data.of("d20_campaigns").save(campaignData)
            .then(function(response) {
                localStorage.removeItem("campaigns");
                localStorage.removeItem("campaignsPlaying");

                if(type === "new") {
                    goto("/campaigns")
                } else {
                    // Create new campaign URL
                    let url = slugify(campaignData['name'] + " " + campaignData['id']);
                    goto("/campaigns/" + url)
                }

            })
            .catch(function(error) {
                // TODO create error messaging
                console.log(error);
            });
    }
</script>

<form class="container" on:submit={handleCampaign}>
    <h1 class="display-1 mb-5">Create New Campaign</h1>

    <label class="h2 text-center d-block" for="name">Name of the Campaign</label>
    <div class="pb-5 border-bottom mb-5">
        <input type="text"
               class="form-control form-control-lg text-center campaign-name-input"
               id="name"
               maxlength="50"
               name="name"
               bind:value="{campaignData.name}" required>
    </div>

    <div class="row pb-5 border-bottom mb-5">
        <div class="col-lg-6 mb-5">
            <label class="h2 d-block" for="story">Story</label>
            <small id="story-info">This section is for you to track your entire campaign story. This is never shown to the players. Typically used for reference and updates as the campaign progresses.</small>
            <textarea class="form-control form-control-lg"
                      id="story"
                      name="story"
                      rows="12"
                      aria-describedby="story-info"
                      bind:value={campaignData.story}></textarea>
        </div><!-- end col -->

        <div class="col-lg-6 mb-5">
            <label class="h2 d-block" for="description">Description</label>
            <small id="description-info">Give a general intro to the campaign so that players have an idea of whats going on before joining. <strong>This section is shown to players</strong> so don't reveal any secrets or surprises here!</small>
            <textarea class="form-control form-control-lg"
                      id="description"
                      name="description"
                      rows="12"
                      aria-describedby="description-info"
                      required
                      bind:value={campaignData.description}></textarea>
        </div><!-- end col -->
    </div><!-- end row -->


    <div class="row border-bottom mb-5">
        <div class="col-lg-6 mb-5">
            <label class="h2 d-block">Status</label>
            <small id="status-info" class="mb-3 d-block">This controls whether the campaign is active, closed for joining, or completed.</small>

            {#each listOfCampaignStatus as item, index}
                <div class="form-check">
                    <input class="form-check-input"
                           type="radio"
                           name="status"
                           bind:group={campaignData.status}
                           id="status-{index}"
                           value={item.id}
                           aria-describedby="status-info"
                           required>
                    <label class="form-check-label" for="status-{index}">
                        {item.name}
                        <span class="d-block small fw-normal">{item.description}</span>
                    </label>
                </div>
            {/each}
        </div><!-- end col -->

        <div class="col-lg-6 mb-5">
            <label class="h2 d-block" for="lore">Lore</label>
            <small id="lore-info">This section is for you to provide backstory and setting for the adventurers. This is shown on the Player Campaign page.</small>
            <textarea class="form-control form-control-lg"
                      id="lore"
                      name="lore"
                      rows="12"
                      aria-describedby="lore-info"
                      bind:value={campaignData.lore}></textarea>
        </div><!-- end col -->
    </div><!-- end row -->


    <div class="row border-bottom mb-5">
        <div class="col-lg-6 mb-5">
            <label class="h2 d-block">Linearity</label>
            <small id="linearity-info" class="mb-3 d-block">This lets the players know how to play the campaign effectively and sets expectations from the beginning.</small>

            {#each listOfCampaignLinearity as item, index}
                <div class="form-check">
                    <input class="form-check-input"
                           type="radio"
                           name="linearity"
                           bind:group={campaignData.linearity}
                           id="linearity-{index}"
                           value={item.id}
                           aria-describedby="linearity-info"
                           required>
                    <label class="form-check-label" for="linearity-{index}">
                        {item.name}
                        <span class="d-block small fw-normal">{item.description}</span>
                    </label>
                </div>
            {/each}
        </div><!-- end col -->




        <div class="col-lg-6 mb-5">
            <label class="h2 d-block">Difficulty</label>
            <small id="difficulty-info" class="mb-3 d-block">This lets the players know how to plan their actions effectively and sets expectations from the beginning.</small>

            {#each listOfDifficulties as item, index}
                <div class="form-check">
                    <input class="form-check-input"
                           type="radio"
                           name="difficulty"
                           bind:group={campaignData.difficulty}
                           id="difficulty-{index}"
                           value={item.id}
                           aria-describedby="difficulty-info"
                           required>
                    <label class="form-check-label" for="difficulty-{index}">
                        {item.name}
                        <span class="d-block small fw-normal">{item.description}</span>
                    </label>
                </div>
            {/each}
        </div><!-- end col -->
    </div><!-- end row -->


    <label class="h2 text-center d-block" for="name">Campaign Background</label>
    <div class="campaign-image-container position-relative mb-5">
        <div class="campaign-image-content">
            <div class="row align-items-start justify-content-center">
                {#each listOfImages as item, index }
                    <div class="col-lg-4 col-md-6">
                        <input type="radio"
                               class="btn-check btn-check-races"
                               name="image"
                               bind:group={campaignData.image}
                               id="image-{index}"
                               autocomplete="off"
                               value="{item.id}"
                               required>
                        <label class="btn-race btn-rainbow"
                               style={createStyleBG(item.image)}
                               for="image-{index}"><span class="visually-hidden">{item.name}</span></label>
                    </div><!-- end col -->
                {/each}
            </div><!-- end row -->
        </div><!-- end content -->
    </div><!-- end image container -->



    <div class="pb-5 border-bottom mb-5">
        <h2 class="text-center">Campaign Preview</h2>
        <div id="campaign-preview-box"
             class="text-center"
             style={createCampaignPreview(campaignData.image)}>
            <h1 class="display-1 text-white m-0">{campaignData.name ? campaignData.name : "Missing Name" }</h1>
        </div>
    </div>




    <div class="alert alert-warning mb-3 form-error" role="alert" style="display: none;"></div>

    <p class="text-center pb-5 border-bottom mb-5">
        <button type="submit" class="btn btn-primary btn-lg">
            {type === "new" ? "Create Campaign" : "Save Changes"}
        </button>
    </p>
</form>