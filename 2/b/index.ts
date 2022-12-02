/**
 * Game of rock paper paper scissors
 *
 * The elves provided insight into the opponents moves, with a "encrypted" file
 *
 * A:  Rock (1 point)
 * B:  Paper (2 points)
 * C:  Scissors (3 points)
 *
 * Win: 6 points
 * Draw: 3 points
 * Lose: 0 points
 */
import * as fs from "fs";

enum move {
  Rock,
  Paper,
  Scissors,
}

const inputToMove = (input: string) => {
  switch (input) {
    case "A":
    case "X":
      return move.Rock;
    case "B":
    case "Y":
      return move.Paper;
    case "C":
    case "Z":
      return move.Scissors;
    default:
      throw new Error(`Unknown move: ${input}`);
  }
};

const getRoundScore = (opponentChoice: move, myChoice: move) => {
  const roundResultScore = getResultScore(opponentChoice, myChoice);
  const choiceScore = getChoiceScore(myChoice);

  return roundResultScore + choiceScore;
};

const getResultScore = (opponentChoice: move, myChoice: move) => {
  // Draw
  if (opponentChoice === myChoice) {
    return 3;
  }

  // Win
  if (
    (myChoice === move.Rock && opponentChoice === move.Scissors) ||
    (myChoice === move.Paper && opponentChoice === move.Rock) ||
    (myChoice === move.Scissors && opponentChoice === move.Paper)
  ) {
    return 6;
  }

  //Lose
  return 0;
};

const getChoiceScore = (myChoice: move) => {
  switch (myChoice) {
    case move.Rock:
      return 1;
    case move.Paper:
      return 2;
    case move.Scissors:
      return 3;
    default:
      throw new Error("Unknown choice");
  }
};

const countRoundScores = (rounds: string[]) => {
  const roundScores = rounds.map((round) => {
    const [opponentChoiceEncrypted, requiredResult] = round.split(" ");
    const opponentChoice = inputToMove(opponentChoiceEncrypted);
    const myChoice = getRequiredChoice(opponentChoice, requiredResult);

    return getRoundScore(opponentChoice, myChoice);
  });

  return roundScores;
};

const getRequiredChoice = (opponentChoice: move, requiredResult: string) => {
  switch (requiredResult) {
    //Win
    case "Z":
      return getWinningChoice(opponentChoice);
    // Lose
    case "X":
      return getLosingChoice(opponentChoice);
    // Draw
    case "Y":
      return opponentChoice;
    default:
      throw new Error(`Unknown required result: ${requiredResult}`);
  }
};

const getWinningChoice = (opponentChoice: move) => {
  switch (opponentChoice) {
    case move.Rock:
      return move.Paper;
    case move.Paper:
      return move.Scissors;
    case move.Scissors:
      return move.Rock;
    default:
      throw new Error("Unknown choice");
  }
};

const getLosingChoice = (opponentChoice: move) => {
  switch (opponentChoice) {
    case move.Rock:
      return move.Scissors;
    case move.Paper:
      return move.Rock;
    case move.Scissors:
      return move.Paper;
    default:
      throw new Error("Unknown choice");
  }
};

const result = () => {
  const path = "2/input";
  const file = fs.readFileSync(path, "utf8");
  const lines = file.split("\n");

  const roundScores = countRoundScores(lines);

  const totalScore = roundScores.reduce((acc, score) => acc + score, 0);

  return totalScore;
};

console.log(result());
