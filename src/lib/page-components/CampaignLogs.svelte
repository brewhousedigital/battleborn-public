<script>
    import {onMount} from "svelte";

    export let campaign;
    export let DMView;
    let campaignLogs = [];
    let newCampaignLog = {};


    onMount(async() => {
        // Create new log object
        newCampaignLog = {
            // Set the campaign ID
            campaign_id: campaign.objectId
        };

        // Get all new logs
        if(DMView) {
            let whereClause = "campaign_id = '" + campaign.objectId + "'";
            let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause).setSortBy(["created ASC"]);
            campaignLogs = await Backendless.Data.of("d20_campaign_logs").find(queryBuilder);
        } else {
            // The API for a Campaign returns the logs in the object.
            if(campaign.logs.length > 0) {
                campaignLogs = campaign.logs;
            } else {
                campaign.logs = [];
            }
        }
    })


    async function handleLog(e) {
        e.preventDefault();

        // Save log
        await Backendless.Data.of("d20_campaign_logs").save(newCampaignLog);

        // Get all new logs
        let whereClause = "campaign_id = '" + campaign.objectId + "'";
        let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause).setSortBy(["created ASC"]);
        campaignLogs = await Backendless.Data.of("d20_campaign_logs").find(queryBuilder);

        // Reset NewCampaignLog object
        newCampaignLog.title = "";
        newCampaignLog.content = "";
        delete newCampaignLog.objectId;

        // Close the modal
        document.getElementById("campaignLogCloseBtn").click();
    }


    function handleLogEdit(e) {
        let thisEl = e.target;
        let parent = thisEl.closest(".campaign-log-entry");

        let title = parent.querySelector(".campaign-log-title").textContent;
        let content = parent.querySelector(".campaign-log-content").textContent;
        let id = parent.getAttribute("data-id");

        newCampaignLog.title = title;
        newCampaignLog.content = content;
        // Set the objectId so that Backendless uses PUT instead of POST
        newCampaignLog.objectId = id;
    }


    async function handleLogDelete(e) {
        let thisEl = e.target;
        let parent = thisEl.closest(".campaign-log-entry");
        let id = parent.getAttribute("data-id");
        let title = parent.querySelector(".campaign-log-title").textContent;

        let deletePrompt = confirm("Are you sure you want to delete log " + title + "?");

        if(deletePrompt) {
            await Backendless.Data.of("d20_campaign_logs").remove({objectId:id})
            // Get all new logs
            let whereClause = "campaign_id = '" + campaign.objectId + "'";
            let queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause).setSortBy(["created ASC"]);
            campaignLogs = await Backendless.Data.of("d20_campaign_logs").find(queryBuilder);
        }
    }


    function prettyDate(timestamp) {
        let dateObj = new Date(timestamp);
        let dateString = String(dateObj);
        let dateArray = dateString.split(" ");
        let customDate =
            dateArray[0] + " " +
            dateArray[1] + " " +
            dateArray[2] + ", " +
            dateArray[3];

        return customDate;
    }

</script>


<style>

</style>


{#each campaignLogs as log}
    <div class="mb-4 campaign-log-entry" data-id={log.objectId}>
        <div class="d-flex align-items-center mb-1">
            <h3 class="mb-0 campaign-log-title">{log.title}</h3>
            <p class="mb-0 ms-3 me-3 small text-muted">Posted on {prettyDate(log.created)}</p>

            {#if DMView}
            <button aria-label="Edit Log"
                    type="button"
                    class="btn px-4"
                    data-bs-toggle="modal"
                    data-bs-target="#campaign-log"
                    on:click={handleLogEdit}><i class="bi bi-pencil-square"></i></button>

            <button aria-label="Delete Log"
                    type="button"
                    class="btn px-4"
                    on:click={handleLogDelete}><i class="bi bi-trash"></i></button>
            {/if}
        </div><!-- end row -->
        <p class="campaign-log-content">{log.content}</p>
    </div>
{:else}
    <p>No logs have been published yet.</p>
{/each}




<div class="modal fade" id="campaign-log" tabindex="-1" aria-labelledby="campaign-log-label" aria-hidden="true">
    <div class="modal-dialog">
        <form on:submit={handleLog} class="modal-content">
            <div class="modal-header">
                <h5 class="h2 modal-title" id="campaign-log-label">Campaign Log</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="log-title" class="form-label">Log Title</label>
                    <input type="text"
                           class="form-control"
                           id="log-title"
                           bind:value={newCampaignLog.title}
                           placeholder="Episode 3: Attack of the Goblins">
                </div>

                <div class="mb-3">
                    <label for="log-content" class="form-label">Notes</label>
                    <textarea class="form-control"
                              id="log-content"
                              rows="4"
                              bind:value={newCampaignLog.content}
                              placeholder="The players made their way to the caverns, only to find them completely overrun by the Goblin King NunNun."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="campaignLogCloseBtn" class="btn" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary px-4">Save Log</button>
            </div>
        </form>
    </div>
</div>