const crypto = require("crypto");
const readline = require("readline");

const compMoves = ["rock", "paper", "scissors", "lizard", "Spock"];

const getRandomMove = () => {
  const randomIndex = Math.floor(Math.random() * compMoves.length);
  return compMoves[randomIndex];
};

const secret = "compMove";
const computerMove = getRandomMove();

const secureRandomHmac = crypto
  .createHmac("sha256", secret)
  .update(computerMove)
  .digest("hex");

const recoveredMove =
  crypto.createHmac("sha256", secret).update(computerMove).digest("hex") ===
  secureRandomHmac
    ? Buffer.from(computerMove, "utf-8").toString("utf8")
    : null;

const determineWinner = (userMove, computerMove) => {
  if (userMove === computerMove) {
    return "tie";
  } else if (
    (userMove === "rock" &&
      (computerMove === "scissors" || computerMove === "lizard")) ||
    (userMove === "paper" &&
      (computerMove === "rock" || computerMove === "Spock")) ||
    (userMove === "scissors" &&
      (computerMove === "paper" || computerMove === "lizard")) ||
    (userMove === "lizard" &&
      (computerMove === "paper" || computerMove === "Spock")) ||
    (userMove === "Spock" &&
      (computerMove === "rock" || computerMove === "scissors"))
  ) {
    return "user";
  } else {
    return "computer";
  }
};

const a = process.argv.slice(2);

const moves = {};
a.forEach((move, index) => {
  moves[(index + 1).toString()] = move;
});

const rockPaperScissors = (a) => {
  console.log(`HMAC key: ${secureRandomHmac}`);
  console.log("Available moves:");
  for (let i = 0; i < a.length; i++) {
    let n = 1;
    console.log(`${n + i} - ${a[i]}`);
  }
  console.log(`0 - Exit`);
  console.log(`? - Help`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your move: ", (answer) => {
    rl.close();

    if (answer === "?") {
      console.log(`
How to Win:
+-----------+------------------------+--------------------------------------+
| Your Move | Wins Against            | Lose Against                         |
+-----------+------------------------+--------------------------------------+
| Rock      | Scissors, Lizard        | Paper, Spock                         |
| Paper     | Rock, Spock             | Scissors, Lizard                     |
| Scissors  | Paper, Lizard           | Rock, Spock                          |
| Lizard    | Paper, Spock            | Rock, Scissors                       |
| Spock     | Rock, Scissors          | Paper, Lizard                        |
+-----------+------------------------+--------------------------------------+`);
    } else if (answer === "0") {
      console.log("Goodbye!");
      process.exit();
    }

    const move = moves[answer];
    if (move) {
      console.log(`Your move is ${move}`);
      console.log(`Computer move is ${recoveredMove}`);

      const winner = determineWinner(move, recoveredMove);

      if (winner === "user") {
        console.log("You win!");
      } else if (winner === "computer") {
        console.log("Computer wins!");
      } else {
        console.log("It's a tie!");
      }

      console.log(`HMAC key: ${secureRandomHmac}`);
    } else {
      if (answer !== move && answer !== "?") {
        console.log(
          `Invalid move: ${answer}. Enter a number from the list above or type ? for help.`
        );
      }
    }
  });
};

rockPaperScissors(a);
