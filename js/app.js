//Listeners for arrow keys
document.onkeyup = checkKey;
function checkKey(e) {

  e = e || window.event;
  //Prevents window scrolling when arrow keys are clicked
  e.preventDefault();
  if (e.keyCode == '87') { // W key (Up)
    game.shiftUp();
  } else if (e.keyCode == '83') { // S key (Down)
    game.shiftDown();
  } else if (e.keyCode == '65') { // A key (Left)
    game.shiftLeft();
  } else if (e.keyCode == '68') { // D key (Right)
    game.shiftRight();
  } else if (e.keyCode == '78') { //hit n to spawn numbers for testing
    game.spawnRandomNumbers();
  } else if (e.keyCode == '84') { // T key for test case
    game.makeTestCase();
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
    for (let x = 0; x < 2; x++) {
      this.spawnRandomNumbers();
    }
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
        tileRow.push(new numberTile(null, null, null, null));
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
            let tile = new numberTile(randY, randX, value, false);
            this.boardGridTiles[randY][randX] = tile;
            this.boardGridDOM[randY][randX].innerHTML = value;
            inValidSpot = true;
          }
        }
        inValidSpot = false;
    }
  },
  updateBoard() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.boardGridTiles[y][x].value != null) {
          this.boardGridDOM[y][x].innerHTML = this.boardGridTiles[y][x].value;
        } else {
          this.boardGridDOM[y][x].innerHTML = '';
        }
      }
    }
  },
  shiftUp() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.boardGridTiles[y][x].value != null) {
          //Creates a temporary tile for the value so that it can be shifted
          let tempTile = this.boardGridTiles[y][x];

          //The variable shifting keeps the loops runnnig so that the certain tile moves
          //in the right direction until it encounters and obstacle
          let shifting = true;
          //Numbers merged prevents a tile from being merged multiple times in one move.
          let numbersMerged = false;

          while(shifting) {
            //If tile encounters the edge of the grid, stop shifting
            if (tempTile.y - 1 < 0) {
              shifting = false;
            } else if (this.boardGridTiles[tempTile.y - 1][tempTile.x].value != null) { //If shifting tile encounters another tile on the grid
              if (this.boardGridTiles[tempTile.y - 1][tempTile.x].value == tempTile.value) { //If shifting tile's value is the same as the other tile, double value of other tile.
                if (!this.boardGridTiles[tempTile.y - 1][tempTile.x].hasBeenMerged) { //If that other tile has already been merged this turn, then don't merge again
                  this.boardGridTiles[tempTile.y - 1][tempTile.x].value *= 2;
                  this.boardGridTiles[tempTile.y - 1][tempTile.x].hasBeenMerged = true;
                  numbersMerged = true;
                }
                shifting = false;
              } else {
                shifting = false;
              }
            } else {
              tempTile.y -= 1; //If none of the other cases apply, then shift the tile
            }
          }

          this.boardGridTiles[y][x] = new numberTile(null, null, null, null);

          if(!numbersMerged) { //If numbers did not merge, then place shifting tile in its new location
            this.boardGridTiles[tempTile.y][tempTile.x] = tempTile;
          }
        }
      }
    }
    this.resetHasBeenMerged();
    this.updateBoard();
  },
  shiftDown() {
    for (let y = 3; y >= 0; y--) {
      for (let x = 0; x < 4; x++) {
        if (this.boardGridTiles[y][x].value != null) {
          let tempTile = this.boardGridTiles[y][x];

          let shifting = true;
          let numbersMerged = false;

          while(shifting) {
            if (tempTile.y + 1 > 3) {
              shifting = false;
            } else if (this.boardGridTiles[tempTile.y + 1][tempTile.x].value != null) {
              if (this.boardGridTiles[tempTile.y + 1][tempTile.x].value == tempTile.value) {
                if (!this.boardGridTiles[tempTile.y + 1][tempTile.x].hasBeenMerged) {
                  this.boardGridTiles[tempTile.y + 1][tempTile.x].value *= 2;
                  this.boardGridTiles[tempTile.y + 1][tempTile.x].hasBeenMerged = true;
                  numbersMerged = true;
                }
                shifting = false;
              } else {
                shifting = false;
              }
            } else {
              tempTile.y += 1;
            }
          }

          this.boardGridTiles[y][x] = new numberTile(null, null, null, null);

          if(!numbersMerged) {
            this.boardGridTiles[tempTile.y][tempTile.x] = tempTile;
          }
        }
      }
    }
    this.resetHasBeenMerged();
    this.updateBoard();
  },
  shiftLeft() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.boardGridTiles[y][x].value != null) {
          let tempTile = this.boardGridTiles[y][x];

          let shifting = true;
          let numbersMerged = false;

          while(shifting) {
            if (tempTile.x - 1 < 0) {
              shifting = false;
            } else if (this.boardGridTiles[tempTile.y][tempTile.x - 1].value != null) {
              if (this.boardGridTiles[tempTile.y][tempTile.x - 1].value == tempTile.value) {
                if (!this.boardGridTiles[tempTile.y][tempTile.x - 1].hasBeenMerged) {
                  this.boardGridTiles[tempTile.y][tempTile.x - 1].value *= 2;
                  this.boardGridTiles[tempTile.y][tempTile.x - 1].hasBeenMerged = true;
                  numbersMerged = true;
                }
                shifting = false;
              } else {
                shifting = false;
              }
            } else {
              tempTile.x -= 1;
            }
          }

          this.boardGridTiles[y][x] = new numberTile(null, null, null, null);

          if(!numbersMerged) {
            this.boardGridTiles[tempTile.y][tempTile.x] = tempTile;
          }
        }
      }
    }
    this.resetHasBeenMerged();
    this.updateBoard();
  },
  shiftRight() {
    for (let y = 0; y < 4; y++) {
      for (let x = 3; x >= 0; x--) {
        if (this.boardGridTiles[y][x].value != null) {
          let tempTile = this.boardGridTiles[y][x];

          let shifting = true;
          let numbersMerged = false;

          while(shifting) {
            if (tempTile.x + 1 > 3) {
              shifting = false;
            } else if (this.boardGridTiles[tempTile.y][tempTile.x + 1].value != null) {
              if (this.boardGridTiles[tempTile.y][tempTile.x + 1].value == tempTile.value) {
                if (!this.boardGridTiles[tempTile.y][tempTile.x + 1].hasBeenMerged) {
                  this.boardGridTiles[tempTile.y][tempTile.x + 1].value *= 2;
                  this.boardGridTiles[tempTile.y][tempTile.x + 1].hasBeenMerged = true;
                  numbersMerged = true;
                }
                shifting = false;
              } else {
                shifting = false;
              }
            } else {
              tempTile.x += 1;
            }
          }

          this.boardGridTiles[y][x] = new numberTile(null, null, null, null);

          if(!numbersMerged) {
            this.boardGridTiles[tempTile.y][tempTile.x] = tempTile;
          }
        }
      }
    }
    this.resetHasBeenMerged();
    this.updateBoard();
  },
  resetHasBeenMerged() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.boardGridTiles[y][x].hasBeenMerged = false;
      }
    }
  }
};

class numberTile {
  constructor(y, x, value, merged) {
    this.y = y;
    this.x = x;
    this.value = value;
    this.hasBeenMerged = merged
  }
}

//Set up new game button
let newGameButton = document.querySelector('.new-game');
newGameButton.addEventListener('click', () => game.newGame());
