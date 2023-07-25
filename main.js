/* eslint-disable no-tabs */
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
  ' Find the most recent incident involving these models.',
  ' Find out how many incidents exist in the company for these robot models.',
  ' Find out how many of these robots have been updated in the past one week. The column name here should be NumberOfUpdatedRobots',
  ' Find out which all employees have updated these robots recently.',
  ' Mark the most recently updated robots as "under repair" in the database and display the robot table.',
  ' Identify the employee who reported the highest number of incidents.',
  ' Create a view that joins the \'Incident\' and \'Robot\' table to see all incidents associated with each robot model.',
  ' Identify the source of the malfunctions by finding models of robots that have more than a certain number of incidents and removing the duplicate entries.',
  ' Create a new table that records the repair status of all robots.',
  ' Insert/update repair records for all MegaMech and TurboBot robots into the new table.',
  ' Find the last employee who updated the software of the malfunctioning robots.',
  ' Gather all evidence against the one who caused the corporate espionage.'
]
storyline.textContent = queries[0]

const hints = [
  [['Hint : For your first hint for the 1st problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: You can use the Select statement here.'], ['Hint 2: The structure of the query will look like SELECT _ FROM [TableName].']],
  [['Hint : For your first hint for the 2nd problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: You might want to look at the timestamp to find the most recent incident.'], ['Hint 2: Consider using the keyword LIMIT to get the most recent incident.']],
  [['Hint : For your first hint for the 3rd problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: Use a `JOIN` operation to join Robot and Incident Table.'], ['Hint 2: Use `GROUP BY` and `COUNT` operations to count the number of incidents.']],
  [['Hint : For your first hint for the 4th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: Use the lastUpdateOn column and specify dates to check the interval.'], ['Use `DISTINCT`operation to get unique robotIDs and then count accordingly.']],
  [['Hint : For your first hint for the 5th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: Use nested subqueries here.'], ['Hint 2: In the inner query get the employeeID of the employees who have updated those models from the Robot table.']],
  [['Hint : For your first hint for the 6th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: Use`UPDATE`and `SET`operations here.'], ['Hint 2: Do not forget to display the Robot table by using the same structure as in Query 1']],
  [['Hint : For your first hint for the 7th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1: You need to use`GROUP BY` and `ORDER BY` operations here '], ['Hint 2: Do not forget to put the LIMIT as 1 to get only the one employee with the highest number of incidents']],
  [['Hint : For your first hint for the 8th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 8'], ['Hint 2 for question 8']],
  [['Hint : For your first hint for the 9th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 9'], ['Hint 2 for question 9']],
  [['Hint : For your first hint for the 10th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 10'], ['Hint 2 for question 10']],
  [['Hint : For your first hint for the 11th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 11'], ['Hint 2 for question 11']],
  [['Hint : For your first hint for the 12th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 12'], ['Hint 2 for question 12']],
  [['Hint : For your first hint for the 12th problem, it\'s going to cost you 15 points. Click on the Hint button to use it'], ['Hint 1 for question 13'], ['Hint 2 for question 13']]
]
hintContainer.textContent = hints[0][0]
const answerKeys = [
  [
    [1, 'Robot malfunctioned during production', '2022-02-20 09:30:00', 'Jane Smith', 2],
    [2, 'Collision with another robot', '2022-03-15 13:45:00', 'Emily Davis', 4],
    [3, 'Software glitch caused erratic behavior', '2022-04-05 10:15:00', 'John Johnson', 1],
    [4, 'Power outage interrupted production process', '2022-05-10 14:20:00', 'Sarah Wilson', 3],
    [5, 'Component failure resulted in production delay', '2022-06-25 11:00:00', 'Michael Thompson', 2],
    [6, 'Robot arm malfunctioned, causing damage to equipment', '2022-07-12 16:30:00', 'Amy Anderson', 4],
    [7, 'Communication failure with central control system', '2022-08-18 09:45:00', 'Ryan Garcia', 1],
    [8, 'Sensor calibration error led to incorrect measurements', '2022-09-27 13:00:00', 'Emma Martinez', 3],
    [9, 'Overheating issue caused temporary shutdown', '2022-10-30 10:10:00', 'David Hernandez', 2],
    [10, 'Software update caused compatibility problems', '2022-11-22 15:20:00', 'Olivia Robinson', 4]
  ],
  [
    [10, 'Software update caused compatibility problems', '2022-11-22 15:20:00', 'Olivia Robinson', 4]
  ],

  [
    ['CyberHelper', 2],
    ['MegaMech', 3],
    ['RoboBot', 0],
    ['RoboBot 2000', 2],
    ['TurboBot', 3]
  ],

  [
    [4]
  ],
  [
    [2, 'karim', 'khoja'],
    [3, 'John', 'Doe'],
    [4, 'Jane', 'Smith'],
    [7, 'Laksh', 'Agarwal']
  ],

  [
    [1, 'RoboBot 2000', '2022-02-02 09:15:00', 'Active', '2022-03-05 15:30:00', '6'],
    [2, 'MegaMech', '2022-04-18 11:45:00', 'Under Repair', '2023-07-17 09:30:00', '3'],
    [3, 'CyberHelper', '2022-03-05 15:30:00', 'In Repair', '2022-04-18 11:45:00', '4'],
    [4, 'TurboBot', '2022-05-10 14:20:00', 'Under Repair', '2023-07-19 13:30:00', '2'],
    [5, 'MegaMech', '2022-02-02 09:15:00', 'Under Repair', '2023-07-20 11:30:00', '4'],
    [6, 'RoboBot', '2022-06-08 14:50:00', 'In Repair', '2022-09-08 12:40:00', '8'],
    [7, 'TurboBot', '2022-11-19 17:20:00', 'Under Repair', '2023-07-21 15:30:00', '7']
  ],

  [
    [4, 2]
  ],

  [
    [1,	'RoboBot 2000', 6, 7, 'Communication failure with central control system', '2022-08-18 09:45:00',	'Emily', 'Davis'],
    [1,	'RoboBot 2000', 6,	3,	'Software glitch caused erratic behavior',	'2022-04-05 10:15:00',	'Emily', 'Davis'],
    [2,	'MegaMech',	3,	5,	'Component failure resulted in production delay',	'2022-06-25 11:00:00',	'John', 'Doe'],
    [2,	'MegaMech',	3,	9,	'Overheating issue caused temporary shutdown',	'2022-10-30 10:10:00',	'John', 'Doe'],
    [2,	'MegaMech',	3,	1,	'Robot malfunctioned during production', '2022-02-20 09:30:00',	'John', 'Doe'],
    [3,	'CyberHelper', 4,	4,	'Power outage interrupted production process',	'2022-05-10 14:20:00',	'Jane', 'Smith'],
    [3,	'CyberHelper',	4,	8,	'Sensor calibration error led to incorrect measurements',	'2022-09-27 13:00:00',	'Jane', 'Smith'],
    [4,	'TurboBot',	2,	2,	'Collision with another robot',	'2022-03-15 13:45:00',	'karim', 'khoja'],
    [4,	'TurboBot', 2,	6,	'Robot arm malfunctioned, causing damage to equipment',	'2022-07-12 16:30:00',	'karim', 'khoja'],
    [4,	'TurboBot',	2,	10,	'Software update caused compatibility problems', '2022-11-22 15:20:00', 'karim', 'khoja'],
    [5,	'MegaMech', 4, '', '', '', 'Jane', 'Smith'],
    [6,	'RoboBot',	8, '', '', '', 'Ujjwal', 'Maken'],
    [7, 'TurboBot',	7, '', '', '', 'Laksh',	'Agarwal']
  ],

  [
    ['MegaMech'],
    ['TurboBot']
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
      console.log('hello')
    } else {
      displayResults(queryWrapper, results[0])
      if (validateResult(results[0].values, currentQueryIndex)) {
        flag = true
        console.log('hello2')
      } else {
        flag = false
        console.log('hello3')
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
  if (!answerKey || resultValues.length !== answerKey.length) {
    return false
  }

  for (let i = 0; i < resultValues.length; i++) {
    for (let j = 0; j < resultValues[i].length; j++) {
      const expectedValue = answerKey[i][j]
      const actualValue = resultValues[i][j]

      const parsedExpectedValue = isNaN(expectedValue) ? expectedValue : parseFloat(expectedValue)
      const parsedActualValue = isNaN(actualValue) ? actualValue : parseFloat(actualValue)

      if (parsedActualValue !== parsedExpectedValue) {
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
