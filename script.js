const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// boolean determining whether game is on or off
let gameOn = false;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// pick any number of colors
function colorGenerator(numColors) {
  const totalCardNum = Math.round(Math.random()*numColors*2);
  const colors = [];

  for (let i = 0; i < numColors; i++) {
    const r = Math.round(Math.random()*255);
    const g = Math.round(Math.random()*255);
    const b = Math.round(Math.random()*255);
    colors.push(`rgb(${r},${g},${b})`);
    colors.push(`rgb(${r},${g},${b})`);
  }

  return colors;
}

// sets up score elements
function scoreSetup() {
  const score = document.createElement('div');
  const topScore = document.createElement('div');

  score.innerText = 0;
  score.id = 'score';
  topScore.id = 'topscore';

  // get top score from localStorage, if present
  if (localStorage.getItem('topscore')) {
    topScore.innerText = localStorage.getItem('topscore');
  }
  else {
    localStorage.setItem('topscore', '1000');
    topScore.innerText = 1000;
  }

  // create score labels
  const scoreLabel = document.createElement('label');
  const topScoreLabel = document.createElement('label');

  // set labels
  scoreLabel.innerText = 'Score: ';
  topScoreLabel.innerText = 'Best Score: ';

  // make score elements their children
  scoreLabel.appendChild(score);
  topScoreLabel.appendChild(topScore);

  // append 
  document.getElementById('menu').appendChild(scoreLabel);
  document.getElementById('menu').appendChild(topScoreLabel);
}

// reset current score
function resetScore() {
  document.getElementById('score').innerText = 0;
}

// increment current score by 1
function incrementScore() {
  const currentScore = document.getElementById('score');
  currentScore.innerText = parseInt(currentScore.innerText) + 1;
}

// update top score in menu and localStorage
function updateTopScore(score) {
  const topScoreElement = document.getElementById('topscore');
  topScoreElement.innerText = score;
  localStorage.setItem('topscore', score);
}

// adds button to #game div, and sets up menu div
function startSetup() {
  const startButton = document.createElement('button');
  startButton.innerText = 'Start';
  startButton.id = 'start';

  // add event listener to delete button upon click
  startButton.addEventListener('click', function(e) {
    gameOn = true;
    e.target.remove();
  });

  // create menu container
  const container = document.createElement('div');
  container.id = 'menu';
  container.appendChild(startButton);

  // add menu container right after heading
  document.querySelector('h1').insertAdjacentElement('afterend', container);
  // create and append score elements
  scoreSetup();
}

function restartSetup() {
  const restartButton = document.createElement('button');
  restartButton.innerText = 'Restart';
  restartButton.id = 'start';

  // add event listener to delete button upon click
  restartButton.addEventListener('click', function(e) {
    // empty contents of #game div
    document.getElementById('game').innerHTML = '';
    
    // reshuffle cards
    shuffledColors = shuffle(colorGenerator(Math.round(Math.random()*15)));

    // fill #game div with new cards
    createDivsForColors(shuffledColors);

    gameOn = true;
    e.target.remove();

  });

  // insert restart button before score inside of menu element
  const score = document.getElementById('score');
  score.insertAdjacentElement('beforebegin', restartButton);
}

// flips card by toggling background color and 'revealed' class status
function flip(card) {
  if (document.getElementsByClassName('revealed').length > 2) return false;

  if (card.style.backgroundColor === '') {
    card.style.backgroundColor = card.classList[0];
  }
  else {
    card.style.backgroundColor = '';
  }

  card.classList.toggle('revealed');
  return true;
}

// match checker. cancels event if two cards are still revealed.
function handleCardClick(event) {
  // if start button is present, cancel event
  if (!gameOn) return;

  // cancel event if clicking on a card that is already revealed
  if (event.target.classList.contains('revealed')) return;

  // get number of revealed cards
  const revealed = document.getElementsByClassName('revealed');

  switch(revealed.length) {
    case 0: // flip card if no other card has been revealed yet
      flip(event.target);
      break;
    case 1: // flip another card and check for match

      flip(event.target);
      
      // references to each revealed card
      const card1 = revealed[0];
      const card2 = revealed[1];

      // check if current card matches the previous one
      if (card1.style.backgroundColor === card2.style.backgroundColor) {

        card1.classList.add('matched');
        card1.classList.toggle('revealed');
        card2.classList.add('matched');
        card2.classList.toggle('revealed');

        // victory alert
        if (document.getElementsByClassName('matched').length === document.getElementById('game').childElementCount) {
          setTimeout(function() {
            // update top score
            if (parseInt(document.getElementById('score').innerText) < parseInt(localStorage.getItem('topscore'))) {
              updateTopScore(parseInt(document.getElementById('score').innerText));
            }
            // victory
            alert('You won!');

            // reset game
            resetScore();
            restartSetup();
            
          }, 500);
        }
      }
      else { // if cards don't match, flip them back in 1s
        setTimeout(function() {
          flip(card1);
          flip(card2);
          incrementScore();
        }, 1000);
      }
      break;
    default: // if two or more cards are selected, do not flip card.
      break;
  }
}

// when the DOM loads
createDivsForColors(shuffle(colorGenerator(Math.round(Math.random()*15))));
startSetup();
