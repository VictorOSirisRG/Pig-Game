'use strict';
//Variables
let scores, activePlayer, playing, currentScore;

//Selecting elements
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1'); // Do the same but this is technically faster .
const playerActiveEl0 = document.querySelector(`.player--0`);
const playerActiveEl1 = document.querySelector(`.player--1`);

const diceEl = document.querySelector('.dice');

const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');

const switchingPlayer = function () {
  //Current to 0
  if (playing) {
    diceEl.classList.add('hidden');
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore = 0;
    //Switch Player
    activePlayer = activePlayer === 0 ? 1 : 0;
    playerActiveEl0.classList.toggle('player--active');
    playerActiveEl1.classList.toggle('player--active');
  }
};

//Starting Condition

const init = function () {
  activePlayer = 0;
  currentScore = 0;
  playing = true;
  scores = [0, 0];
  score0El.textContent = 0; //"Js convert to sting to show it to the user"
  score1El.textContent = 0;
  diceEl.classList.add('hidden');
  playerActiveEl0.classList.add('player--active');
  playerActiveEl1.classList.remove('player--active');
  playerActiveEl0.classList.remove('player--winner');
  playerActiveEl1.classList.remove('player--winner');
  document.getElementById('current--0').textContent = 0;
  document.getElementById('current--1').textContent = 0;
};
init();

score0El.textContent = 0; //"Js convert to sting to show it to the user"
score1El.textContent = 0;
diceEl.classList.add('hidden');

//Generate random dice roll

btnRoll.addEventListener('click', function () {
  if (playing) {
    //Removing Hidden clas Adding random number
    diceEl.classList.remove('hidden');
    let dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.src = `dice-${dice}.png`;
    console.log(dice);
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchingPlayer();
    }
  }
});

//NOTE HOLD Button
btnHold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    console.log(scores[activePlayer]);
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    if (scores[activePlayer] >= 100) {
      playing = false;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
    } else {
      switchingPlayer();
    }
  }
});

btnNew.addEventListener('click', init);
