const textarea = document.querySelector("#query-textarea");
const displayText = document.querySelector(".display-text");
const form = document.querySelector("#query-form");

let queryHistory = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let query = textarea.value;
  queryHistory.push(query);

  displayText.innerHTML = "";
  queryHistory.forEach((query, index) => {
    displayText.innerHTML += `<p>Query ${index + 1}: ${query.replace(
      /\n/g,
      "<br>"
    )}</p>`;
  });

  textarea.value = "";

  // Send the query to the SQL parser here
});
