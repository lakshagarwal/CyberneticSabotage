/* global initSqlJs */

const textarea = document.querySelector('#query-textarea')
const displayText = document.querySelector('.display-text')
const form = document.querySelector('#query-form')
const restartButton = document.getElementById('restart-button')
const storyline = document.getElementById('trinity_text')

let queryHistory = []
let currentQueryIndex = 0
let startTime = null
let score = 0
let flag = false
const queries = [
  ' Hey Neo! The first task is to list all incidents from the \'Incident\' table.',
  ' to find the most recent incident involving all models.',
  ' to find out how many incidents exist in the company for the robot models MegaMech and TurboBot .',
  ' to find how many exist'
  // Add more queries here
]
storyline.textContent = queries[0]
const answerKeys = [
//   // Define answer keys for each query in the same order as the queries array
//   // Each answer key should be an array of arrays representing the rows and columns of the expected table
//   // Example: [['column1', 'column2'], ['value1', 'value2']]
  [
    // ['incidentID', 'desc', 'timeStamp', 'reportedBy', 'robotID'],
    [1, 'Robot malfunctioned during production', '2022-02-20 09:30:00', 'Jane Smith', 2],
    [2, 'Collision with another robot', '2022-03-15 13:45:00', 'Emily Davis', 4]
  ],
  //   // Add more answer keys for each query
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
  updateTimer()
  updateScore()
  initializeDB()
  storyline.textContent = queries[0]
  currentQueryIndex = 0
}

function startGame () {
  startTime = Date.now()
  setInterval(updateTimer, 1000)
  initializeDB()
}

function getStory () {
  const nextQueryIndex = currentQueryIndex + 1
  if (flag === true && nextQueryIndex < queries.length) {
    const nextQuery = queries[nextQueryIndex]
    storyline.textContent = 'Correct! Now the next problem is: ' + nextQuery
    currentQueryIndex = nextQueryIndex
  } else {
    storyline.textContent = 'Oops! Please try again'
  }
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
  // flag = true
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
  console.log(resultValues.length)
  console.log(answerKey.length)
  console.log(resultValues[0][0])
  console.log(answerKey[0][0])
  console.log(resultValues[0][1])
  console.log(answerKey[0][1])
  console.log(resultValues[1])
  console.log(answerKey[1])
  // console.log(resultValues[1][1])
  // console.log(answerKey[1][1])
  if (!answerKey) {
    return false // No answer key found for the query
  }
  console.log('2nd one')
  // Check if the number of rows and columns match
  if (resultValues.length !== answerKey.length) {
    return false
  }
  console.log('3rd one')
  if (resultValues.length > 0 && resultValues[0].length !== answerKey[0].length) {
    return false
  }
  console.log('4th one')
  // Check each cell value against the answer key
  for (let i = 0; i < resultValues.length; i++) {
    for (let j = 0; j < resultValues[i].length; j++) {
      console.log('5th one')
      if (resultValues[i][j] !== answerKey[i][j]) {
        return false // Cell value does not match the answer key
      }
      console.log('6th one')
    }
  }
  console.log('7th  one')
  return true // All cell values match the answer key
}
function scrollToBottom () {
  const displayText = document.querySelector('.display-text')
  displayText.scrollTop = displayText.scrollHeight
}

startGame()
