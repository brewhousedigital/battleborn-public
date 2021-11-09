<script>
    import {getDice} from "$lib/data/dice";
    let diceList = getDice("low");

    export let attributes;
    export let character;

    let critical = false;
    let math = "#";
    let resultTotal = "";
    let animate = false;


    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        //The maximum is inclusive and the minimum is inclusive
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function rollDice(e) {
        let el = e.target;
        let dataType = el.getAttribute("data-type");
        let roll = "";
        let rollText = "";

        // Reset everything to defaults
        critical = false;
        animate = false;
        resultTotal = "";

        // Reset css animation
        el.classList.remove("dice-roll-animation")

        if(dataType === "dice") {
            let min = parseInt(el.getAttribute("data-min"));
            let sides = parseInt(el.getAttribute("data-sides"));

            rollText = getRandomIntInclusive(min, sides);
        }

        else {
            let min = parseInt(el.getAttribute("data-min"));
            let sides = parseInt(el.getAttribute("data-sides"));
            let bonus = parseInt(el.getAttribute("data-bonus"));

            roll = getRandomIntInclusive(min, sides);

            // Critical hit!!
            if(roll === 20) {
                critical = true;
                party.confetti(el);
                let secondRoll = getRandomIntInclusive(min, sides);

                if(secondRoll === 20) {
                    let thirdRoll = getRandomIntInclusive(min, sides);

                    if(thirdRoll === 20) {
                        let fourthRoll = getRandomIntInclusive(min, sides);

                        rollText = "(" + roll + " + " + secondRoll + " + " + thirdRoll + " + " + fourthRoll + ") + " + bonus;
                        roll = roll + secondRoll + thirdRoll + fourthRoll + bonus;
                    } else {
                        rollText = "(" + roll + " + " + secondRoll + " + " + thirdRoll + ") + " + bonus;
                        roll = roll + secondRoll + thirdRoll + bonus;
                    }
                } else {
                    rollText = "(" + roll + " + " + secondRoll + ") + " + bonus;
                    roll = roll + secondRoll + bonus;
                }

            } else if(roll === 1) {
                // FAILURREEEEE
                let fail = document.querySelector("#failure-message");
                fail.classList.add("critical");
                rollText = "(" + roll + ") + " + bonus;
                roll = roll + bonus;

                setTimeout(() => {
                    fail.classList.remove("critical");
                }, 3000)
            } else {
                // Not a critical
                rollText = "(" + roll + ") + " + bonus;
                roll = roll + bonus;
            }
        }

        // If theres a ability check, show the equals sign
        if(roll) {
            resultTotal = " = " + roll;
        } else {
            // If normal roll, just replace the content
            roll = rollText;
        }

        setTimeout(() => {
            animate = true;
            math = rollText;
        }, 10)
    }

</script>


<style>
    #dice-roll-result {
        transform: rotate(0deg);
    }
    .dice-roll-animation {
        transition: all 200ms ease;
        transform: rotate(360deg)!important;
    }

    #failure-message {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 100px;
        color: #fff;
        font-weight: 900;
        width: 100%;
        text-align: center;
        background-color: #C0392B;
        height: 100%;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0);
        transition: all 300ms;
    }

    :global(#failure-message.critical) {
        transform: scale(1);
    }
</style>


<div id="failure-message">CRITICAL FAIL</div>

<div class="row justify-content-center">
    {#each diceList as dice}
        <button type="button"
                on:click={rollDice}
                class="btn btn-link btn-lg col-auto mb-4 text-decoration-none"
                data-type="dice"
                data-min="{ dice.min }"
                data-name="{ dice.name }"
                data-sides="{ dice.base }">{ dice.name }</button>
    {/each}
</div><!-- end row -->

<p class="text-center">Ability Check (1d20 + ability)</p>
<div class="row justify-content-center">
    {#each attributes as item}
        <button type="button"
                on:click={rollDice}
                class="btn btn-link btn-lg col-auto mb-4 text-decoration-none"
                data-type="{item}"
                data-bonus="{ character[item] }"
                data-min="1"
                data-name="{item}"
                data-sides="20">{item}</button>
    {/each}
</div>

<div class="text-center h4 fw-bold">
    <span>Your Roll:</span>
    <!--  -->
    <span id="dice-roll-result" class="d-inline-block {animate ? 'dice-roll-animation' : ''}">
        <span class="d-inline-block">{math}</span>
        <span class="d-inline-block">{resultTotal}</span>
    </span>
</div>

<div id="dice-roll-critical"
     class="text-center h3 fw-bold rainbow color-belizehole"
     style="display: {critical ? 'block' : 'none'}">Critical Hit!</div>