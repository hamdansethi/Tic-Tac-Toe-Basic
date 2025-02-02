function GameBoard() {
    const rows = 3;
    const cols = 3;

    const board = Array.from({ length: rows }, () => Array(cols).fill(0));

    const getBoard = () => board;

    const mark = (i, j, symbol) => {
        if (i < 0 || i > 2 || j < 0 || j > 2) {
            console.log("Invalid Position, Enter a Valid Position to Mark");
        } else if (board[i][j] !== 0) {
            console.log("This position is already marked");
        } else {
            board[i][j] = symbol;
        }
    }

    const reset = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                board[i][j] = 0;
            }
        }
        console.log("Board has been reset");
    }

    const printBoard = () => {
        console.log("Current Board:");
        for (let i = 0; i < rows; i++) {
            console.log(board[i].join(" | "));
            if (i < rows - 1) {
                console.log("---------");
            }
        }
        console.log('\n');
    }

    return { printBoard, mark, reset, getBoard };
}

function Player(name, symbol) {
    return {
        name,
        symbol
    };
}

function GameLogic(p1, p2, board) {
    let currentPlayer = p1;
    const gameBoard = board.getBoard();

    const checkWinner = () => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i][0] !== 0 &&
                gameBoard[i][0] === gameBoard[i][1] &&
                gameBoard[i][1] === gameBoard[i][2]) {
                return gameBoard[i][0];
            }
        }

        // Check columns
        for (let j = 0; j < 3; j++) {
            if (gameBoard[0][j] !== 0 &&
                gameBoard[0][j] === gameBoard[1][j] &&
                gameBoard[1][j] === gameBoard[2][j]) {
                return gameBoard[0][j];
            }
        }

        // Check diagonals
        if (gameBoard[0][0] !== 0 &&
            gameBoard[0][0] === gameBoard[1][1] &&
            gameBoard[1][1] === gameBoard[2][2]) {
            return gameBoard[0][0];
        }

        if (gameBoard[0][2] !== 0 &&
            gameBoard[0][2] === gameBoard[1][1] &&
            gameBoard[1][1] === gameBoard[2][0]) {
            return gameBoard[0][2];
        }

        // Check for draw
        if (gameBoard.flat().every(cell => cell !== 0)) {
            return "Draw";
        }

        return null;
    }

    const getCurrentPlayer = () => currentPlayer;

    const changeTurn = () => {
        currentPlayer = (currentPlayer === p1) ? p2 : p1;
        console.log(`It's now ${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
    }

    const resetGame = () => {
        currentPlayer = p1; // Reset to Player 1
        board.reset();
    }

    return { getCurrentPlayer, changeTurn, checkWinner, resetGame };
}

function getValidInput(promptText) {
    let input = -1;
    while (isNaN(input) || input < 1 || input > 3) {
        input = parseInt(prompt(promptText));
        if (isNaN(input) || input < 1 || input > 3) {
            console.log("Invalid input. Please enter a number between 1 and 3.");
        }
    }
    return input - 1;
}

function startGame() {
    const board = GameBoard();
    const p1 = Player("Player 1", 'X');
    const p2 = Player("Player 2", 'O');
    const gameLogic = GameLogic(p1, p2, board);

    let gameOver = false;

    while (!gameOver) {
        console.log(`${gameLogic.getCurrentPlayer().name}'s turn (${gameLogic.getCurrentPlayer().symbol})`);
        board.printBoard();

        const row = getValidInput("Enter Row (1-3): ");
        const col = getValidInput("Enter Column (1-3): ");

        board.mark(row, col, gameLogic.getCurrentPlayer().symbol);

        const winner = gameLogic.checkWinner();
        if (winner) {
            board.printBoard();
            if (winner === "Draw") {
                console.log("It's a draw!");
            } else {
                console.log(`${winner} wins the game!`);
            }
            gameOver = true;
        } else {
            gameLogic.changeTurn();
        }
    }

    const playAgain = prompt("Do you want to play again? (yes/no)").toLowerCase();
    if (playAgain === "yes") {
        gameLogic.resetGame();
        startGame();
    } else {
        console.log("Thanks for playing!");
    }
}