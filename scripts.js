let games = {
  1: 0,
  2: 3,
  3: 5,
  4: 8,
  5: 3,
  6: 6
}

let guessNum = 0;
let guess = '';
let guesses = [];
let winWord = 'STRAP';

const winDisplay = document.getElementById('winWord')

function playerStats() {
  let total = 0;
  Object.values(games).forEach(v => total += v) 
  for (let [k,v] of Object.entries(games)) {
    let p = v / total
    console.log(`${k}: ${p}`)
  }
}

function getStats() {
  let n = window.localStorage.getItem('wordlsoStats')
  games = JSON.parse(n)
  console.log(games)
}
function sendStats() {
  console.log('stats saved')
  window.localStorage.setItem('wordlsoStats', JSON.stringify(games))
  
}
function saver() {
  let wordlso = {
    guessNum: guessNum,
    guess: guess,
    guesses: guesses,
  };
  window.localStorage.setItem('wordlsoGame', JSON.stringify(wordlso))
}
function loader() {
  let n = window.localStorage.getItem('wordlsoGame')
  let load = JSON.parse(n)
  console.log(load)
}
function remover() {
  window.localStorage.removeItem('wordlsoGame');
}

async function getWord() {
  const randomWords = 'https://random-word-api.herokuapp.com/word?number=30'
  await fetch(randomWords)
    .then(data => {return data.json()})
    .then(res => {setWord(res)})
}
function setWord(list) {
  let words = list.filter(word => word.length == 5)
  if (words.length) {
    winWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    winDisplay.innerHTML = winWord;
  } else {
    getWord()
  }
}
async function checkWord(word=guess) {
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  if (word.length < 5) {
    console.log('oops')
    return
  } else {
    fetch(url)
    .then( data => {
      if (data.status == 404) {
        return false;
      } else {
        return true }})
    .then(c => {
      if (c) {
        guessWord()
      }  else {
        console.log('not a word')
      }
    })
  } 
}
function guessWord() {
  updateTiles();
  guesses.push(guess)
  guessNum++
  if (guess == winWord) { gameWin() }
  guess = '';
  saver();
}

async function updateTiles() {
  for (let i=0; i<5; i++) {
    let tile = document.getElementById(`g${guessNum}-${i}b`)
    let tilec = document.getElementById(`g${guessNum}-${i}`)
    let tilep = document.getElementById(`g${guessNum}-${i}p`)
    let key = document.getElementById(guess[i])
    if (guess[i] == winWord[i]) {
      tile.style.backgroundColor = '#226915'
      tilec.style.borderColor = '#226915'
      tilep.classList.add('flipper')
      key.style.backgroundColor = '#226915'
    } else if (winWord.includes(guess[i])) {
      tile.style.backgroundColor = '#b3a314'
      tilec.style.borderColor = '#b3a314'
      tilep.classList.add('flipper')
      key.style.backgroundColor = '#b3a314'
    } else {
      tile.style.backgroundColor = '#454545'
      tilec.style.borderColor = '#454545'
      tilep.classList.add('flipper')
      key.style.backgroundColor = '#454545'
    }
  }
}
function flipTile(i) {
  setTimeout(() => {
    if (guess[i] == winWord[i]) {
      tilep.classList.add('flipper')
      tile.style.backgroundColor = 'green'
    } else if (winWord.includes(guess[i])) {
      tilep.classList.add('flipper')
      tile.style.backgroundColor = 'yellow'
    } else {
      tilep.classList.add('flipper')
      tile.style.backgroundColor = 'gray'
      //grays out key
      let key = document.getElementById(guess[i])
      key.style.backgroundColor = 'gray'
    }
  }, 2000)
}

function gameWin() {
  document.getElementById('modalBG').style.display = 'block';
  document.getElementById('winBox').style.display = 'flex';
  games[guessNum]++;
  sendStats();
  guessNum = 0;
  guess = '';
}
function stats() {
  document.getElementById('modalBG').style.display = 'block';
  document.getElementById('statBox').style.display = 'flex';
  console.log('this will show stats from this machine');
}
function settings() {
  document.getElementById('modalBG').style.display = 'block'
  document.getElementById('settingsBox').style.display = 'flex'
  console.log('this will show settings')
}
function help() {
  console.log('this will open a window explaining the game')
}

function closeWindow(id) {
  document.getElementById(id).style.display = 'none'
  document.getElementById('modalBG').style.display = 'none'
}


document.addEventListener('keydown', (ev) => {
  console.log(ev.key, ev.code, ev.code[ev.code.length-1])
  if (ev.code == 'Backspace' || ev.code == 'Escape') {
    if (!guess) {
      return
    } else {
      let tile = document.getElementById(`g${guessNum}-${guess.length-1}f`)
      let tileb = document.getElementById(`g${guessNum}-${guess.length-1}b`)
      tile.innerHTML = ''
      tileb.innerHTML = ''
      guess = guess.slice(0, -1)
    };

  } else if (ev.key == 'Enter') {
    checkWord()

  } else if (ev.code.includes('Key') && ev.key.toUpperCase() == ev.code[3] && guess.length < 5) {
    let tile = document.getElementById(`g${guessNum}-${guess.length}f`)
    let tileb = document.getElementById(`g${guessNum}-${guess.length}b`)
    tile.innerHTML = ev.key.toUpperCase()
    tileb.innerHTML = ev.key.toUpperCase()
    guess += ev.key.toUpperCase()
  }
})

// getWord()
// getStats()

winDisplay.innerHTML = winWord;

const data = {
  labels: Object.keys(games),
  datasets: [{
    label: 'My First Dataset',
    data: Object.values(games),
    backgroundColor: [
      'rgba(255, 99, 132)'
    ],
    borderWidth: 1
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    indexAxis: 'y'
  },
};

var myChart = new Chart(
    document.getElementById('statGraph'),
    config
  );