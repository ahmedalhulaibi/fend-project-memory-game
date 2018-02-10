
/*
* Declaring global variables
 */
const allCards = [];
let openCards = [];
let moveCounter = 0;
let movesCounterSpan = undefined;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and add to document fragment
 *   - setup event listener for deck
 * 
 */
document.addEventListener("DOMContentLoaded", function () {
    const deck = document.querySelector(".deck");
    allCards.push(...shuffle(createCards()));
    const cardsFragment = new DocumentFragment();
    allCards.forEach(function (card) {
        cardsFragment.appendChild(card);
    });
    deck.appendChild(cardsFragment);
    deck.addEventListener('click', cardClicked);
    movesCounterSpan = document.querySelector(".moves");
    movesCounterSpan.innerHTML = moveCounter;
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
 * Create a list that holds all of your cards
 */
function createCards() {
    const imgList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb",];
    const cards = [];
    imgList.forEach(function (img, index) {
        const card = document.createElement("li");
        card.className = "card";

        const cardImg = document.createElement("i");
        cardImg.className = `fa ${img}`;
        card.appendChild(cardImg);

        cards.push(card);
        cards.push(card.cloneNode(true));
    });

    return cards;
}

/*
 * event handler for a card if a card is clicked:
 */
function cardClicked(event) {
    if (event.target.classList.contains("card") && !event.target.classList.contains("match")) {
        showCard(event.target);
    }
}

/*
 * display the card's symbol andadd the card to a *list* of "open" cards 
 * if the *list* of *open* cards has two elements, check to see if the two cards match
 */
function showCard(card) {
    if (openCards.length < 2) {
        card.className = "card show open";
        //prevent a card from matching itself if clicked again
        if (openCards[0] !== card) {
            openCards.push(card);
        }
        //if there are 2 open card
        if (openCards.length === 2) {
            matchCards();
        }
    }
    if (openCards.length >= 3) {
        hideOpenCards();
    }
}

/*
 * if the cards do match, lock the cards in the match position
 * if the cards do not match, call no match function 
 */
const matchCards = function () {
    moveCounter++;
    movesCounterSpan.innerHTML = moveCounter;
    
    if (openCards[0].innerHTML == openCards[1].innerHTML) {
        openCards[0].className = "card show match";
        openCards[1].className = "card show match";
        checkGameOver();
        openCards = [];
    } else {
        setTimeout(noMatchCards, 250);
    }
};

/*
 * switch cards to nomatch state for animation 
 */
const noMatchCards = function () {
    openCards[0].className = "card show nomatch";
    openCards[1].className = "card show nomatch";
    const cardStyle = window.getComputedStyle(openCards[0]);

    //use CSS antimaiton time as timeout before next state transition
    setTimeout(hideOpenCards, parseFloat(cardStyle.getPropertyValue('animation-duration')) * 1000);
}

/*
 * remove the cards from the list and hide the card's symbol
 */
const hideOpenCards = function () {
    for (const card of openCards) {
        card.className = "card";
    }
    openCards = [];
};

/*
 * if all cards have matched, display a message with the final score
 */
const checkGameOver = function () {
    let win = true;

    for (const card of allCards) {
        win = card.classList.contains("match");
        if (!win) {
            break
        }
    }

    if (win) {
        console.log(`You won in ${moveCounter} moves.`);
    } else {

    }
}
