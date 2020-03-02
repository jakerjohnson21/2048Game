//Initialize Grid
let boardGrid = [];

let gridItems = document.querySelectorAll('.grid-item');

let gridRow = [];
gridItems.forEach(element => {
  gridRow.push(element);
  if (gridRow.length === 4) {
    boardGrid.push(gridRow);
    gridRow = [];
  }
});

//Listeners for arrow keys
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    //up arrow
  } else if (e.keyCode == '40') {
    //down arrow
  } else if (e.keyCode == '37') {
    //left arrow
  } else if (e.keyCode == '39') {
    //right arrow
  }
}
