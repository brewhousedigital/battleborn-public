<script>
	import {authenticated, guestCharacter} from "$lib/store";

	let accountLinks = [
		{name: 'My Characters', url: '/characters', image: 'background-image: url("/images/graphics/nav-placeholder.jpg");', auth: true},
		{name: 'My Campaigns', url: '/campaigns', image: 'background-image: url("/images/graphics/nav-placeholder.jpg");', auth: true},
		{name: 'My Account', url: '/account', image: 'background-image: url("/images/graphics/nav-placeholder.jpg");', auth: true},
		{name: 'Logout', url: '/logout', image: 'background-image: url("/images/graphics/nav-placeholder.jpg");', auth: true},
		{name: 'Login', url: '/login', image: '', auth: false},
		{name: 'Register', url: '/register', image: '', auth: false},
	];
</script>

<style>
	header {
		background-color: #222;
		color: #fff;
	}

	header .btn {
		color: #fff;
	}

	.nav-large-item {
		height: 125px;
		margin-bottom: 16px;
		font-size: 27px;
		color: #fff;
		text-decoration: none;
		transition: filter 300ms;
	}

	.nav-large-item:last-of-type {
		margin-bottom: 0;
	}

	.nav-large-item:hover,
	.nav-large-item:focus {
		filter: hue-rotate(-0.25turn);
		text-decoration: underline;
	}
</style>

<header>
	<div class="container">
		<div class="row align-items-center justify-content-between py-3">
			<a href="/" id="logo" class="col-auto text-decoration-none text-white">
				<h1 class="fw-bold mb-0 lh-1">Battleborn</h1>
				<span class="fst-italic text-muted small">A Tabletop RPG Game</span>
			</a>

			<nav class="col-auto">
				<a sveltekit:prefetch href="/" class="btn">Home</a>

				<a sveltekit:prefetch href="/rules" class="btn">Game Rules</a>

				<a sveltekit:prefetch href="/characters/create" class="btn">Character Builder</a>


				{#if $guestCharacter !== null}
					<a sveltekit:prefetch href="/characters/guest" class="btn">Your Guest Character</a>
				{/if}


				{#if $authenticated}

					<a sveltekit:prefetch href="/campaigns/create" class="btn">Campaign Builder</a>

					<div class="btn-group">
						<button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
							Account
						</button>
						<div class="dropdown-menu dropdown-menu-end dropdown-menu-dark p-4" style="width: 375px">
							{#each accountLinks as link}
								{#if link.auth === true}
									<a href={link.url}
									   class="nav-large-item font-header d-flex align-items-center justify-content-center"
									   style={link.image}>{link.name}</a>
								{/if}
							{/each}
						</div>
					</div>

				{:else}

					{#each accountLinks as link}
						{#if link.auth === false}
							<a href={link.url} class="btn">{link.name}</a>
						{/if}
					{/each}

				{/if}

			</nav><!-- end col -->
		</div><!-- end row -->
	</div>
</header>