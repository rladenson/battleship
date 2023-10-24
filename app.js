let game;
const missAudio = new Audio("assets/352103__inspectorj__splash-jumping-g.wav");
const hitAudio = new Audio("assets/521105__matrixxx__retro-explosion-07.wav");
const winAudio = new Audio("assets/495005__evretro__win-video-game-sound.wav");

const numberMap = ["zero", "one", "two", "three", "four", "five"];

class Ship {
  constructor(id, length) {
    this.id = id;
    this.length = length;
    this.hp = length;
    this.tiles = [];
  }
}

//game class
class Game {
  //var list
  //ships: [Ship]
  //highlight: div
  //turns: int
  //grid: int[][]
  //vertical: bool
  //length: int

  //  constr
  constructor(manualStart = false) {
    this.ships = [];

    this.highlight = document.createElement("div");
    this.highlight.id = "highlight";

    //      calls one of starts
    manualStart ? this.makeGridManual() : this.makeGridRandom();
    //      initialize turns
    this.turns = 60;
    document.getElementById("turns").innerText = this.turns;
    //      makes sure grid is set up properly?
  }
  //  random start
  makeGridRandom = () => {
    const gridHTML = buildGridsFromScratch(this);
    this.grid = gridHTML[0];
    
    this.placeShipRandom(2);
    this.placeShipRandom(3);
    this.placeShipRandom(3);
    this.placeShipRandom(4);
    this.placeShipRandom(5);
    this.startGame();
  };
  placeShipRandom = (length) => {
    this.length = length;
    let cont = -3;
    while (cont < 0) {
      this.vertical = Math.random() > 0.5;
      if (this.vertical) {
        cont =
          this.grid[Math.floor(Math.random() * (10 + 1 - this.length))][
            Math.floor(Math.random() * 10)
          ].placeShip(true);
      } else {
        cont =
          this.grid[Math.floor(Math.random() * 10)][
            Math.floor(Math.random() * (10 + 1 - this.length))
          ].placeShip(true);
      }
    }
  }
  //  choice start
  makeGridManual = () => {
    const gridHTML = buildGridsFromScratch(this);
    this.grid = gridHTML[0];

    document.getElementById("game").style.display = "flex";
    document.getElementById("board").innerHTML = "";
    document.getElementById("manual-done").style.display = "block";

    const container = document.getElementById("manual-start");
    container.innerHTML = "";
    container.style.display = "flex";
    for (let i = 2; i <= 5; i++) {
      const button = document.createElement("button");
      button.textContent = `Place ${i} cell ship`;
      button.setAttribute("data-num", i);
      container.appendChild(button);
      button.onclick = this.changeShipLength;
    }
    let button = document.createElement("button");
    button.innerHTML = 'Placing <span id="direction">horizontally</span>';
    this.vertical = false;
    button.onclick = () => {
      if (this.vertical) {
        document.getElementById("direction").textContent = "horizontally";
        this.vertical = false;
      } else {
        document.getElementById("direction").textContent = "vertically";
        this.vertical = true;
      }
      this.changeShipLength();
    };
    container.appendChild(button);
    this.length = 2;
    this.changeShipLength();

    document.getElementById("board").appendChild(gridHTML[1]);
    document.getElementById("board").appendChild(gridHTML[2]);
    document.getElementById("board").appendChild(gridHTML[3]);

    document.getElementById("manual-done").onclick = this.startGame;
  };
  startGame = () => {
    this.length = 1;
    this.changeShipLength();
    document.getElementById("manual-done").style.display = "none";
    document.getElementById("manual-start").style.display = "none";

    const gridHTML = buildGridsFromPreset(this.grid, this, this.ships);
    this.grid = gridHTML[0];
    //this.gridEl = gridHTML[1];
    document.getElementById("game").style.display = "flex";
    document.getElementById("board").innerHTML = "";

    document.getElementById("board").appendChild(gridHTML[1]);
    document.getElementById("board").appendChild(gridHTML[2]);
    document.getElementById("board").appendChild(gridHTML[3]);

    document.getElementById("turns-container").style.display = "block";
    document.getElementById("ships-remaining").style.display = "flex";

    for (let i = 0; i < this.ships.length; i++) {
      const span = document.getElementById(
        `${numberMap[this.ships[i].length]}-tile`
      );
      span.innerText = parseInt(span.innerText) + 1;
    }
  };
  //  hit tile
  hitTile = (ship) => {
    let shipDestroyed = false;
    if (ship !== undefined && ship.id != -1) {
      ship.hp--;
      if (ship.hp === 0) {
        shipDestroyed = true;
        this.revealShip(ship);
        const span = document.getElementById(`${numberMap[ship.length]}-tile`);
        span.innerText = parseInt(span.innerText) - 1;
        let win = true;
        for (let i = 0; i < this.ships.length; i++) {
          if (this.ships[i].hp !== 0) win = false;
        }
        if (win) return this.win();
      }
    }
    //      check turn
    this.turns--;
    document.getElementById("turns").innerText = this.turns;
    if (this.turns <= 0) return this.lose();

    //we only open a ship destroyed modal if you don't win or lose
    if (shipDestroyed) openModal(undefined, "modal-ship-destroyed");
  };
  revealShip = (ship) => {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j].shipID === ship.id) {
          let up = false;
          if (i !== 0 && this.grid[i - 1][j].shipID === ship.id) up = true;
          let down = false;
          if (
            i !== this.grid.length - 1 &&
            this.grid[i + 1][j].shipID === ship.id
          )
            down = true;
          let left = false;
          if (j !== 0 && this.grid[i][j - 1].shipID === ship.id) left = true;
          let right = false;
          if (
            j !== this.grid[i].length - 1 &&
            this.grid[i][j + 1].shipID === ship.id
          )
            right = true;
          this.grid[i][j].showBorder(up, down, left, right);
        }
      }
    }
  };
  //  game over (win)
  win = () => {
    openModal(undefined, "modal-win");
    this.cleanUp();
    document.getElementById("status").innerText = "WIN";
    setTimeout(() => {
      hitAudio.load();
      winAudio.play();
    }, 1000);
  };
  //  game over (out of turns)
  lose = () => {
    openModal(undefined, "modal-lose");
    this.cleanUp();
    document.getElementById("status").innerText = "LOSS";
  };
  cleanUp = () => {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].cleanUp();
      }
    }
    const shipCounts = document.getElementsByClassName("ship-count");
    for (let i = 0; i < shipCounts.length; i++) {
      shipCounts[i].innerText = 0;
    }
  };
  changeShipLength = (e = undefined) => {
    if (e) this.length = parseInt(e.target.dataset.num);
    if (this.vertical) {
      this.highlight.style.gridRowEnd = `span ${this.length}`;
      this.highlight.style.gridColumnEnd = `span 1`;
    } else {
      this.highlight.style.gridColumnEnd = `span ${this.length}`;
      this.highlight.style.gridRowEnd = `span 1`;
    }
  };
}

