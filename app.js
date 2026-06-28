const game = new Chess();
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

let selectedSquare = null;

// Filled unicode pieces look best when styled with color property
const PIECE_UNICODE = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
};

function renderBoard() {
    boardElement.innerHTML = '';
    const board = game.board();
    
    // Get pseudo-legal moves for the selected square to highlight drop targets
    const moves = selectedSquare ? game.moves({ square: selectedSquare, verbose: true }) : [];
    const highlightSquares = moves.map(m => m.to);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const squareIndex = String.fromCharCode('a'.charCodeAt(0) + col) + (8 - row);
            const squareEl = document.createElement('div');
            squareEl.classList.add('square');
            squareEl.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            squareEl.dataset.square = squareIndex;

            if (selectedSquare === squareIndex) {
                squareEl.classList.add('selected');
            }
            if (highlightSquares.includes(squareIndex)) {
                squareEl.classList.add('highlight');
            }

            const piece = board[row][col];
            if (piece) {
                const pieceEl = document.createElement('div');
                pieceEl.classList.add('piece');
                pieceEl.classList.add(piece.color === 'w' ? 'piece-w' : 'piece-b');
                pieceEl.textContent = PIECE_UNICODE[piece.type];
                squareEl.appendChild(pieceEl);
            }

            squareEl.addEventListener('click', () => onSquareClick(squareIndex));
            boardElement.appendChild(squareEl);
        }
    }
    updateStatus();
}

function onSquareClick(square) {
    if (game.game_over()) return;

    if (selectedSquare) {
        // Attempt to move
        const move = game.move({
            from: selectedSquare,
            to: square,
            promotion: 'q' // Auto-promote to queen for simplicity
        });

        if (move) {
            // Valid move was made
            selectedSquare = null;
        } else {
            // Invalid move to an empty square or opponent's piece without capturing rules passing
            // If they clicked their own piece, select that instead
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                selectedSquare = square;
            } else {
                selectedSquare = null;
            }
        }
    } else {
        // No square selected yet, select if it's their piece
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
            selectedSquare = square;
        }
    }
    renderBoard();
}

function updateStatus() {
    let status = '';
    let moveColor = game.turn() === 'w' ? 'White' : 'Black';

    if (game.in_checkmate()) {
        status = `Game Over: ${moveColor} in checkmate`;
    } else if (game.in_draw()) {
        status = 'Game Drawn';
    } else {
        status = `${moveColor} to move`;
        if (game.in_check()) {
            status += ' (Check)';
        }
    }
    statusElement.textContent = status;
}

// Initial render
renderBoard();
