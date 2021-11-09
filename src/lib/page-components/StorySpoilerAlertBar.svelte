<script>
    export let title = "";
    export let margin = "45px";
    let marginStyle = "margin-bottom:" + margin;
    export let html = "";
</script>


<div class="alert alert-warning ps-4" role="alert" style={marginStyle}>
    <div class="d-flex align-items-center">
        <span class="me-4 font-24">🖐</span>

        <div class="pe-4 col">
            <h4 class="alert-heading">Spoilers Ahead!</h4>
            <hr>
            <p class="mb-0">This page details the entire campaign for {title}. <span class="d-lg-block d-none"></span>Don't read this if you plan on playing this campaign since you'll see all the secrets and fun stuff.</p>
            {@html html}
        </div><!-- end col -->
    </div><!-- end row -->
</div><!-- end alert bar -->