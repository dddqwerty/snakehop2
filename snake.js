const readline = require("readline");
const chalk = require("chalk");

const row = (c) => (n) => c.repeat(n);
const col = (row) => (n) => (row + "\n").repeat(n);
const newLine = () => "\033c";
const rnd = (min) => (max) => Math.round(Math.random() * (max - min));

let gameState = {
    snakeHeadRow: 5,
    snakeHeadCol: 5,
    snakeBody: [
        [5, 6],
        [5, 7],
    ],
    snakeDirection: "left",
    appleRow: 6,
    appleCol: 9,
};

const newRandomApple = (gameState) => {
    gameState.appleRow = Math.floor(Math.random() * 14);
    gameState.appleCol = Math.floor(Math.random() * 29);
    return gameState;
};

const drawSnake = (board, gameState) => {
    return board.map((row, i) =>
        row.map((el, j) => {
            if (i == gameState.snakeHeadRow && j == gameState.snakeHeadCol) {
                return "H";
            }
            for (let k = 0; k < gameState.snakeBody.length; k++) {
                if (
                    i == gameState.snakeBody[k][0] &&
                    j == gameState.snakeBody[k][1]
                ) {
                    return "S";
                }
            }
            return el;
        })
    );
};

const drawApple = (board, gameState) => {
    return board.map((row, i) =>
        row.map((el, j) => {
            if (i == gameState.appleRow && j == gameState.appleCol) {
                return "A";
            }
            return el;
        })
    );
};

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    if (key.ctrl == true && key.name == "c") {
        process.exit();
    }
    gameState = changeSnakeDirection(gameState)(str);
});

const changeSnakeDirection = (gameState) => (key) => {
    if (key === "w" && gameState.snakeDirection !== "down") {
        gameState.snakeDirection = "up";
    }
    if (key === "s") {
        gameState.snakeDirection = "down";
    }
    if (key === "a") {
        gameState.snakeDirection = "left";
    }
    if (key === "d") {
        gameState.snakeDirection = "right";
    }
    return gameState;
};



const moveSnake = (gameState) => {
    if (gameState.snakeDirection == "left") {
        gameState.snakeBody.unshift([
            gameState.snakeHeadRow,
            gameState.snakeHeadCol,
        ]);
        if (
            gameState.snakeHeadCol === gameState.appleCol &&
            gameState.appleRow == gameState.snakeHeadRow
        ) {
            gameState = newRandomApple(gameState);
        } else {
            gameState.snakeBody.pop();
        }
        if (gameState.snakeHeadCol === 0) {
            gameState.snakeHeadCol = 29;
        } else {
            gameState.snakeHeadCol -= 1;
        }
    }
    if (gameState.snakeDirection == "right") {
        gameState.snakeBody.pop();
        gameState.snakeBody.unshift([
            gameState.snakeHeadRow,
            gameState.snakeHeadCol,
        ]);
        gameState.snakeHeadCol += 1;
    }
    if (gameState.snakeDirection == "up") {
        gameState.snakeBody.pop();
        gameState.snakeBody.unshift([
            gameState.snakeHeadRow,
            gameState.snakeHeadCol,
        ]);
        gameState.snakeHeadRow -= 1;
    }
    if (gameState.snakeDirection == "down") {
        gameState.snakeBody.pop();
        gameState.snakeBody.unshift([
            gameState.snakeHeadRow,
            gameState.snakeHeadCol,
        ]);
        gameState.snakeHeadRow += 1;
    }

    return gameState;
};

setInterval(() => {
    // COLOR
    const r = rnd(0)(255);
    const g = rnd(0)(255);
    const b = rnd(0)(255);

    //     // SNAKE TEXT
    let header = newLine();
    header += chalk.rgb(r, g, b)(row(" ")(12) + "SNAKE" + row(" ")(12));
    console.log(header);

    let board = col(row(".")(30))(15);

    let newboard = board.split("\n").map((el) => el.split(""));

    let boardWithSnake = drawSnake(newboard, gameState);
    let boardWithSnakeAndApple = drawApple(boardWithSnake, gameState);
    gameState = moveSnake(gameState);
    console.log(
        chalk.green(
            boardWithSnakeAndApple.map((row) => row.join("")).join("\n")
        )
    );
}, 60);
