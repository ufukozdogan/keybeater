window.addEventListener('load', init);

var currentLevel = 5;

var words = [];
var xmlhttp;

if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var text = xmlhttp.responseText;
        // Now convert it into array using regex
        words = text.split("\n");
    }
}
xmlhttp.open("GET", "/wordpool/english.txt", true);
xmlhttp.send();

let time = currentLevel;
let score = 0;
let isPlaying;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');

// Initialize Game
function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Load word from array
  showWord(words);
  // Start matching on word input
  document.getElementById("selDiff").addEventListener("change", setLevel, false);
  document.getElementById("selLang").addEventListener("change", setLanguage, false);
  wordInput.addEventListener('input', startMatch);

  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  setInterval(checkStatus, 50);
}

function setLevel() {
    console.log();
    var selectedLevel = document.getElementById("selDiff");
    if(selectedLevel.value == "Easy")
    {
        currentLevel = 5;
    }
    else if(selectedLevel.value == "Medium")
    {
        currentLevel = 3;
    }
    if(selectedLevel.value == "Hard")
    {
        currentLevel = 1;
    }
    seconds.innerHTML = currentLevel;
    console.log(currentLevel);
}

function setLanguage() {
    var selectedLang = document.getElementById("selLang");
    if(selectedLang.value == "Türkçe")
    {
    xmlhttp.open("GET", "/wordpool/turkce.txt", true);
    xmlhttp.send();
    words = currentWord.innerHTML;
    currentWord.innerHTML= words; 
        
    }
}

// Start match
function startMatch() {
    if (matchWords()) {
      isPlaying = true;
      time = currentLevel + 1;
      showWord(words);
      wordInput.value = '';
      score++;
    }
  
    // If score is -1, display 0
    if (score === -1) {
      scoreDisplay.innerHTML = 0;
    } else {
      scoreDisplay.innerHTML = score;
    }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
    
    message.innerHTML = "<span style='color:red'>Game Over!<br />Start again by typing the word on the screen.</span>";
    score = -1;
  }
}