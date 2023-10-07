let game;

//game class
class Game {
  //  constr
  constructor(manualStart = false) {
    //      calls one of starts
    this.grid = manualStart ? this.manualStart() : this.randomStart();
    //      initialize turns
    this.turns = 70;
    //      makes sure grid is set up properly?
  }
  //  random start
  randomStart = () => {
    const arr = [];
    const arrInner = [];
    for (let i = 0; i < 10; i++) {
      arrInner.push(false);
    }
    for (let i = 0; i < 10; i++) {
      arr.push([...arrInner]);
    }
  };
  //  choice start
  manualStart = () => {
    //this will be changed later, but until I implement that
    return this.randomStart();
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
const startGame = (manualStart) => {
  document.getElementById("start").setAttribute("hidden", "");
  game = new Game(manualStart);
};