//make new game
const go = (manualStart) => {
  document.getElementById("start").style.display = "none";
  game = new Game(manualStart);
};

const buildGridsFromPreset = (gridCells, game, ships = {}) => {
  const grid = [];

  const tilesGrid = document.createElement("div");
  tilesGrid.classList.add("grid");
  tilesGrid.classList.add("first-grid");

  const overlayGrid = document.createElement("div");
  overlayGrid.classList.add("grid");
  overlayGrid.appendChild(game.highlight);

  const interactableGrid = document.createElement("div");
  interactableGrid.classList.add("grid");

  for (let i = 0; i < gridCells.length; i++) {
    grid.push([]);
    for (let j = 0; j < gridCells[i].length; j++) {
      const cellTile = document.createElement("div");
      cellTile.classList.add("cell");
      cellTile.setAttribute("data-row", i);
      cellTile.setAttribute("data-col", j);

      const interactCell = document.createElement("div");

      if (gridCells[i][j].ship !== undefined) {
        grid[i].push(new GameCell(gridCells[i][j].ship, i, j, game));
      } else {
        grid[i].push(new GameCell(-1, i, j, game))
      }

      grid[i][j].setElements(cellTile, interactCell);

      interactCell.onclick = grid[i][j].hitCell;
      interactCell.onmouseover = grid[i][j].hover;

      tilesGrid.appendChild(cellTile);
      interactableGrid.appendChild(interactCell);
    }
  }
  return [grid, tilesGrid, overlayGrid, interactableGrid];
};
const buildGridsFromScratch = (game) => {
  const grid = [];

  const tilesGrid = document.createElement("div");
  tilesGrid.classList.add("grid");
  tilesGrid.classList.add("first-grid");

  const overlayGrid = document.createElement("div");
  overlayGrid.classList.add("grid");
  overlayGrid.appendChild(game.highlight);

  const interactableGrid = document.createElement("div");
  interactableGrid.classList.add("grid");

  for (let i = 0; i < 10; i++) {
    grid.push([]);
    for (let j = 0; j < 10; j++) {
      const cellTile = document.createElement("div");
      cellTile.classList.add("cell");
      cellTile.setAttribute("data-row", i);
      cellTile.setAttribute("data-col", j);

      const interactCell = document.createElement("div");

      grid[i].push(new StartCell(i, j, game));

      grid[i][j].setElements(cellTile, interactCell);

      interactCell.onclick = grid[i][j].placeShip;
      interactCell.onmouseover = grid[i][j].hover;

      tilesGrid.appendChild(cellTile);
      interactableGrid.appendChild(interactCell);
    }
  }
  return [grid, tilesGrid, overlayGrid, interactableGrid];
};

const backToStart = () => {
  const hide = document.getElementsByClassName("start-hidden");
  for (let i = 0; i < hide.length; i++) {
    hide[i].style.display = "none";
  }
  document.getElementById("start").style.display = "flex";
  document.getElementById("status").textContent = "";
  while (document.getElementById("board").hasChildNodes()) {
    document
      .getElementById("board")
      .removeChild(document.getElementById("board").firstChild);
  }
  if (game) game.cleanUp();
};
const openCredits = () => {
  document.getElementById("start").style.display = "none";
  document.getElementById("credits").style.display = "block";
};

const openHowToPlay = () => {
  document.getElementById("start").style.display = "none";
  document.getElementById("how-to-play").style.display = "block";
};

// below is not my code, check credits
const modals = document.querySelectorAll("[data-modal]");

const openModal = (evt, modalName) => {
  let modal;

  //if is Event
  if (evt) {
    evt.preventDefault();
    if (evt.target.tagName === "BUTTON") {
      modal = document.getElementById(evt.target.dataset.modal);
    } else {
      modal = document.getElementById(evt.target.parentElement.dataset.modal);
    }
  } else {
    modal = document.getElementById(modalName);
  }
  modal.classList.add("open");
  const exits = modal.querySelectorAll(".modal-exit");
  exits.forEach((exit) => {
    exit.addEventListener("click", (event) => {
      event.preventDefault();
      modal.classList.remove("open");
    });
  });
};

modals.forEach((trigger) => {
  trigger.addEventListener("click", openModal);
});

backToStart();

const url = new URL("https://battleship-backend-sxo0.onrender.com");

pingAPI = async () => {
  await fetch(url).then((req) => req.text()).then(console.log);
}

pingAPI();
