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
    this.turns = 60;
    document.getElementById("turns").innerText = this.turns;
    //      makes sure grid is set up properly?

    this.shipHP = [5, 4, 3, 3, 2];
  }
  //  random start
  makeGridRandom = () => {
    this.grid = randomStarts[Math.floor(Math.random() * randomStarts.length)];
    const gridHTML = buildGridHTML(this.grid);
    //this.grid = gridHTML[0];
    this.gridEl = gridHTML[1];
    document.getElementById("game").style.display = "flex";
    document.getElementById("board").innerHTML = "";
    document.getElementById("board").appendChild(this.gridEl);
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
          this.grid[i][j].showBorder();
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
  };
  //  game over (out of turns)
  lose = () => {
    openModal(undefined, "modal-lose");
    this.cleanUp();
  };
  cleanUp = () => {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].cleanUp();
      }
    }
  }
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
    game.hitTile(this.shipID);
  };
  showBorder = () => {
    const border = "1vw solid rgba(0,0,0,.4)";
    if (!this.left) this.element.style["border-left"] = border;
    if (!this.right) this.element.style["border-right"] = border;
    if (!this.up) this.element.style["border-top"] = border;
    if (!this.down) this.element.style["border-bottom"] = border;
  };
  cleanUp = () => {
    this.element.onclick = "";
    this.element.innerHTML = "";
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
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);

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
