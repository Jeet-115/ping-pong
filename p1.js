//selecting the canvas
let canvas = document.getElementById("table");
let ctx = canvas.getContext('2d');

// draw_.fillStyle = "black";
// draw_.fillRect(0,0,can.width,can.height)

// draw_.fillStyle = "red";
// draw_.fillRect(100,100,30,30);

// draw_.fillStyle = "orange";
// draw_.beginPath();
// draw_.arc(200,200,10,0,Math.PI*2,false);
// draw_.closePath();
// draw_.fill(); 

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velX: 5,
    velY: 5,
    speed: 5,
    color: "green"
}
const user = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "red"
}
const cpu = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "red"
}
const sep = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "orange"
}

function drawRectangle(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}
function drawScore(text, x, y) {
    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.fillText(text, x, y);
}
function drawSeparator() {
    for (let i = 0; i < canvas.height; i += 20) {
        drawRectangle(sep.x, sep.y + i, sep.width, sep.height, sep.color);
    }
}
function restart() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velX = -ball.velX;
    ball.speed = 5;
}
function detect_collision(ball, player) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
}

canvas.addEventListener("mousemove", getMousePos);
function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

function cpu_movement() {
    if (cpu.y < ball.y)
        cpu.y += 5;
    else
        cpu.y -= 5;
}

function updates() {
    if (ball.x - ball.radius < 0) {
        cpu.score++;
        restart();
    }
    else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        restart();
    }

    ball.x += ball.velX;
    ball.y += ball.velY;

    cpu_movement();

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velY = -ball.velY;
    }

    let player = (ball.x < canvas.width / 2) ? user : cpu;

    if (detect_collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velX = direction * ball.speed * Math.cos(angleRad);
        ball.velY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }
}

function helper() {
    drawRectangle(0, 0, canvas.width, canvas.height, "black");
    drawScore(user.score, canvas.width / 4, canvas.height / 5);
    drawScore(cpu.score, 3 * canvas.width / 4, canvas.height / 5);
    drawSeparator();
    drawRectangle(user.x, user.y, user.width, user.height, user.color);
    drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function call_back() {
    helper();
    updates();
}

let fps = 50;
let looper = setInterval(call_back, 1000 / fps);