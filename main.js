const textarea = document.querySelector('#query-textarea')
const displayText = document.querySelector('.display-text')
const form = document.querySelector('#query-form')
const restartButton = document.getElementById('restart-button')

let queryHistory = []
let startTime = null
let score = 0

function restartGame () {
  queryHistory = []
  displayText.innerHTML = ''
  startTime = Date.now()
  score = 0
  updateTimer()
  updateScore()
}

function startGame () {
  startTime = Date.now()
  setInterval(updateTimer, 1000)
}

function updateTimer () {
  const now = Date.now()
  const timeElapsed = Math.round((now - startTime) / 1000)
  document.getElementById('timer').textContent = 'Time: ' + timeElapsed + 's'
}

function updateScore () {
  document.getElementById('score').textContent = 'Score: ' + score
}

restartButton.addEventListener('click', restartGame)

form.addEventListener('submit', function (event) {
  event.preventDefault()

  const query = textarea.value
  queryHistory.push(query)

  score += 5
  updateScore()

  displayText.innerHTML = ''
  queryHistory.forEach((query, index) => {
    displayText.innerHTML +=
      '<p>Query ' + (index + 1) + ': ' + query.replace(/\n/g, '<br>') + '</p>'
  })

  textarea.value = ''

  // Send the query to the SQL parser here
})

startGame()
