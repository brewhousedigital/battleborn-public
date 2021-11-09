<script>
    export let title = "";
    export let link = "";
    export let image = "";

    import "$lib/css/paper.css"
</script>


<style>
    .paper-border {
        padding: 24px 78px 24px 24px;
        text-decoration: none;
        color: #222;
        transition: background-color 300ms;
    }

    .paper-border:hover,
    .paper-border:focus {
        background-color: #fff;
    }

    img {
        max-width: 50px;
        transform: rotate(12deg);
        position: absolute;
        right: 0;
    }

    i {
        position: absolute;
        right: 12px;
        top: calc(50% - 19px);
    }

    @media screen and (min-width: 992px) {
        img {
            max-width: 70px;
            top: -18px;
        }
    }
</style>


<a href={link} class="paper-border h-100 d-flex align-items-center position-relative">
    <h2 class="mb-0 font-subheader">
        {title}
        {#if image === ""}<i class="bi bi-arrow-right-circle"></i>{/if}
    </h2>

    {#if image !== ""}<img src="/images/graphics/{image}" alt="image for {title}" class="img-fluid">{/if}
</a><!-- end paper -->