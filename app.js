// Assign variables
var houseTotal = 0;
var playerTotal = 0;

var houseAceCount = 0;
var playerAceCount = 0;

var hidden;
var deck;

var canHit = true; // allows the player to hit when under or equal to 21

// Start the game with initial functions
window.onload = () => {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; // Array of cards
    let types = ["C", "D", "H", "S"]; // suits
    deck = []; // empty array of cards

    // matches the card img names and pushes them to deck array
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
    //console.log(deck); // Testing

}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // math.random gives either 0 or 1, multiply that by 52 (deck length) to choose a random card
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck); // test deck to make sure shuffled
}

function startGame() {
    hidden = deck.pop(); // takes the last card of deck array
    houseTotal += getValue(hidden);
    houseAceCount += checkAce(hidden); // check if hidden card is ace
    //console.log(hidden); // test top card
    //console.log(houseTotal); // test house total card count
    while (houseTotal < 17) {
        let cardImg = document.createElement("img"); // create an img element
        let card = deck.pop(); //take the last item from deck and assign to card
        cardImg.src = "./images/" + card + ".png"; // assign card to an img of card
        houseTotal += getValue(card); // add the card to house total
        houseAceCount += checkAce(card); // check if card is an ace and add to ace count
        document.getElementById("house-cards").append(cardImg); // appending card img to the house-cards div element
    }

    console.log(houseTotal);
    
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./images/" + card + ".png";
        playerTotal += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }
    console.log(playerTotal); // test player total card count
    document.getElementById("hit").addEventListener("click", hit); // get the hit button from html, when clicked execute hit function.
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    // run if statement to see if already bust
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./images/" + card + ".png";
    playerTotal += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    if (reduceAce(playerTotal, playerAceCount) > 21) { //
        canHit = false;
    }

}

function stay() {
    houseTotal = reduceAce(houseTotal, houseAceCount);
    playerTotal = reduceAce(playerTotal, playerAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./images/" + hidden + ".png";

    // Run conditions for win, lose or draw
    let message = "";
    if (playerTotal > 21) {
        message = "You Lose!";
    }
    else if (houseTotal > 21) {
        message = "You win!";
    }
    //both player and dealer <= 21
    else if (playerTotal == houseTotal) {
        message = "Draw!";
    }
    else if (playerTotal > houseTotal) {
        message = "You Win!";
    }
    else if (playerTotal < houseTotal) {
        message = "You Lose!";
    }

    document.getElementById("house-total").innerText = houseTotal; // takes the variable and puts it in the house-total span in html
    document.getElementById("player-total").innerText = playerTotal;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // takes the card and removes the '-' leaving an array of number and suit e.g. ["4", "D"]
    let value = data[0]; //takes the card number, index 0 of data.

    if (isNaN(value)) { // if value is not a number then return 11 if Ace, 10 otherwise. K, Q, J all count as 10.
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value); // if value is a number return as an integer}
}

function checkAce(card) { // if the card is a A for ace then return 1, 0 if not
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerTotal, playerAceCount) { // if playerTotal is greater than 21 and the playerAceCount is greater than 0 then reduce playerTotal by 10 and change playerAceCount to 0
    while (playerTotal > 21 && playerAceCount > 0) {
        playerTotal -= 10;
        playerAceCount -= 1;
    }
    return playerTotal;
}