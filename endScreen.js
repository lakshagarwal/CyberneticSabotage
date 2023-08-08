const startPageButton = document.getElementById('start-page')
const restartEndButton = document.getElementById('restart-gameover')
const headerText = document.getElementById('main-text')

startPageButton.addEventListener('click', goToMain)
restartEndButton.addEventListener('click', restart)

const searchParams = new URLSearchParams(window.location.search)
const gameStatus = searchParams.get('gameStatus')

if (gameStatus === 'win') {
  headerText.innerHTML = 'You won! Congratulations!!! \n\n Please select one of the following options:\n\n'
} else if (gameStatus === 'lose') {
  headerText.innerHTML = 'You lost!\nSorry, please try again!\n\n'
}

function goToMain () {
  location.assign('index.html')
}

function restart () {
  location.assign('mainGame.html')
}
