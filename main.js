const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const timerDisplay = document.getElementById("timer");

canvas.width = 800;
canvas.height = 500;

// Oyuncu ve Top Ayarları
const paddleWidth = 10, paddleHeight = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5;
const paddleSpeed = 6;

// Zamanlayıcı Ayarları
let timer = 60; // 60 saniye
let gameStarted = false;

// Fare Hareketini Algılama
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
});

// Oyun Çizim Fonksiyonu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oyun Alanı Çiz
    ctx.fillStyle = "white";

    // Oyuncu Paddle
    ctx.fillRect(20, playerY, paddleWidth, paddleHeight);

    // AI Paddle
    ctx.fillRect(canvas.width - 30, aiY, paddleWidth, paddleHeight);

    // Top
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Zamanlayıcıyı Güncelle
    timerDisplay.textContent = timer;

    update();
}

// Oyun Mantığı
function update() {
    if (gameStarted) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Üst ve Alt Çarpışmalar
        if (ballY < 0 || ballY > canvas.height) {
            ballSpeedY *= -1;
        }

        // AI Paddle Hareketi
        if (aiY + paddleHeight / 2 < ballY) {
            aiY += paddleSpeed;
        } else {
            aiY -= paddleSpeed;
        }

        // Oyuncu Paddle Çarpışma
        if (ballX < 30 && ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX *= -1;
        }

        // AI Paddle Çarpışma
        if (ballX > canvas.width - 30 && ballY > aiY && ballY < aiY + paddleHeight) {
            ballSpeedX *= -1;
        }

        // Skor Sıfırlama
        if (ballX < 0 || ballX > canvas.width) {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
        }
    }
}

// Zamanlayıcıyı Güncelle
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
        } else {
            clearInterval(timerInterval);
            // Oyun bitince yapılacak işlemler
            alert("Oyun Bitti!");
            resetGame();
        }
    }, 1000);
}

// Oyun Döngüsü
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Oyunu Başlat
function startGame() {
    gameStarted = true;
    startTimer();
    gameLoop();
}

// Oyun Sıfırlama
function resetGame() {
    timer = 60; // Zamanlayıcıyı sıfırla
    playerY = canvas.height / 2 - paddleHeight / 2; // Oyuncu paddle'ını sıfırla
    aiY = canvas.height / 2 - paddleHeight / 2; // AI paddle'ını sıfırla
    ballX = canvas.width / 2; // Topu ortala
    ballY = canvas.height / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1); // Topun yönünü rastgele belirle
    ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    gameStarted = false; // Oyunu durdur
}

// Oyunu başlatmak için sayfa yüklendiğinde startGame fonksiyonunu çağır
window.onload = startGame;