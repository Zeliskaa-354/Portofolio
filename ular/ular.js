var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var scoreElement = document.getElementById('score');
var livesElement = document.getElementById('lives');
var restartButton = document.getElementById('restart-button');

var grid = 20;
var count = 0;
var score = 0;
var lives = 3;

var snake = {
  x: 100,
  y: 100,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = {
  x: 300,
  y: 300
};

var rocks = Array.from({ length: 5 }, () => ({
  x: getRandomInt(0, canvas.width / grid) * grid,
  y: getRandomInt(0, canvas.height / grid) * grid,
  size: grid
}));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNewApplePosition() {
  let newX, newY;
  do {
    newX = getRandomInt(0, canvas.width / grid);
    newY = getRandomInt(0, canvas.height / grid);
  } while (!isPositionClear(newX * grid, newY * grid));
  return { x: newX * grid, y: newY * grid };
}

function isPositionClear(x, y) {
  return !rocks.some(rock => x === rock.x && y === rock.y) &&
         !snake.cells.some(cell => cell.x === x && cell.y === y);
}

function loop() {
  requestAnimationFrame(loop);

  if (++count < 7) return;

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;

  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) snake.cells.pop();

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  context.fillStyle = 'gray';
  rocks.forEach(rock => {
    context.fillRect(rock.x, rock.y, rock.size - 1, rock.size - 1);
  });

  context.fillStyle = 'green';
  snake.cells.forEach((cell, index) => {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      scoreElement.textContent = score;

      const newApple = getNewApplePosition();
      apple.x = newApple.x;
      apple.y = newApple.y;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }

    rocks.forEach(rock => {
      if (
        cell.x < rock.x + rock.size &&
        cell.x + grid > rock.x &&
        cell.y < rock.y + rock.size &&
        cell.y + grid > rock.y
      ) {
        loseLife();
      }
    });
  });
}

function loseLife() {
  lives--;
  livesElement.textContent = lives;

  if (lives === 0) {
    alert('Game Over! Final Score: ' + score);
    resetGame();
  } else {
    resetSnake();
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  scoreElement.textContent = score;
  livesElement.textContent = lives;
  resetSnake();
}

function resetSnake() {
  snake.x = 100;
  snake.y = 100;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;

  const newApple = getNewApplePosition();
  apple.x = newApple.x;
  apple.y = newApple.y;
}

restartButton.addEventListener('click', resetGame);

document.addEventListener('keydown', function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);
