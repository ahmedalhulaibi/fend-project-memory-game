
/*
* Declaring global variables
 */
const allCards = [];
let openCards = [];
let movesCounter = 0;
let movesCounterSpan = undefined;
let starsElement = undefined;
let gameOver = false;
let seconds = 0;
let timerFunc = undefined;
let timerSpan = undefined;
let divGameContainer = undefined;
let winModal = undefined;

document.addEventListener("DOMContentLoaded", function () {
    divGameContainer = document.querySelector(".container");
    winModal = document.querySelector(".win-modal");
    restart();

    document.querySelector(".restart").addEventListener('click', restart);

    document.querySelector(".win-modal-play-button").addEventListener('click',restart);

});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and add to document fragment
 *   - setup event listener for deck
 *   - assign DOM elements to respective globals
 */
function restart() {
    //set gameOver flag to false
    gameOver = false;
    //hide win-modal
    winModal.style.display = 'none';
    divGameContainer.style.display = 'flex';

    const deck = document.querySelector(".deck");

    //set allCards length to zero
    allCards.length = 0;

    //push new shuffled cards to allCards
    allCards.push(...shuffle(createCards()));

    const cardsFragment = new DocumentFragment();

    allCards.forEach(function (card) {
        cardsFragment.appendChild(card);
    });

    //clear existing child card elements from deck
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    deck.appendChild(cardsFragment);
    deck.addEventListener('click', cardClicked);

    movesCounter = 0;
    if (movesCounterSpan === undefined) {
        movesCounterSpan = document.querySelector(".moves");
    }
    movesCounterSpan.innerHTML = movesCounter;

    if (starsElement === undefined) {
        starsElement = document.querySelector(".stars");
    }
    updateMoves();

    if (timerSpan === undefined) {
        timerSpan = document.querySelector(".timer");
    }
    startTimer();
}

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

function startTimer() {
    stopTimer();
    seconds = 0;
    timerFunc = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;
    timerSpan.innerHTML = `${seconds}s`;
}

function stopTimer() {
    clearInterval(timerFunc);
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
        hideCards();
    }
}

/*
 * if the cards do match, lock the cards in the match position
 * if the cards do not match, call no match function 
 */
function matchCards () {
    movesCounter++;
    updateMoves();
    if (openCards[0].innerHTML == openCards[1].innerHTML) {
        openCards[0].className = "card show match";
        openCards[1].className = "card show match";
        checkGameOver();
        openCards = [];
    } else {
        setTimeout(noMatchCards, 250);
    }
}

/*
 * Updated html moves counter span
 * Update number of stars displayed based on performance
 */
function updateMoves() {
    movesCounterSpan.innerHTML = movesCounter;
    if (movesCounter <= 12) {
        starsElement.children[0].style.display = 'inline-block';
        starsElement.children[1].style.display = 'inline-block';
        starsElement.children[2].style.display = 'inline-block';
    } else if (movesCounter > 12 && movesCounter <= 18) {
        starsElement.children[0].style.display = 'inline-block';
        starsElement.children[1].style.display = 'inline-block';
        starsElement.children[2].style.display = 'none';
    } else {
        starsElement.children[0].style.display = 'inline-block';
        starsElement.children[1].style.display = 'none';
        starsElement.children[2].style.display = 'none';
    }
}

/*
 * switch cards to nomatch state for animation 
 */
function noMatchCards() {
    openCards[0].className = "card show nomatch";
    openCards[1].className = "card show nomatch";
    const cardStyle = window.getComputedStyle(openCards[0]);

    //use CSS antimaiton time as timeout before next state transition
    const animTime = parseFloat(cardStyle.getPropertyValue('animation-duration')) * 1000;
    setTimeout(() => { hideCards(openCards) }, animTime);
}

/*
 * remove the cards from the list and hide the card's symbol
 */
function hideCards(cards) {
    for (const card of cards) {
        card.className = "card";
    }
    openCards = [];
}

/*
 * if all cards have matched, display a message with the final score
 */
function checkGameOver() {
    for (const card of allCards) {
        gameOver = card.classList.contains("match");
        if (!gameOver) {
            break
        }
    }

    if (gameOver) {
        console.log(`You won in ${movesCounter} moves.`);
        stopTimer();
        setTimeout(showWinAlert,500);
    }
}

function showWinAlert () {
    winModalStats = winModal.querySelector(".win-modal-stats");
    let starsNum;
    if (movesCounter <= 12) {
        starsNum = 3;
    } else if (movesCounter > 12 && movesCounter <= 18) {
        starsNum = 2;
    } else {
        starsNum = 1;
    }
    winModalStats.innerHTML = `You earned ${starsNum} stars by completing the game in ${movesCounter} moves and ${seconds} seconds.`;
    winModal.style.display = 'flex';
}
