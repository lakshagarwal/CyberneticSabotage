const textarea = document.querySelector('#query-textarea')
const displayText = document.querySelector('.display-text')
const form = document.querySelector('#query-form')

const queryHistory = []

form.addEventListener('submit', function (event) {
  event.preventDefault()

  const query = textarea.value
  // executeQuery(query)
  queryHistory.push(query)

  displayText.innerHTML = ''
  queryHistory.forEach((query, index) => {
    displayText.innerHTML +=
      '<p>Query ' + (index + 1) + ': ' + query.replace(/\n/g, '<br>') + '</p>'
  })

  textarea.value = ''

  executeQuery(query)
})

function executeQuery(query) {
  initSqlJs().then(function (SQL) {
    fetch('database/main.db')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const db = new SQL.Database(new Uint8Array(buffer))
        const stmt = db.prepare(query)

        let results = ''
        while (stmt.step()) {
          const row = stmt.getAsObject()
          results += JSON.stringify(row) + '<br>'
        }

        displayText.innerHTML += '<p>Results:</p>' + results

        db.close()
      })
      .catch(error => {
        console.error('Error fetching the SQLite file:', error)
      })
  })
}
