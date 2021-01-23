let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

// Write your code below:
let generateTarget = () => Math.floor(Math.random()*10);

let getAbsoluteDistance = (guess, target) => Math.abs(guess - target);

let compareGuesses = (humanGuess, computerGuess, target) => {
    const humanDiff = getAbsoluteDistance(humanGuess, target);
    const computerDiff = getAbsoluteDistance(computerGuess, target);
    if (humanDiff <= computerDiff){return true;}
    else {return false;}
}

let updateScore = winner => {
    if (winner === 'human'){humanScore++;}
    else if (winner === 'computer'){computerScore++;}
}

let advanceRound = () => {
    currentRoundNumber++;
}
