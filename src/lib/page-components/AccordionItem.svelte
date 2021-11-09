<script>
    export let parentId = "new-accordion";
    export let id = "accordion-item-1";
    $: headerId = id + "-header";
</script>


<style>
    .accordion-button:not(.collapsed) {
        color: #222;
        background-color: #eee;
    }
</style>


<div class="accordion-item">
    <button id={headerId} class="accordion-button accordion-header collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#{id}"
            aria-expanded="false"
            aria-controls={id}>
        <slot name="title">Missing Title</slot>
    </button>

    <div {id} class="accordion-collapse collapse" aria-labelledby={headerId} data-bs-parent="#{parentId}">
        <div class="accordion-body">
            <slot name="content">Missing content...</slot>
        </div>
    </div><!-- end accordion content -->
</div><!-- end accordion item -->