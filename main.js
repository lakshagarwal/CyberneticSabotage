/* global initSqlJs */
const textarea = document.querySelector('#query-textarea')
const displayText = document.querySelector('.display-text')
const form = document.querySelector('#query-form')
const restartButton = document.getElementById('restart-button')
const storyline = document.getElementById('trinity-text')
const hintButton = document.getElementById('hint-button')
const hintContainer = document.getElementById('hint-text')
const progressBar = document.getElementById('progress-bar')
const progressText = document.getElementById('progress-text')

let queryHistory = []
let currentQueryIndex = 0
let startTime = null
let score = 0
let progress = 10
let flag = false
let hintCounter = 1

const queries = [
  ' Hey Detective! The first task is to list all incidents from the \'Incident\' table.',
  ' Find the most recent incident involving all models.',
  ' Find out how many incidents exist in the company for the robot models MegaMech and TurboBot .',
  ' Find out how many of these robots have been updated in the past one week'
]
storyline.textContent = queries[0]

const hints = [
  [['Hint : For your first hint for the 1st problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 1'], ['Hint 2 for question 1']],
  [['Hint : For your first hint for the 2nd problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 2'], ['Hint 2 for question 2']],
  [['Hint : For your first hint for the 3rd problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 3'], ['Hint 2 for question 3']],
  [['Hint : For your first hint for the 4th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 4'], ['Hint 2 for question 4']]
]
hintContainer.textContent = hints[0][0]
const answerKeys = [
  [
    [1, 'Robot malfunctioned during production', '2022-02-20 09:30:00', 'Jane Smith', 2],
    [2, 'Collision with another robot', '2022-03-15 13:45:00', 'Emily Davis', 4]
  ],
  [
    [2, 'Collision with another robot', '2022-03-15 13:45:00', 'Emily Davis', 4]
  ],

  [
    ['MegaMech', 1],
    ['TurboBot', 1]
  ]
]
let db

function restartGame () {
  queryHistory = []
  displayText.innerHTML = ''
  startTime = Date.now()
  score = 0
  progress = 10
  updateTimer()
  updateScore(0)
  updateProgressBar(0)
  initializeDB()
  storyline.textContent = queries[0]
  currentQueryIndex = 0
  hintCounter = 1
  hintContainer.textContent = hints[0][0]
}

function startGame () {
  startTime = Date.now()
  score = 0
  progress = 10
  setInterval(updateTimer, 1000)
  initializeDB()
  updateProgressBar(0)
}

function getStory () {
  const nextQueryIndex = currentQueryIndex + 1
  if (flag === true && nextQueryIndex < queries.length) {
    const nextQuery = queries[nextQueryIndex]
    storyline.textContent = 'Excellent! Next, ' + nextQuery
    currentQueryIndex = nextQueryIndex
    hintCounter = 1
    hintContainer.textContent = hints[currentQueryIndex][0]
    updateScore(10)
    updateProgressBar(8)
  } else {
    const currentQuery = queries[currentQueryIndex]
    storyline.textContent = 'Oops! Please try again.' + currentQuery
    updateScore(-10)
  }
}

function updateTimer () {
  const now = Date.now()
  const timeElapsed = Math.round((now - startTime) / 1000)
  document.getElementById('timer').textContent = 'Time: ' + timeElapsed + 's'
}

function updateScore (change) {
  score = score + change
  document.getElementById('score').textContent = 'Score: ' + score
}

function updateProgressBar (change) {
  progress = Math.min(progress + change, 100)
  progress = progress + change
  progressBar.style.width = progress + '%'
  progressText.innerText = progress + '%'
}

restartButton.addEventListener('click', restartGame)

form.addEventListener('submit', function (event) {
  event.preventDefault()

  const query = textarea.value
  queryHistory.push(query)

  const queryWrapper = document.createElement('div')

  const queryParagraph = document.createElement('p')
  queryParagraph.textContent = 'Query ' + (queryHistory.length) + ': ' + query
  queryWrapper.appendChild(queryParagraph)

  textarea.value = ''
  scrollToBottom()

  executeQuery(query, queryHistory.length - 1, queryWrapper)
  getStory()
  displayText.appendChild(queryWrapper)
  scrollToBottom()
})

hintButton.addEventListener('click', getHint)
function getHint () {
  const hintIndex = currentQueryIndex
  const hintArray = hints[hintIndex]
  const subArrayLength = hintArray.length

  if (hintCounter < subArrayLength) {
    const hint = hintArray[hintCounter]
    hintContainer.textContent = hint
    hintCounter = hintCounter + 1
  } else {
    hintContainer.textContent = 'No more hints available.'
  }
}

function displayResults (queryWrapper, result) {
  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.width = '100%'
  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')
  let headers = null
  result.values.forEach((row, rowIndex) => {
    if (!headers) {
      headers = result.columns
      const headerRow = document.createElement('tr')
      headers.forEach(header => {
        const th = document.createElement('th')
        th.textContent = header
        th.style.border = '1px solid'
        th.style.padding = '8px'
        headerRow.appendChild(th)
      })
      thead.appendChild(headerRow)
    }
    const dataRow = document.createElement('tr')
    headers.forEach(header => {
      const td = document.createElement('td')
      td.textContent = result.values[rowIndex][headers.indexOf(header)]
      td.style.border = '1px solid'
      td.style.padding = '8px'
      dataRow.appendChild(td)
    })
    tbody.appendChild(dataRow)
  })
  table.appendChild(thead)
  table.appendChild(tbody)
  queryWrapper.appendChild(table)
}

function displayMessage (queryWrapper, message) {
  const p = document.createElement('p')
  p.textContent = message
  queryWrapper.appendChild(p)
}

function initializeDB () {
  initSqlJs().then(function (SQL) {
    fetch('database/main.db')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        db = new SQL.Database(new Uint8Array(buffer))
      }
      )
  }
  )
}

function executeQuery (query, index, queryWrapper) {
  try {
    const results = db.exec(query)
    if (results.length === 0) {
      displayMessage(queryWrapper, 'Command executed successfully.')
      flag = false
    } else {
      displayResults(queryWrapper, results[0])
      if (validateResult(results[0].values, currentQueryIndex)) {
        flag = true
      } else {
        flag = false
      }
    }
  } catch (error) {
    const errorMessage = 'ERROR: ' + error.message
    displayError(queryWrapper, errorMessage)
    flag = false
  }
  scrollToBottom()
}

function displayError (queryWrapper, message) {
  const errorElement = document.createElement('p')
  errorElement.textContent = message
  errorElement.style.color = 'red'
  queryWrapper.appendChild(errorElement)
  scrollToBottom()
}

function validateResult (resultValues, queryIndex) {
  const answerKey = answerKeys[queryIndex]
  if (!answerKey) {
    return false
  }
  if (resultValues.length !== answerKey.length) {
    return false
  }
  if (resultValues.length > 0 && resultValues[0].length !== answerKey[0].length) {
    return false
  }
  for (let i = 0; i < resultValues.length; i++) {
    for (let j = 0; j < resultValues[i].length; j++) {
      console.log('5th one')
      if (resultValues[i][j] !== answerKey[i][j]) {
        return false
      }
    }
  }
  return true
}
function scrollToBottom () {
  const displayText = document.querySelector('.display-text')
  displayText.scrollTop = displayText.scrollHeight
}

startGame()
