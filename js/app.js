//Listeners for arrow keys
document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    //up arrow
    game.spawnRandomNumbers();
  } else if (e.keyCode == '40') {
    //down arrow
  } else if (e.keyCode == '37') {
    //left arrow
  } else if (e.keyCode == '39') {
    //right arrow
  }
}

const game = {
  score: 0,
  highscore: 0,
  boardGrid: [],
  newGame() {
    this.initializeBoard();
    console.log(this.boardGrid);
  },
  initializeBoard() {
    //Initialize grid
    this.boardGrid = [];
    let gridItems = document.querySelectorAll('.grid-item');
    let gridRow = [];
    gridItems.forEach(element => {
      element.innerHTML = '';
      gridRow.push(element);
      if (gridRow.length === 4) {
        this.boardGrid.push(gridRow);
        gridRow = [];
      }
    });
  },
  spawnRandomNumbers() {
    let inValidSpot = false;
    let randY;
    let randX;
    let randDecider;
    let value;
    for (let a = 0; a < 2; a++) {
      while(!inValidSpot) {
        randY = Math.floor(Math.random() * 4);
        randX = Math.floor(Math.random() * 4);
        if (this.boardGrid[randY][randX].innerHTML == '') {
          let randDecider = Math.floor(Math.random() * 2);
          if (randDecider == 0) {
            value = 2;
          } else {
            value = 4;
          }
          console.log('Placed a '+value+' at Y:'+randY+' and X:'+randX);
          this.boardGrid[randY][randX].innerHTML = value;
          inValidSpot = true;
        }
      }
      inValidSpot = false;
    }
  },
  shiftUp() {

  },
  shiftDown() {

  },
  shiftLeft() {

  },
  shiftRight() {

  }
};

//Set up new game button
let newGameButton = document.querySelector('.new-game');
newGameButton.addEventListener('click', () => game.newGame());
