let currentScene = 0
let interval
const scenes = Array.from(document.querySelectorAll('.scene'))
scenes[currentScene].classList.add('active')

const sceneText = [
  'The year is 2145. Cities shimmer with neon, and vast digital networks course through the veins of civilization. In this matrix-infused world, data is power, and power is everything. To embark on your journey, navigate with the left and right arrow keys.',
  'You are an enigma—a prodigious programmer, known in hushed tones as the "Cipher". RoboTech Global, a global behemoth, is ensnared in a web of digital deception. Their databases hint at internal betrayal, external espionage, or perhaps... an AI evolving beyond its confines. They\'ve sent for you, the only one with the skills to decode the chaos.',
  'Each database is a labyrinth, with secrets locked behind SQL challenges. Crack them, and your score soars. But be cautious: errors will deplete your score, and the deeper you go, the more intricate the queries become. While hints can light your way, they bear a cost. Use them wisely.',
  'Yet, in this digital expanse, you\'re not isolated. Trinity, an advanced AI ally, stands by your side. Gleaming at the screen\'s corner, she\'s your beacon amidst the data storms, offering clues and guidance. But heed this: leaning on Trinity too much might drain your score faster than you anticipate.',
  'The future of RoboTech Global, and perhaps the digital world at large, hinges on your prowess. Beyond each SQL challenge lies a fragment of the truth. Can you piece together the mystery, or will you be consumed by the endless streams of data? Dive in, Cipher, and let the digital hunt begin!'
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
  }, 45)
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

            setTimeout(() => {
              newFadeToBlackDiv.style.visibility = 'hidden'
            }, 2000)
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
