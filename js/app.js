
/*
* Declaring global variables
 */
let allCards = [];
let openCards = [];
let moveCounter = 0;
/*
 * Create a list that holds all of your cards
 */
function createCards() {
    const imgList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb",];
    
    let cards = []
    imgList.forEach(function (img, index) {
        let card = document.createElement("li");
        card.className = "card";

        let cardImg = document.createElement("i");
        cardImg.className = `fa ${img}`;
        card.appendChild(cardImg);

        cards.push(card);
        cards.push(card.cloneNode(true));
    });
    return cards;

}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
document.addEventListener("DOMContentLoaded", function () {
    const deck = document.querySelector(".deck");
    allCards = shuffle(createCards());
    const cardsFragment = new DocumentFragment();
    allCards.forEach(function(card){
        cardsFragment.appendChild(card);
    });
    deck.appendChild(cardsFragment);
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function showCard(card) {
    card.className = "card show open";
    openCards.push(card);
    if (openCards.length === 2) {matchCards()};
}

function matchCards() {
    moveCounter++;
    if (openCards[0] == openCards[1]) {
        openCards[0].className = "card show match";
        openCards[1].className = "card show match";
    } else {
        hideOpenCards();
    }
    openCards = [];
}

function hideOpenCards () {
    openCards[0].className = "card";
    openCards[1].className = "card";
}
