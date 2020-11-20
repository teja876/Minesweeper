let dimension = 9;
let flagsLeft = 10;
let noOfBombs = 10;
let board = new Array(dimension);
let randomNumbers = {};
let score = 0;

function Cell() {
  this.bomb = false;
  this.isrevealed = false;
  this.flagSet = false;
  this.count = 0;
}

const getCell = (i) => {
  return board[parseInt(i / dimension)][i % dimension];
};

const isRandomValid = (temp) => {
  if (
    randomNumbers[temp] === 1 ||
    randomNumbers[temp + dimension + 1] === 1 ||
    randomNumbers[temp + dimension - 1] === 1 ||
    randomNumbers[temp + dimension] === 1 ||
    randomNumbers[temp - dimension + 1] === 1 ||
    randomNumbers[temp - dimension - 1] === 1 ||
    randomNumbers[temp - dimension] === 1 ||
    randomNumbers[temp - 1] === 1 ||
    randomNumbers[temp + 1] === 1
  )
    return true;
};

const generateRandomNumbers = () => {
  let count = 0;
  while (count < noOfBombs) {
    let temp = Math.floor(Math.random() * 81);
    if (isRandomValid(temp)) continue;
    else {
      randomNumbers[temp] = 1;
      count++;
    }
  }
};

const removeAllEvents = () => {
  for (let i = 0; i < dimension * dimension; i++) {
    let el = document.getElementById(i);
    el.removeEventListener("click", handleClick, true);
    el.removeEventListener("contextmenu", setFlags, false);
  }
};

const revealCell = (i) => {
  let cell = getCell(i);
  document.getElementById("score").innerHTML = `Score: ${score}`;
  cell.isrevealed = true;
  document.getElementById(i).innerHTML = cell.count ? cell.count : "";
  let el = document.getElementById(i);
  // el.removeEventListener("contextmenu", setFlags, false);

  el.classList.add("reveal");
  score++;
};

function handleClick(event) {
  let i = parseInt(event.target.id);
  let cell = getCell(i);
  if (cell.bomb === true) {
    console.log("Game Over");
    for (let j in randomNumbers) {
      document.getElementById(j).innerHTML = "&#128163";
    }
    // board = [];
    removeAllEvents();
    document.getElementById("result").innerHTML = `You lost the game`;
    return;
  }

  fillEmpty(i);
}

function setFlags(event) {
  event.preventDefault();
  let i = parseInt(event.target.id);
  let cell = getCell(i);
  let cellDiv = event.target;
  // console.log(event);
  if (cell.isrevealed) return;
  if (cell.flagSet) {
    cellDiv.innerHTML = "";
    cell.flagSet = false;
    cellDiv.addEventListener("click", handleClick, true);
    flagsLeft++;
  } else {
    if (flagsLeft === 0) return;
    cellDiv.innerHTML = "&#128681";
    cell.flagSet = true;
    cellDiv.removeEventListener("click", handleClick, true);
    flagsLeft--;
  }
  document.getElementById("flags").innerHTML = `Flags left: ${flagsLeft}`;
  // console.log(event);
}

const createGrid = () => {
  for (let i = 0; i < dimension; i++) board[i] = new Array(dimension);
  let elBoard = document.getElementsByClassName("board")[0];
  for (let i = 0; i < dimension * dimension; i++) {
    let cellDiv = document.createElement("div");
    cellDiv.classList.add("cell", "center");
    cellDiv.setAttribute("id", i);
    let cell = new Cell();
    if (randomNumbers[parseInt(i)] === 1) cell.bomb = true;
    board[parseInt(i / dimension)][i % dimension] = cell;
    cellDiv.addEventListener("click", handleClick, true);
    cellDiv.addEventListener("contextmenu", setFlags, false);
    elBoard.appendChild(cellDiv);
  }
};

const resetGame = () => {
  randomNumbers = {};
  generateRandomNumbers();
  let elBoard = document.getElementsByClassName("board")[0];
  elBoard.innerHTML = "";
  createGrid();
  score = 0;
  document.getElementById("result").innerHTML = "";
  document.getElementById("score").innerHTML = `Score: ${score}`;
  calculateBombs();
  flagsLeft = 10;
  document.getElementById("flags").innerHTML = `Flags left: ${flagsLeft}`;
};

const checkCordinates = (x, y) => {
  return x >= 0 && y < dimension && x < dimension && y >= 0;
};

let getSurroundings = (i) => {
  let x = parseInt(i / dimension),
    y = parseInt(i % dimension);
  let count = 0;
  if (checkCordinates(x, y + 1) && board[x][y + 1].bomb) count++;
  if (checkCordinates(x, y - 1) && board[x][y - 1].bomb) count++;
  if (checkCordinates(x + 1, y) && board[x + 1][y].bomb) count++;
  if (checkCordinates(x - 1, y) && board[x - 1][y].bomb) count++;
  if (checkCordinates(x + 1, y + 1) && board[x + 1][y + 1].bomb) count++;
  if (checkCordinates(x - 1, y + 1) && board[x - 1][y + 1].bomb) count++;
  if (checkCordinates(x + 1, y - 1) && board[x + 1][y - 1].bomb) count++;
  if (checkCordinates(x - 1, y - 1) && board[x - 1][y - 1].bomb) count++;
  return count;
};

const calculateBombs = function () {
  for (let i = 0; i < dimension * dimension; i++) {
    let cell = getCell(i);
    if (cell.bomb) continue;
    cell.count = getSurroundings(i);
  }
};

const fillEmpty = (i) => {
  // console.log(i);
  let cell = getCell(i);
  if (cell.isrevealed) return;
  revealCell(i);
  if (cell.count) return;
  let x = parseInt(i / dimension),
    y = parseInt(i % dimension);
  if (checkCordinates(x, y + 1)) fillEmpty(i + 1);
  if (checkCordinates(x, y - 1)) fillEmpty(i - 1);
  if (checkCordinates(x + 1, y)) fillEmpty(i + dimension);
  if (checkCordinates(x - 1, y)) fillEmpty(i - dimension);
  if (checkCordinates(x + 1, y + 1)) fillEmpty(i + dimension + 1);
  if (checkCordinates(x - 1, y + 1)) fillEmpty(i - dimension + 1);
  if (checkCordinates(x + 1, y - 1)) fillEmpty(i + dimension - 1);
  if (checkCordinates(x - 1, y - 1)) fillEmpty(i - dimension - 1);
  return;
};

document.getElementById("reset").addEventListener("click", resetGame);
document.getElementById("startGame").addEventListener("click", () => {
  document.getElementsByClassName("beforeStart")[0].classList.add("hide");
  document.getElementsByClassName("game")[0].classList.remove("hide");
});
generateRandomNumbers();
createGrid();
calculateBombs();
