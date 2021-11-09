<svelte:head>
    <title>Game Rules - Skill Checks</title>
</svelte:head>

<style>
    #dice {
        display: block;
        max-width: 200px;
        margin: 40px 0;
    }
</style>

<h2>Skill Checks</h2>

<p>When a character attempts a skill/spell check, 1d20 is rolled then added to the corresponding ability score.
    Skill/spell checks fall into five categories:</p>
<ul>
    <li>Easy: <code>must roll a 2 or higher</code></li>
    <li>Average: <code>must roll a 6 or higher</code></li>
    <li>Challenging: <code>must roll an 12 or higher</code></li>
    <li>Expert: <code>must roll a 20 or higher</code></li>
    <li>Impossible: <code>must roll a 40 or higher</code></li>
</ul>

<p class="mb-5">If a 20 is rolled, the player can roll the d20 again and add the numbers together.</p>


<h3>Example:</h3>

<p>As you run for your life from the ravenous pack of wolves, you suddenly reach a dead end in the path. In front of you is an almost vertical cliff side with few places to grab on. The wolves stop and begin spreading out. They know their prey is caught.</p>

<p>You think for a second, and see three options in front of you. Fight the wolves, and surely die. You lost one of your daggers back in town. Second option is to try to climb this near-impossible cliff. Third option is to hope your deity protects you as the wolves descend on you. Considering you don't worship the god of thievery, your luck with divine intervention is probably slim.</p>

<p>Second option is is. You quickly turn around and place your hand on the first available rock.</p>

<p class="fst-italic">The DM tells you this will be an expert dexterity attempt and you'll need a total score of 20 or higher.</p>

<p>You eye your character sheet and see your dexterity score of 6. You'll need a roll of 14 or higher. Those are better odds than staying behind to get eaten. You roll your d20 dice.</p>

<img id="dice" src="/images/graphics/D20_Dice-rolled-16.png" alt="d20 dice that landed on 16" class="img-fluid">

<p class="font-header font-24">22! Success!</p>

<p>Your roll of 16 is added to your dexterity score of 6, totalling 22.</p>

<p>Your character gives everything they have to scale the cliff side as the wolves begin charging and howling at the base. You are able to make it to the top just as your energy leaves you. You live to thieve another day.</p>