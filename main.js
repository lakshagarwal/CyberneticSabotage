/* global initSqlJs */

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

  executeQuery(query, queryHistory.length - 1)
})

function executeQuery (query, index) {
  initSqlJs().then(function (SQL) {
    fetch('database/main.db')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const db = new SQL.Database(new Uint8Array(buffer))
        const stmt = db.prepare(query)

        const table = document.createElement('table')
        table.style.borderCollapse = 'collapse'
        table.style.width = '100%'

        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')

        let headers = null
        while (stmt.step()) {
          const row = stmt.getAsObject()

          if (!headers) {
            headers = Object.keys(row)
            const headerRow = document.createElement('tr')
            headers.forEach(header => {
              const th = document.createElement('th')
              th.textContent = header
              th.style.border = '1px solid '
              th.style.padding = '8px'
              headerRow.appendChild(th)
            })
            thead.appendChild(headerRow)
          }

          const dataRow = document.createElement('tr')
          headers.forEach(header => {
            const td = document.createElement('td')
            td.textContent = row[header]
            td.style.border = '1px solid'
            td.style.padding = '8px'
            dataRow.appendChild(td)
          })
          tbody.appendChild(dataRow)
        }

        table.appendChild(thead)
        table.appendChild(tbody)

        const resultsElement = document.createElement('div')
        resultsElement.appendChild(table)

        const queryElement = displayText.querySelectorAll('p')[index]
        queryElement.insertAdjacentElement('afterend', resultsElement)

        db.close()
      })
      .catch(error => {
        console.error('Error fetching the SQLite file:', error)
      })
  })
}

startGame()
