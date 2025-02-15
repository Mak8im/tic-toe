const board = document.getElementById("board");
const statusText = document.getElementById("player");
const resetButton = document.getElementById("reset");
const menu = document.getElementById("menu");
const gameSection = document.getElementById("game");
const playTwoButton = document.getElementById("playTwo");
const playAIButton = document.getElementById("playAI");

const xImage = "x.png"; // Картинка крестика
const oImage = "o.png"; // Картинка нолика

let cells = [];
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameMode = ""; // 'twoPlayers' или 'AI'

function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.addEventListener("click", handleMove);
        cells.push(cellDiv);
        board.appendChild(cellDiv);
    });
}

function handleMove(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] !== "" || checkWinner()) return;

    gameBoard[index] = currentPlayer;
    const img = document.createElement("img");
    img.src = currentPlayer === "X" ? xImage : oImage;
    event.target.appendChild(img);

    if (checkWinner()) {
        document.getElementById("status").innerText = `Победил: ${currentPlayer}`;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = currentPlayer;

    if (gameMode === "AI" && currentPlayer === "O") {
        setTimeout(botMove, 500); // Даем ощущение "обдумывания" хода
    }
}

function botMove() {
    let emptyCells = gameBoard
        .map((val, index) => (val === "" ? index : null))
        .filter(val => val !== null);

    if (emptyCells.length === 0 || checkWinner()) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[randomIndex] = "O";

    let cellDiv = board.children[randomIndex];
    const img = document.createElement("img");
    img.src = oImage;
    cellDiv.appendChild(img);

    if (checkWinner()) {
        document.getElementById("status").innerText = `Победил: O`;
        return;
    }

    currentPlayer = "X";
    statusText.innerText = currentPlayer;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

resetButton.addEventListener("click", () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    statusText.innerText = "X";
    createBoard();
});

playTwoButton.addEventListener("click", () => {
    gameMode = "twoPlayers";
    menu.style.display = "none";
    gameSection.style.display = "block";
    createBoard();
});

playAIButton.addEventListener("click", () => {
    gameMode = "AI";
    menu.style.display = "none";
    gameSection.style.display = "block";
    createBoard();
});

createBoard();
