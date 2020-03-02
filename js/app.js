//Listeners for arrow keys
document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    //up arrow
    game.shiftUp();
  } else if (e.keyCode == '40') {
    //down arrow
    game.shiftDown();
  } else if (e.keyCode == '37') {
    //left arrow
  } else if (e.keyCode == '39') {
    //right arrow
  } else if (e.keyCode == '78') {
    //hit n to spawn numbers for testing
    game.spawnRandomNumbers();
  }
}

const game = {
  score: 0,
  highscore: 0,
  boardGridDOM: [],
  boardGridTiles: [],
  tiles: [],
  newGame() {
    this.initializeBoard();
  },
  initializeBoard() {
    //Initialize grid
    this.boardGridDOM = [];
    this.boardGridTiles = [];
    this.tiles = [];
    //boardGridDOM keeps track of all HTML elements to modify their innerHTML
    let gridItems = document.querySelectorAll('.grid-item');
    let gridRow = [];
    gridItems.forEach(element => {
      element.innerHTML = '';
      gridRow.push(element);
      if (gridRow.length === 4) {
        this.boardGridDOM.push(gridRow);
        gridRow = [];
      }
    });

    //boardGridTiles keeps track of tiles virtually to help manage their logic
    let tileRow = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        tileRow.push(new numberTile(null, null, null));
      }
      this.boardGridTiles.push(tileRow);
      tileRow = [];
    }
  },
  spawnRandomNumbers() {
    let inValidSpot = false;
    let randY, randX, randDecider, value;

    //Checks if grid is full, if yes then prevent spawning new values (Avoiding inf. loop)
    let isFull = true;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.boardGridTiles[y][x].value == null) {
          isFull = false;
        }
      }
    }

    //Spawn in either a 2 or 4 at random empty locations
    if (!isFull) {
      for (let a = 0; a < 2; a++) {
        while(!inValidSpot) {
          randY = Math.floor(Math.random() * 4);
          randX = Math.floor(Math.random() * 4);
          if (this.boardGridDOM[randY][randX].innerHTML == '') {
            let randDecider = Math.floor(Math.random() * 2);
            if (randDecider == 0) {
              value = 2;
            } else {
              value = 4;
            }
            let tile = new numberTile(randY, randX, value);
            this.boardGridTiles[randY][randX] = tile;
            this.boardGridDOM[randY][randX].innerHTML = value;
            inValidSpot = true;
          }
        }
        inValidSpot = false;
      }
    }
  },
  updateBoard() {
    //Make all tiles empty
    for (let boardY = 0; boardY < 4; boardY++) {
      for (let boardX = 0; boardX < 4; boardX++) {
        this.boardGridDOM[boardY][boardX].innerHTML = '';
      }
    }

    //Fill in tiles with corresponding values
    this.boardGridTiles.forEach(gridTile => {
      if (gridTile != null) {
        this.boardGridDOM[gridTile.y][gridTile.x].innerHTML = gridTile.value;
      }
    });
  },
  shiftUp() {
    this.tiles.forEach(tile => {
      for (let gridY = tile.y; gridY >= 0; gridY--) {
        if ((gridY - 1 >= 0) && (this.boardGrid[gridY - 1][tile.x].innerHTML == '')) {
          tile.y -= 1;
        }
      }
    });
    this.updateBoard();
  },
  shiftDown() {
    console.log(this.boardGrid);
    for (let boardY = 3; boardY >= 0; boardY--) {
      for (let boardX = 0; boardX < 4; boardX++) {
        if (this.boardGrid[boardY][boardX] != '') {
          console.log('num');
        }
      }
    }
  },
  shiftLeft() {

  },
  shiftRight() {

  }
};

class numberTile {
  constructor(y, x, value) {
    this.y = y;
    this.x = x;
    this.value = value;
  }
}

//Set up new game button
let newGameButton = document.querySelector('.new-game');
newGameButton.addEventListener('click', () => game.newGame());
