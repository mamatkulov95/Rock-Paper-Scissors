const crypto = require("crypto");
const readline = require("readline");
const a = process.argv.slice(2);

if (a.length < 3 || a.length % 2 === 0) {
  console.log(
    "Invalid input.Length should be odd and greater than or equal to 3."
  );
  process.exit();
}

const getRandomMove = () => {
  const randomIndex = Math.floor(Math.random() * a.length);
  return a[randomIndex];
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

const rockPaperScissors = (a) => {
  const movesTable = {};

  for (let i = 0; i < a.length; i++) {
    const move = a[i];
    const beats = a
      .slice(i + 1)
      .concat(a.slice(0, i))
      .slice(0, a.length / 2);
    const losesTo = a.slice().filter((m) => !beats.includes(m) && m !== move);
    movesTable[move] = { beats, losesTo };
  }

  const helpTable = (moves) => {
    const header = ["Your Move", "Wins Against", "Lose Against"];
    const rows = moves.map((move) => {
      const beats = movesTable[move].beats.join(", ");
      const losesTo = movesTable[move].losesTo.join(", ");
      return [move, beats, losesTo];
    });
    console.table([header, ...rows]);
  };

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
      helpTable(a);
    } else if (answer === "0") {
      console.log("Goodbye!");
      process.exit();
    }

    const moves = {};
    a.forEach((move, index) => {
      moves[(index + 1).toString()] = move;
    });

    const userMove = moves[answer];

    if (userMove && a.length >= 3) {
      console.log(`Your move is ${userMove}`);
      console.log(`Computer move is ${recoveredMove}`);

      if (userMove === recoveredMove) {
        console.log("It's a tie!");
      } else if (movesTable[userMove].beats.includes(recoveredMove)) {
        console.log("You win!");
      } else {
        console.log("Computer wins!");
      }
      console.log(`HMAC key: ${secureRandomHmac}`);
    }
  });
};

rockPaperScissors(a);
