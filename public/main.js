const startingSeconds = 60; // game always begins with 60 seconds
let time = startingSeconds; // time starts at 60 seconds but will decrement later
const timer = document.getElementById("timer"); // accesses a <p> tag on the countdown in "main.html"
var score = 0; // setting initial value to 0 mkes the increment in updateScore() function properly; 0 is already displayed by default in "main.html"
const scoreboard = document.getElementById("score"); // accesses <p> tag on scoreboard in "main.html"
const input = document.getElementById("input"); // accesses text box on the gameboard in "main.html"
const submit = document.getElementById("submit"); // accesses submit button on gameboard in "main.html"
const word = document.getElementById("word"); // accesses a <p> tag to display the generated word on the gameboard in "main.html"
let rhymeWord = ""; //initialize a variable rhymeWord outside getRandomWord()

// BEGINNING GAME/GAME SET UP FUNCTIONS

const phraseArray = [
  "Get your rhyme on!",
  "You got this!",
  "In 3, 2, 1..",
  "FOR GLORY!!!",
  "Time to rhyme!",
  "A minute to win it!",
  "What rhymes with Rhyme-R?",
  "Good Luck!",
  "**The crowd goes wild**",
];
word.innerHTML = phraseArray[Math.floor(9 * Math.random())]; // random phrase will be place holder for the word.innerHTML

function getRandomWord() {
  // is called by a window event listener as soon as the page loads
  fetch("https://random-word-api.herokuapp.com/word?length=5") // fetches a random 5 letter word
    .then((res) => res.json())
    .then((data) => {
      rhymeWord = data[0]; // function is asynchronous; rhymeWord will store, but only after function has finished running
      getURL(); // calls getURL on a delay to allow getRandomWord to finish and rhymeWord to return
    });
}

const beginning = "https://wordsapiv1.p.rapidapi.com/words/"; //beginning of api call
const end = "/rhymes"; // end of api call
function getURL() {
  let url = beginning + rhymeWord + end; // concatenates rhymeWord into the api endpoint to allow us to pass a valid url to fetchArray with generated word as the variable
  console.log(url); // helps programmer diagnose any problems; can identify whether problem occured with fectchArray or if url was not valid
  fetchArray(url); //fetchArray is called with url as the parameter; should allow us to access an array of rhyming words to our generated word
}

let rhymeArray = new Array(); // initialize an array outside of fetchArray
const options = {
  // variable with API headers, including our key, to be passed into the fetch() call
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    "X-RapidAPI-Key": "", //insert API key here
  },
};

function fetchArray(url) {
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      if (typeof data === "undefined") {
        getRandomWord();
      } else if (typeof data.rhymes.all === "undefined") {
        // if generated word has no rhymes(according to API), it will not have an array object inside data.rhymes.all
        getRandomWord(); // if condition is met, generate a new word
      } else {
        // if condition is not met, the generated word produced at least one rhyme
        console.log(data.rhymes.all.length);
        if (data.rhymes.all.length < 10) {
          // we only want to play with words with at least ten rhymes; limits the obscurity of the generated word
          getRandomWord(); // if generated word has less than ten associated rhymes, generate a new word
        } else {
          // otherwise, we will fetch our rhymeArray
          for (i = 0; i < data.rhymes.all.length; i++) {
            // begins copying data into rhymeArray
            if (
              data.rhymes.all[i] != rhymeWord &&
              !hasWhiteSpace(data.rhymes.all[i])
            ) {
              rhymeArray.push(data.rhymes.all[i]);
            }
          }
          if (rhymeArray.length >= 10) {
            localStorage.rhymes = JSON.stringify(rhymeArray); //****THIS LINE IS CHANGED **/
            word.innerHTML = rhymeWord; // word is displayed on the gameboard in "main.html"
            setTimeout(startGame, 50); // half a second delay before game is started; allows time for rhymeArray to copy all rhymes
          } else {
            getRandomWord();
          }
        }
      }
    });
}

function startGame() {
  //  initializer for the countdown -- game officially begins
  console.log(rhymeArray); // helps programmer diagnose errors; answers the question: was rhymeArray successfully generated; also helps monitor updateScore()
  setInterval(updateCountdown, 1000); // updateCountdown iterates every second
}

function updateCountdown() {
  timer.innerHTML = time; // 60 second starting time is displayed in countdown; new time displayed every interval
  time--; // time decrements every interval
  if (time <= -1) {
    // "<= =1" because the countdown continues decrementing and we want to continue displaying "Game Over"
    timer.innerHTML = "Game Over"; // displays from "time == -1 to time == -5"
    if (time == -4) {
      // so that the Game Over page is not immediately loaded after game ends
      finishGame(); // loads Game Over page
      clearInterval(updateCountdown); // countdown ends
    }
  }
}

// DURING GAME/GAME PLAY FUNCTIONS

function updateScore(anInput) {
  for (i = 0; i < rhymeArray.length; i++) {
    // use the above "rhymeArrays" to test that the scoring conditions are working
    // eventually, the rhymeArray will be generated by the rhyme API
    if (anInput.value == rhymeArray[i] && timer.innerHTML != "Game Over") {
      // input must be in "rhymeArray" and game cannot be over
      score++; // iterate "score" before displaying it on the scoreboard
      scoreboard.innerHTML = score;
      rhymeArray.splice(i, 1);
      //rhymeArray.splice(i, 1); // once a word is used as a rhyme, it is removed from "rhymeArray" and can't be used again
    } // if condition is not met, nothing occurs, so no else statement is needed
  }
}

input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    updateScore(input); // whatever is submitted in text box is then tested to see if it scores
    input.value = ""; // text box is then reset
  }
});

// AFTER GAME/ENDING GAME FUNCTIONS

/*
- still need a function that exports the "score" variable so that we can access it on gameOver.html/gameOver.js

*/

function finishGame() {
  if (timer.innerHTML == "Game Over") {
    // condition will always be met(see: function call in updateCountdown())
    window.location.href = "gameOver.html"; // load up a Game Over web page
  }
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", responseHandler);
  query = `score=${score}`;
  url = `/score`;
  xhr.responseType = "json";
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(query);
}

function responseHandler() {
  if (this.response.success) {
    console.log("Success!");
  } else {
    console.log(this.response.success);
  }
}

// FUNCTION CALLS

window.addEventListener("load", getRandomWord); // getRandomWord() sets off a sequence of function calls that begins the game

// HELPER METHODS

function hasWhiteSpace(s) {
  // get rid of two word rhymes
  return s.indexOf(" ") > 0;
}
