<script context="module">
	export const prerender = true;
</script>

<script>
	import "$lib/css/paper.css";
	import PaperCardLink from "$lib/page-components/PaperCardLink.svelte";

	let diceClickCount = 1;
</script>


<svelte:head>
	<title>Home - Battleborn</title>
</svelte:head>


<style>
	#hero-banner {
		background-color: #222;
		color: #fff;
		padding: 60px 0;
		background-image: url("/images/stories/silver-moon-tavernjpg.jpg");
	}

	.homepage-spinning-dice {
		animation-name: animateDice;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-duration: 36s;
	}

	@keyframes animateDice {
		0% {transform: rotate(0deg)}
		100% {transform: rotate(360deg)}
	}

	:global(.filter-dice1) {filter:hue-rotate(90deg)}
	:global(.filter-dice2) {filter:hue-rotate(180deg)}
	:global(.filter-dice3) {filter:hue-rotate(270deg)}
	:global(.filter-dice4) {filter:hue-rotate(360deg)}
</style>


<section class="container py-5 mb-5">
	<h2 class="display-1 mb-2">Welcome to the best RPG around <img src="/images/graphics/D20_Dice-rolled-20.png" alt="d20 dice" class="homepage-spinning-dice" on:click={(e) => {
		e.target.classList.add("filter-dice" + diceClickCount);

		diceClickCount++;
		if(diceClickCount > 4) {
			diceClickCount = 1;
			e.target.classList.remove("filter-dice1", "filter-dice2", "filter-dice3", "filter-dice4");
		}
	}}></h2>
	<p class="font-24">Battleborn is an easy-to-use Tabletop RPG Game where swords and magic collide in a fun and simple setting.</p>
	<p class="font-24 mb-5">Get started on a new character without having to create an account! For more features, and saving your created characters, create an account <a href="/register">here</a>.</p>

	<div class="row">
		<div class="col-lg-3 col-md-6 mb-5">
			<PaperCardLink title="Read the Rules" link="/rules" image="scroll.png" />
		</div><!-- end col -->

		<div class="col-lg-3 col-md-6 mb-5">
			<PaperCardLink title="Create a Character" link="/characters/create" image="potion.png" />
		</div><!-- end col -->

		<div class="col-lg-3 col-md-6 mb-5">
			<PaperCardLink title="Support Battleborn" link="/support" image="support.png" />
		</div><!-- end col -->

		<div class="col-lg-3 col-md-6 mb-5">
			<PaperCardLink title="Create a Campaign" link="/campaigns/create" image="map.png" />
		</div><!-- end col -->
	</div><!-- end row -->
</section>



<section id="hero-banner" class="mb-5">
	<div class="container position-relative">
		<h2>📖 New Story!</h2>

		<h3 class="display-1">The Silvermoon Tavern</h3>
		<p style="max-width: 540px">After weeks of travel with no end in sight, the party stumbles upon a mysterious tavern near the edge of a dark forest. The smell of fresh baked bread and the sounds of merry music drift through the air, inviting the group closer and closer. A welcome break from their weary adventure, but this lively party may not be all that it seems.</p>
		<p><a href="/stories/the-silvermoon-tavern" class="stretched-link btn btn-light px-4">Check it out!</a></p>
	</div><!-- end container -->
</section>



<section class="container py-5">
	<h2>What is Battleborn?</h2>

	<div class="mb-4">
		<h3>It's a Tabletop RPG!</h3>
		<p>A tabletop role-playing game (or pen-and-paper role-playing game) is a form of role-playing game (RPG) in which the participants describe their characters' actions through speech. Participants determine the actions of their characters based on their characterization,<sup>[1]</sup> and the actions succeed or fail according to a set formal system of rules and guidelines. Within the rules, players have the freedom to improvise; their choices shape the direction and outcome of the game.<sup>[2]</sup></p>

		<ol class="small">
			<li>Kim, John. <a href="http://www.darkshire.net/~jhkim/rpg/whatis/" target="_blank">"What is a Role-Playing Game?"</a></li>
			<li>Kim, John. <a href="http://www.darkshire.net/~jhkim/rpg/whatis/tabletop.html" target="_blank">""Narrative" or "Tabletop" RPGs"</a></li>
			<li>Wikipedia: <a href="https://en.wikipedia.org/wiki/Tabletop_role-playing_game" target="_blank">Tabletop Role Playing Game</a></li>
		</ol>
	</div><!-- end section -->


	<div class="mb-4">
		<h3>The Setting</h3>
		<p>Battleborn is a fantasy based game where magic and conflict are as common as the water in the oceans. Multiple gods, good and evil, rule from afar, only interfering when their interest is peaked by the mortals beneath them. Cities, large and small, scatter the planet. Some filled with just a few people, others number by the thousands.</p>
	</div><!-- end section -->


	<div class="mb-4">
		<h3>What is a Dungeon Master?</h3>
		<p>The Dungeon Master (or Game Master) creates and directs the campaign that players participate in. They are responsible for keeping the campaign adaptable if players take a different direction than the story was written for.</p>
	</div><!-- end section -->


	<div class="mb-4">
		<h3>What are Characters?</h3>
		<p>Characters are created to play in the story that the Dungeon Master crafts. This character can have any kind of personality or can mirror the personality of the player! This is a good opportunity to practice your acting skills.</p>
	</div><!-- end section -->


	<div class="mb-4">
		<h3>What are Campaigns?</h3>
		<p>Campaigns are created by the Dungeon Master and played with other players. Campaigns can have any number of players, whether its one or fifteen. This is up to the dungeon master to decide.</p>
	</div><!-- end section -->
</section>