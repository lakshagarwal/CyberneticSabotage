/* global initSqlJs */

const textarea = document.querySelector('#query-textarea')
const displayText = document.querySelector('.display-text')
const form = document.querySelector('#query-form')
const restartButton = document.getElementById('restart-button')

let queryHistory = []
let startTime = null
let score = 0

let db

function restartGame () {
  queryHistory = []
  displayText.innerHTML = ''
  startTime = Date.now()
  score = 0
  updateTimer()
  updateScore()
  initializeDB()
}

function startGame () {
  startTime = Date.now()
  setInterval(updateTimer, 1000)
  initializeDB()
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
    } else {
      displayResults(queryWrapper, results[0])
    }
  } catch (error) {
    const errorMessage = 'ERROR: ' + error.message
    displayError(queryWrapper, errorMessage)
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

function scrollToBottom () {
  const displayText = document.querySelector('.display-text')
  displayText.scrollTop = displayText.scrollHeight
}

startGame()
