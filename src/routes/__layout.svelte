<script>
	// Components
	import Header from '$lib/site-components/Header.svelte';
	import Footer from "$lib/site-components/Footer.svelte";
	import '$lib/css/app.css';
	import '$lib/css/dark-theme.css';


	// Import Backendless system
	import Backendless from 'backendless'
	const APP_ID = 'BFD3873C-0565-EBFE-FFA8-8001D60AC000';
	const API_KEY = '8561E43D-334E-44E4-B05E-40A81D6E081A';
	Backendless.initApp(APP_ID, API_KEY);


	// Helper functions
	import {onMount, beforeUpdate} from 'svelte';
	import {partyJS} from "$lib/functions/confetti";
	import {fade} from 'svelte/transition';
	import {loading, setGuestCharacter, setUserToken, theme, userData} from "$lib/store";
	import {initAuthentication, verifyPrivateRoutes} from "$lib/functions/auth";


	// Protected Routes system
	verifyPrivateRoutes();

	// Wait till the layout component is rendered
	onMount(async() => {
		// Initialize Backendless and check if the user is logged in
		await initAuthentication();

		// Check for guest character and set the state
		setGuestCharacter();

		// Activate confetti!
		partyJS();

		// Update theme
		if($userData) {
			if($userData.theme === 1) theme.set("light");
			if($userData.theme === 2) theme.set("dark");
		}
	});

	beforeUpdate(() => {
		// Always check for the login details
		setUserToken();

		// Check theme
		if($theme === "dark") {
			// Dark Theme!
			document.body.classList.add('dark-theme');
		} else {
			// Remove all themes to default to Light Theme!
			document.body.classList.remove('dark-theme');
		}
	})
</script>


<style>
	#loading-icon {
		background-color: #222;
		color: #fff;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>


{#if $loading}

	<div id="loading-icon">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>

{:else}

	<div transition:fade="{{duration: 300}}">
		<Header />

		<main>
			<slot />
		</main>

		<Footer />
	</div>

{/if}
