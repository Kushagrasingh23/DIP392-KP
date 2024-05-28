const ROWS = 6;
const COLS = 7;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPlayer = 'player1';
let gameOver = false;

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    createBoard(gameBoard);
    document.getElementById('status').innerText = `${currentPlayer}'s turn`;

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
                    gameOver = true;
                } else {
                    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
                    document.getElementById('status').innerText = `${currentPlayer}'s turn`;
                }
            }
        }
    });

    document.getElementById('restart-button').addEventListener('click', restartGame);
});

function createBoard(gameBoard) {
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
