let game;
const missAudio = new Audio("assets/352103__inspectorj__splash-jumping-g.wav");
const hitAudio = new Audio("assets/521105__matrixxx__retro-explosion-07.wav");
const winAudio = new Audio("assets/495005__evretro__win-video-game-sound.wav");

//game class
class Game {
  //  constr
  constructor(manualStart = false) {
    this.shipHP = [5, 4, 3, 3, 2];

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
    const gridHTML = buildGridsFromPreset(
      randomStarts[Math.floor(Math.random() * randomStarts.length)],
      this
    );
    this.grid = gridHTML[0];
    //this.gridEl = gridHTML[1];
    document.getElementById("game").style.display = "flex";
    document.getElementById("board").innerHTML = "";

    document.getElementById("board").appendChild(gridHTML[1]);
    document.getElementById("board").appendChild(gridHTML[2]);
    document.getElementById("board").appendChild(gridHTML[3]);
  };
  //  choice start
  makeGridManual = () => {
    //this will be changed later, but until I implement that
    return this.makeGridRandom();
  };
  //  hit tile
  hitTile = (shipID) => {
    let shipDestroyed = false;
    if (shipID != -1) {
      this.shipHP[shipID]--;
      if (this.shipHP[shipID] === 0) {
        shipDestroyed = true;
        this.revealShip(shipID);
        let win = true;
        for (let i = 0; i < this.shipHP.length; i++) {
          if (this.shipHP[i] !== 0) win = false;
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
  revealShip = (shipID) => {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j].shipID === shipID) {
          let up = false;
          if (i !== 0 && this.grid[i - 1][j].shipID === shipID) up = true;
          let down = false;
          if (
            i !== this.grid.length - 1 &&
            this.grid[i + 1][j].shipID === shipID
          )
            down = true;
          let left = false;
          if (j !== 0 && this.grid[i][j - 1].shipID === shipID) left = true;
          let right = false;
          if (
            j !== this.grid[i].length - 1 &&
            this.grid[i][j + 1].shipID === shipID
          )
            right = true;
          this.grid[i][j].showBorder(up, down, left, right);
        }
      }
    }
  };
  //  check neighbors
  checkNeighbors = () => {};
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
    document.getElementById("restart").style.display = "block";
  };
}


//make new game
const go = (manualStart) => {
  document.getElementById("start").style.display = "none";
  game = new Game(manualStart);
};

const buildGridsFromPreset = (gridCells, game) => {
  const grid = [];

  const tilesGrid = document.createElement("div");
  tilesGrid.classList.add("grid");

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

      grid[i].push(new GameCell(gridCells[i][j].shipID, i, j, game));

      grid[i][j].setElements(cellTile, interactCell);

      interactCell.onclick = grid[i][j].hitCell;
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
};
const openCredits = () => {
  document.getElementById("start").style.display = "none";
  document.getElementById("credits").style.display = "block";
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
