let game;
const missAudio = new Audio("assets/352103__inspectorj__splash-jumping-g.wav");
const hitAudio = new Audio("assets/521105__matrixxx__retro-explosion-07.wav");
//game class
class Game {
  //  constr
  constructor(manualStart = false) {
    //      calls one of starts
    manualStart ? this.makeGridManual() : this.makeGridRandom();
    //      initialize turns
    this.turns = 70;
    //      makes sure grid is set up properly?

    this.shipHP = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  }
  //  random start
  makeGridRandom = () => {
    const grid = randomStarts[Math.floor(Math.random() * randomStarts.length)];
    const gridHTML = buildGridHTML(grid);
    //this.grid = gridHTML[0];
    this.gridEl = gridHTML[1];
    document.getElementById("game").style.display = "block";
    document.getElementById("game").innerHTML = "";
    document.getElementById("game").appendChild(this.gridEl);
  };
  //  choice start
  makeGridManual = () => {
    //this will be changed later, but until I implement that
    return this.makeGridRandom();
  };
  //  hit tile
  bombTile = (x, y) => {
    //      if hit
    if (this.grid[x][y] === true) {
      //        calls check neighbors
      //          check num hits
    } else {
      //      if miss
    }
    //      check turn
    this.turns--;
    if (this.turns <= 0) {
      this.lose();
    }
  };
  //  check neighbors
  checkNeighbors = () => {};
  //  game over (win)
  win = () => {};
  //  game over (out of turns)
  lose = () => {};
}

class Cell {
  constructor(shipID, left = false, right = false, up = false, down = false) {
    //number
    this.shipID = shipID;
    //bools
    this.left = left;
    this.right = right;
    this.up = up;
    this.down = down;

    this.hit = false;
  }
  setElement = (element) => {
    this.element = element;
  };
  hitCell = (e) => {
    if (this.hit) return;
    this.hit = true;
    const hit = this.shipID !== -1;
    hitAudio.load();
    missAudio.load();
    hit ? hitAudio.play() : missAudio.play();
    e.target.parentElement.classList.add(hit ? "hit" : "miss");
  };
}

//make new game
const go = (manualStart) => {
  document.getElementById("start").style.display = "none";
  game = new Game(manualStart);
};

const buildGridHTML = (gridCells) => {
  const gridEl = document.createElement("div");
  gridEl.classList.add("grid");
  for (let i = 0; i < gridCells.length; i++) {
    for (let j = 0; j < gridCells[i].length; j++) {
      const cell = document.createElement("div");
      const inner = document.createElement("div");
      inner.classList.add("cellOverlay");
      cell.appendChild(inner);
      cell.classList.add("cell");
      cell.setAttribute("row", i);
      cell.setAttribute("col", j);

      cell.onclick = gridCells[i][j].hitCell;

      gridCells[i][j].setElement(cell);
      gridEl.appendChild(cell);
    }
  }
  return [gridCells, gridEl];
};

const backToStart = () => {
  const hide = document.getElementsByClassName("start-hidden");
  for (let i = 0; i < hide.length; i++) {
    hide[i].style.display = "none";
  }
  document.getElementById("start").style.display = "flex";
};
const openCredits = () => {
  document.getElementById("start").style.display = "none";
  document.getElementById("credits").style.display = "block";
};
