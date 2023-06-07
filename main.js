const textarea = document.querySelector('#query-textarea')
const displayText = document.querySelector('.display-text')
const form = document.querySelector('#query-form')

const queryHistory = []

form.addEventListener('submit', function (event) {
  event.preventDefault()

  const query = textarea.value
  queryHistory.push(query)

  displayText.innerHTML = ''
  queryHistory.forEach((query, index) => {
    displayText.innerHTML +=
      '<p>Query ' + (index + 1) + ': ' + query.replace(/\n/g, '<br>') + '</p>'
  })

  textarea.value = ''

  // Send the query to the SQL parser here
})
