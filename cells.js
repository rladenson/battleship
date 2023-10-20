class Cell {
  constructor(shipID) {
    //number
    this.shipID = shipID;

    //bool
    this.hit = false;
  }
  hover = () => {
    this.game.highlight.style.gridRowStart = this.x + 1;
    this.game.highlight.style.gridColumnStart = this.y + 1;
  };
  setElements = (element, interactable) => {
    this.element = element;
    this.interactable = interactable;
  };
  showBorder = (up, down, left, right) => {
    const border = "6px solid rgba(0,0,0,.4)";
    if (!left) this.element.style["border-left"] = border;
    if (!right) this.element.style["border-right"] = border;
    if (!up) this.element.style["border-top"] = border;
    if (!down) this.element.style["border-bottom"] = border;
  };
}

class GameCell extends Cell {
  constructor(shipID, x, y, game) {
    super(shipID);

    this.x = x;
    this.y = y;
    this.game = game;
  }
  hitCell = (e) => {
    if (this.hit) return;
    this.hit = true;
    const hit = this.shipID !== -1;
    hitAudio.load();
    missAudio.load();
    hit ? hitAudio.play() : missAudio.play();
    this.element.classList.add(hit ? "hit" : "miss");
    game.hitTile(this.shipID);
  };
  cleanUp = () => {
    this.element.onclick = "";
    this.element.innerHTML = "";
  };
}

class StartCell extends Cell {
  constructor(x, y, game) {
    super(-1);
    this.x = x;
    this.y = y;
    this.game = game;
  }
  placeShip = () => {
    if (this.game.length + (this.game.vertical ? this.x : this.y) > 10)
      return openModal(undefined, "modal-ship-out-of-bounds");
    const tiles = [];
    for (let i = 0; i < this.game.length; i++) {
      const cell =
        this.game.grid[this.game.vertical ? this.x + i : this.x][
          this.game.vertical ? this.y : this.y + i
        ];
      if (cell.shipID !== -1)
        return openModal(undefined, "modal-overlapping-ships");
      tiles.push(cell);
    }
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].shipID = this.game.shipHP.length;
      tiles[i].element.classList.add("hit");
    }
    this.game.revealShip(this.game.shipHP.length);
    this.game.shipHP.push(tiles.length);
    document.getElementById("manual-done").removeAttribute("disabled");
  };
}
