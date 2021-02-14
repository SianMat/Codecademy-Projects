// All code should be written in this file.
let playerOneMoveOneType;
let playerOneMoveOneValue;
let playerOneMoveTwoType;
let playerOneMoveTwoValue;
let playerOneMoveThreeType;
let playerOneMoveThreeValue;
let playerTwoMoveOneType;
let playerTwoMoveOneValue;
let playerTwoMoveTwoType;
let playerTwoMoveTwoValue;
let playerTwoMoveThreeType;
let playerTwoMoveThreeValue;
const types = ["rock", "paper", "scissors"];

function setPlayerMoves(
  player,
  moveOneType,
  moveOneValue,
  moveTwoType,
  moveTwoValue,
  moveThreeType,
  moveThreeValue
) {
  if (
    !types.includes(moveOneType) ||
    !types.includes(moveTwoType) ||
    !types.includes(moveThreeType) ||
    !moveOneValue ||
    !moveTwoValue ||
    !moveThreeValue ||
    moveOneValue < 1 ||
    moveOneValue > 99 ||
    moveTwoValue < 1 ||
    moveTwoValue > 99 ||
    moveThreeValue < 1 ||
    moveThreeValue > 99 ||
    moveOneValue + moveTwoValue + moveThreeValue > 99
  ) {
    return;
  }

  if (player === "Player One") {
    playerOneMoveOneType = moveOneType;
    playerOneMoveOneValue = moveOneValue;
    playerOneMoveTwoType = moveTwoType;
    playerOneMoveTwoValue = moveTwoValue;
    playerOneMoveThreeType = moveThreeType;
    playerOneMoveThreeValue = moveThreeValue;
  } else {
    playerTwoMoveOneType = moveOneType;
    playerTwoMoveOneValue = moveOneValue;
    playerTwoMoveTwoType = moveTwoType;
    playerTwoMoveTwoValue = moveTwoValue;
    playerTwoMoveThreeType = moveThreeType;
    playerTwoMoveThreeValue = moveThreeValue;
  }
}

function getRoundWinner(roundNumber) {
  let playerOneMove;
  let playerOneValue;
  let playerTwoMove;
  let playerTwoValue;
  if (roundNumber === 1) {
    playerOneMove = playerOneMoveOneType;
    playerOneValue = playerOneMoveOneValue;
    playerTwoMove = playerTwoMoveOneType;
    playerTwoValue = playerTwoMoveOneValue;
  } else if (roundNumber === 2) {
    playerOneMove = playerOneMoveTwoType;
    playerOneValue = playerOneMoveTwoValue;
    playerTwoMove = playerTwoMoveTwoType;
    playerTwoValue = playerTwoMoveTwoValue;
  } else if (roundNumber === 3) {
    playerOneMove = playerOneMoveThreeType;
    playerOneValue = playerOneMoveThreeValue;
    playerTwoMove = playerTwoMoveThreeType;
    playerTwoValue = playerTwoMoveThreeValue;
  } else {
    return null;
  }
  if (!playerOneMove || !playerOneValue || !playerTwoMove || !playerTwoValue) {
    return null;
  }
  if (playerOneMove === "rock") {
    if (playerTwoMove === "paper") {
      return "Player Two";
    } else if (playerTwoMove === "scissors") {
      return "Player One";
    } else {
      if (playerOneValue > playerTwoValue) {
        return "Player One";
      } else if (playerOneValue < playerTwoValue) {
        return "Player Two";
      } else {
        return "Tie";
      }
    }
  } else if (playerOneMove === "paper") {
    if (playerTwoMove === "scissors") {
      return "Player Two";
    } else if (playerTwoMove === "rock") {
      return "Player One";
    } else if (playerTwoMove === "paper") {
      if (playerOneValue > playerTwoValue) {
        return "Player One";
      } else if (playerOneValue < playerTwoValue) {
        return "Player Two";
      } else {
        return "Tie";
      }
    }
  } else if (playerOneMove === "scissors") {
    if (playerTwoMove === "rock") {
      return "Player Two";
    } else if (playerTwoMove === "paper") {
      return "Player One";
    } else {
      if (playerOneValue > playerTwoValue) {
        return "Player One";
      } else if (playerOneValue < playerTwoValue) {
        return "Player Two";
      } else {
        return "Tie";
      }
    }
  }
}

function getGameWinner() {
  let playerOneWins = 0;
  let playerTwoWins = 0;
  for (let i = 1; i <= 3; i++) {
    const winner = getRoundWinner(i);
    if (winner === "Player One") {
      playerOneWins += 1;
    } else if (winner === "Player Two") {
      playerTwoWins += 1;
    } else if (winner === null) {
      return null;
    }
  }
  if (playerOneWins > playerTwoWins) {
    return "Player One";
  } else if (playerOneWins < playerTwoWins) {
    return "Player Two";
  } else {
    return "Tie";
  }
}

function setComputerMoves() {
  let moveNum = Math.floor(Math.random() * 3);
  console.log(types[moveNum]);
  playerTwoMoveOneType = types[moveNum];
  playerTwoMoveOneValue = Math.floor(Math.random() * 97) + 1;
  moveNum = Math.floor(Math.random() * 3);
  playerTwoMoveTwoType = types[moveNum];
  playerTwoMoveTwoValue = Math.floor(
    Math.random() * (98 - playerTwoMoveOneValue)
  );
  moveNum = Math.floor(Math.random() * 3);
  playerTwoMoveThreeType = types[moveNum];
  playerTwoMoveThreeValue = 99 - playerTwoMoveOneValue - playerTwoMoveTwoValue;
}
