const board = document.getElementById("board");
const statusText = document.getElementById("player");
const resetButton = document.getElementById("reset");
const backButton = document.getElementById("back");
const menu = document.getElementById("menu");
const gameSection = document.getElementById("game");
const playTwoButton = document.getElementById("playTwo");
const playAIButton = document.getElementById("playAI");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

const xImage = "x.png";
const oImage = "o.png";

let cells = [];
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameMode = "";

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
        handleWin(currentPlayer);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = currentPlayer;

    if (gameMode === "AI" && currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
}

function botMove() {
    let bestMove = minimax(gameBoard, "O").index;
    gameBoard[bestMove] = "O";

    let cellDiv = board.children[bestMove];
    const img = document.createElement("img");
    img.src = oImage;
    cellDiv.appendChild(img);

    if (checkWinner()) {
        handleWin("O");
        return;
    }

    currentPlayer = "X";
    statusText.innerText = currentPlayer;
}

function minimax(board, player) {
    let emptyCells = board
        .map((val, index) => (val === "" ? index : null))
        .filter(val => val !== null);

    if (checkWinner() === "X") return { score: -10 };
    if (checkWinner() === "O") return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];

    for (let index of emptyCells) {
        let move = {};
        move.index = index;
        board[index] = player;

        let result = minimax(board, player === "O" ? "X" : "O");
        move.score = result.score;
        board[index] = "";

        moves.push(move);
    }

    return moves.reduce((best, move) =>
        (player === "O" ? move.score > best.score : move.score < best.score)
            ? move
            : best
    );
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

function handleWin(player) {
    if (player === "X") {
        winSound.play();
        confetti.start();
    } else {
        document.body.classList.add("lose-animation");
        loseSound.play();
    }
}

resetButton.addEventListener("click", () => location.reload());
backButton.addEventListener("click", () => location.reload());
playTwoButton.addEventListener("click", () => (gameMode = "twoPlayers", startGame()));
playAIButton.addEventListener("click", () => (gameMode = "AI", startGame()));

function startGame() {
    menu.style.display = "none";
    gameSection.style.display = "block";
    createBoard();
}
