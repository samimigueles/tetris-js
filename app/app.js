document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let square = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'green',
    'purple',
    'blue'
  ]

  //The tetrominoes o las formas del juego. Están hechas de arrays de arrays (multidimensionales). Se puede pensar como celdas de hoja de cálculo que se pintan según la posición especificada en los div del html
  const lTetromino = [
    [1, 1 + width, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ]
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  let random = Math.floor(Math.random() * theTetrominos.length)
  let current = theTetrominos[random][currentRotation]

  //dibujando las formas
  function draw() {
    current.forEach(index => {
      square[currentPosition + index].classList.add('tetromino')
      square[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //desdibujando las formas
  function undraw() {
    current.forEach(index => {
      square[currentPosition + index].classList.remove('tetromino')
      square[currentPosition + index].style.backgroundColor = ''
    })
  }

  //hacer que las figuras bajen en un lapso de tiempo, inv0cando la funcion
  //timerId = setInterval(moveDown, 1000)

  //asignar teclas
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //funcion de movimiento
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //funcion de detener las figuras al final del recorrido
  function freeze() {
    if (current.some(index => square[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => square[currentPosition + index].classList.add('taken'))
      //hacer que una nueva figura caiga
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominos.length)
      current = theTetrominos[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //mover a la izquierda, salvo cuando esta en el borde del grid o hay otra figura
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => square[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  //mover a la derecha, salvo cuando esta en el borde del grid o hay otra figura
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => square[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  //rotar figuras
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominos[random][currentRotation]
    draw()
  }

  //mostrar la siguiente figura
  const displaySquare = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  //figuras sin rotación
  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],//forma L
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],//forma z
    [1, displayWidth, displayWidth + 1, displayWidth + 2],//forma t
    [0, 1, displayWidth, displayWidth + 1],// forma o
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //forma i
  ]

  //mostrar figuras en el mini-grid
  function displayShape() {
    displaySquare.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominos[nextRandom].forEach(index => {
      displaySquare[displayIndex + index].classList.add('tetromino')
      displaySquare[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //función para el boton de start/Pause
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominos.length)
      displayShape()
    }
  })


  //medidor de puntuje
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => square[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          square[index].classList.remove('taken')
          square[index].classList.remove('tetromino')
          square[index].style.backgroundColor = ''
        })
        const squareRemove = square.splice(i, width)
        square = squareRemove.concat(square)
        square.forEach(cells => grid.appendChild(cells))
      }
    }
  }


  //game over
  function gameOver() {
    if (current.some(index => square[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

})
