//dom variables
const rulesButton = document.querySelector(".rules-button");
const closeButton = document.querySelector(".close-button");
const rulesContainer = document.querySelector(".rules");
const gameContainer = document.querySelector(".game");
const startButton = document.querySelector("#start");
const username = document.querySelector("#username");

const easyDOM = document.querySelector(".diff-container #easy");
const mediumDOM = document.querySelector(".diff-container #medium");
const hardDOM = document.querySelector(".diff-container #hard");

const canvas = document.querySelector("#canvas");

//dom event listeners
rulesButton.addEventListener("click", () => {
  rulesContainer.classList.toggle("show");
  rulesButton.classList.toggle("show");
  closeButton.classList.toggle("show");
});

closeButton.addEventListener("click", () => {
  rulesContainer.classList.toggle("show");
  rulesButton.classList.toggle("show");
  closeButton.classList.toggle("show");
});

//variables
let score = 0;
let lives = 5;
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 2,
  dx: 2,
  dy: -2,
};

const paddle = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 20,
  height: 10,
  speed: 6,
  dx: 0,
};

const bricks = [];

const brickInfo = {
  offsetX: 45,
  offsetY: 60,
  width: 70,
  height: 20,
  padding: 10,
  visible: true,
};

let brickRowCount = 9;
let brickColumnCount = 5;

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//functions
function gameDifficulty() {
  let easy = 150;
  let medium = 100;
  let hard = 60;

  if (easyDOM.checked) {
    paddle.width = easy;
  } else if (mediumDOM.checked) {
    paddle.width = medium;
  } else {
    paddle.width = hard;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#35155d";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "1.2rem Poppins";
  ctx.fillText(`${username.value} Score: ${score}`, canvas.width - 755, 40);
}

function drawLives() {
  ctx.font = "1.2rem Poppins";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 110, 40);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visible ? "#4477CE" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawBricks();
}

function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.width + 3 > canvas.width) {
    paddle.x = canvas.width - paddle.width - 3;
  }

  if (paddle.x < 3) {
    paddle.x = 3;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.width &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) =>
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.width &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.height
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    })
  );

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    lives--;
    if (lives < 0) {
      over();
    }
  }
}

function increaseScore() {
  score++;
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
    win();
  }
}

function showAllBricks() {
  bricks.forEach((column) =>
    column.forEach((brick) => {
      brick.visible = true;
      score = 0;
    })
  );
}

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function update() {
  gameDifficulty();
  draw();
  movePaddle();
  moveBall();
  requestAnimationFrame(update);
}

function start() {
  lives = 5;
  gameContainer.style.opacity = "0";
}

function over() {
  gameContainer.style.opacity = "1";
}

function win() {
  gameContainer.style.fontSize = "2rem";
  gameContainer.style.color = "#35155d";
  gameContainer.style.opacity = "1";
  gameContainer.innerHTML = `Congratulations ${username.value}!`;
}

//init
update();

//event listeners
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", () => (paddle.dx = 0));

startButton.addEventListener("click", start);
