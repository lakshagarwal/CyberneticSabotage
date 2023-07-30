let currentScene = 0
let interval
const scenes = Array.from(document.querySelectorAll('.scene'))
scenes[currentScene].classList.add('active')

const sceneText = [
  'You are a gifted programmer in a world corrupted by a Matrix-like system... Use the left and right arrow keys to navigate this world.',
  'Your SQL skills will be used as your main weapon...',
  'Each level of the game is a new challenge...',
  ''
]

function typeText (sceneIndex) {
  const text = sceneText[sceneIndex]
  const p = scenes[sceneIndex].querySelector('p')
  if (!p) return
  p.textContent = ''
  let i = 0
  interval = setInterval(() => {
    if (i < text.length) {
      p.textContent += text[i]
      i++
    } else {
      clearInterval(interval)
      if (sceneIndex === scenes.length - 1) {
        document.getElementById('begin-button').disabled = false
      }
    }
  }, 75)
}

document.getElementById('begin-button').addEventListener('click', beginGame)

function nextScene () {
  if (currentScene === scenes.length - 1) return
  clearInterval(interval)
  scenes[currentScene].classList.remove('active')
  currentScene = (currentScene + 1) % scenes.length
  scenes[currentScene].classList.add('active')
  typeText(currentScene)
}

function previousScene () {
  if (currentScene === 0) return
  clearInterval(interval)
  scenes[currentScene].classList.remove('active')
  currentScene = (currentScene - 1 + scenes.length) % scenes.length
  scenes[currentScene].classList.add('active')
  typeText(currentScene)
}

window.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') nextScene()
  if (event.key === 'ArrowLeft') previousScene()
})

function beginGame () {
  if (currentScene !== scenes.length - 1) return
  const fadeToBlackDiv = document.getElementById('fade-to-black')
  fadeToBlackDiv.style.visibility = 'visible'
  fadeToBlackDiv.style.opacity = 1

  setTimeout(() => {
    fetch('mainGame.html')
      .then(response => response.text())
      .then(data => {
        document.body.innerHTML = data

        const SQLscript = document.createElement('script')
        SQLscript.src = 'sql-wasm.js'
        document.body.appendChild(SQLscript)
        SQLscript.onload = () => {
          const script = document.createElement('script')
          script.src = 'main.js'
          document.body.appendChild(script)
          script.onload = () => {
            const newFadeToBlackDiv = document.createElement('div')
            newFadeToBlackDiv.id = 'fade-to-black'
            newFadeToBlackDiv.style.position = 'fixed'
            newFadeToBlackDiv.style.top = '0'
            newFadeToBlackDiv.style.left = '0'
            newFadeToBlackDiv.style.width = '100%'
            newFadeToBlackDiv.style.height = '100%'
            newFadeToBlackDiv.style.backgroundColor = 'black'
            newFadeToBlackDiv.style.transition = 'opacity 1s'
            newFadeToBlackDiv.style.visibility = 'visible'
            newFadeToBlackDiv.style.opacity = '1'
            document.body.appendChild(newFadeToBlackDiv)

            setTimeout(() => {
              newFadeToBlackDiv.style.opacity = '0'
            }, 1000)
          }
        }
      })
      .catch(error => console.error('Error:', error))
  }, 1000)
}

const canvasStory = document.querySelector('canvas')
const ctxStory = canvasStory.getContext('2d')

canvasStory.height = window.innerHeight
canvasStory.width = window.innerWidth

let lettersStory = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@$%&'
lettersStory = lettersStory.split('')

const fontSizeStory = 11
const columnsStory = canvasStory.width / fontSizeStory

const dropsStory = []
for (let i = 0; i < columnsStory; i++) {
  dropsStory[i] = Math.random() * canvasStory.height / fontSizeStory
}

function drawStory () {
  ctxStory.fillStyle = 'rgba(0, 0, 0, .1)'
  ctxStory.fillRect(0, 0, canvasStory.width, canvasStory.height)
  ctxStory.fillStyle = 'rgba(0, 255, 0, 0.35)'
  ctxStory.font = fontSizeStory + 'px arial'
  for (let i = 0; i < dropsStory.length; i++) {
    const text = lettersStory[Math.floor(Math.random() * lettersStory.length)]
    ctxStory.fillText(text, i * fontSizeStory, dropsStory[i] * fontSizeStory)
    if (dropsStory[i] * fontSizeStory > canvasStory.height && Math.random() > 0.975) dropsStory[i] = 0
    dropsStory[i] += 0.7
  }
}

setInterval(drawStory, 33)
typeText(currentScene)
