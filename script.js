const ROWS = 6;
const COLS = 7;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPlayer = 'player1';
let gameOver = false;
let isSinglePlayer = false;

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    createBoard(gameBoard);

    document.getElementById('two-player-button').addEventListener('click', () => {
        isSinglePlayer = false;
        restartGame();
    });

    document.getElementById('single-player-button').addEventListener('click', () => {
        isSinglePlayer = true;
        restartGame();
    });

    document.getElementById('player1-color').addEventListener('input', updateColors);
    document.getElementById('player2-color').addEventListener('input', updateColors);

    gameBoard.addEventListener('click', (event) => {
        if (gameOver) return;
        const cell = event.target;
        if (!cell.classList.contains('cell')) return;
        const colIndex = Array.from(cell.parentNode.children).indexOf(cell) % COLS;
        if (colIndex !== -1) {
            const rowIndex = dropDisc(colIndex);
            if (rowIndex !== -1) {
                const selectedCell = gameBoard.children[rowIndex * COLS + colIndex];
                selectedCell.classList.add(currentPlayer);
                if (checkWin(rowIndex, colIndex)) {
                    showModal(`${currentPlayer} wins!`);
                    highlightWinningLine(rowIndex, colIndex);
                    gameOver = true;
                } else if (isBoardFull()) {
                    showModal("It's a draw!");
                    gameOver = true;
                } else {
                    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
                    document.getElementById('status').innerText = `${currentPlayer}'s turn`;
                    if (isSinglePlayer && currentPlayer === 'player2') {
                        aiMove();
                    }
                }
            }
        }
    });

    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('instructions-button').addEventListener('click', () => {
        document.getElementById('instructions').style.display = 'block';
    });
    document.getElementById('close-instructions').addEventListener('click', () => {
        document.getElementById('instructions').style.display = 'none';
    });
});

function createBoard(gameBoard) {
    gameBoard.innerHTML = '';
    for (let i = 0; i < ROWS * COLS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
}

function dropDisc(colIndex) {
    for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
        if (board[rowIndex][colIndex] === null) {
            board[rowIndex][colIndex] = currentPlayer;
            return rowIndex;
        }
    }
    return -1;
}

function checkWin(row, col) {
    return checkDirection(row, col, 0, 1) ||
           checkDirection(row, col, 1, 0) ||
           checkDirection(row, col, 1, 1) ||
           checkDirection(row, col, 1, -1);
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

function showModal(message) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.querySelector('p').innerText = message;
    modal.style.display = 'flex';
}

function restartGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = 'player1';
    gameOver = false;
    document.getElementById('status').innerText = `${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => cell.className = 'cell');
    document.getElementById('modal').style.display = 'none';
}

function highlightWinningLine(row, col) {
    const directions = [
        { rowDir: 0, colDir: 1 },
        { rowDir: 1, colDir: 0 },
        { rowDir: 1, colDir: 1 },
        { rowDir: 1, colDir: -1 }
    ];
    for (const { rowDir, colDir } of directions) {
        let count = 0;
        let cells = [];
        for (let i = -3; i <= 3; i++) {
            const r = row + i * rowDir;
            const c = col + i * colDir;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
                count++;
                cells.push(document.querySelector(`#game-board`).children[r * COLS + c]);
                if (count === 4) {
                    cells.forEach(cell => cell.classList.add('winning-cell'));
                    return;
                }
            } else {
                count = 0;
                cells = [];
            }
        }
    }
}

function aiMove() {
    let colIndex = Math.floor(Math.random() * COLS);
    while (board[0][colIndex] !== null) {
        colIndex = Math.floor(Math.random() * COLS);
    }
    setTimeout(() => {
        const rowIndex = dropDisc(colIndex);
        const selectedCell = document.getElementById('game-board').children[rowIndex * COLS + colIndex];
        selectedCell.classList.add(currentPlayer);
        if (checkWin(rowIndex, colIndex)) {
            showModal(`${currentPlayer} wins!`);
            highlightWinningLine(rowIndex, colIndex);
            gameOver = true;
        } else if (isBoardFull()) {
            showModal("It's a draw!");
            gameOver = true;
        } else {
            currentPlayer = 'player1';
            document.getElementById('status').innerText = `${currentPlayer}'s turn`;
        }
    }, 500);
}

function updateColors() {
    const player1Color = document.getElementById('player1-color').value;
    const player2Color = document.getElementById('player2-color').value;
    const style = document.createElement('style');
    style.innerHTML = `
        .cell.player1 { background-color: ${player1Color}; }
        .cell.player2 { background-color: ${player2Color}; }
    `;
    document.head.appendChild(style);
}
