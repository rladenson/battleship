let game;

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
    this.grid = randomStarts[Math.floor(Math.random() * randomStarts.length)];
    const gridHTML = buildGridHTML();
    this.gridCells = gridHTML[0];
    this.gridEl = gridHTML[1];
    document.getElementById("game").removeAttribute("hidden");
    document.getElementById("game").innerHTML = "";
    document.getElementById("game").appendChild(this.gridEl);
    // const arr = [];
    // const arrInner = [];
    // for (let i = 0; i < 10; i++) {
    //   arrInner.push(-1);
    // }
    // for (let i = 0; i < 10; i++) {
    //   arr.push([...arrInner]);
    // }
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

//make new game
const go = (manualStart) => {
  document.getElementById("start").style.display = "none";
  game = new Game(manualStart);
};

const buildGridHTML = () => {
  const grid = [];
  const gridEl = document.createElement("div");
  gridEl.classList.add("grid");
  for (let i = 0; i < 10; i++) {
    grid.push([]);
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("row", i);
      cell.setAttribute("col", j);
      grid[i].push(cell);
      gridEl.appendChild(cell);
    }
  }
  return [grid, gridEl];
};
