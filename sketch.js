var colony = [];
var Newboids = [];

var sampleSpace = new Map();
//create the study space
const MUTP = 10;
const SIZE = 1000;
const MAX = 200;

var plate = null;
// let flag = 0;
// sampleSpace[startPos] = starter;
// space[SIZE/2][SIZE/2] = "@";


function setup() {
  createCanvas(SIZE, SIZE);
  plate = new Plate(SIZE - 200, 1, 1);
//   for (let i = 0; i < MAX; i++) {
//     flock.push(new Agent);
//   }
  // colony.push(getStarterAgent());
}

function draw() {
  background(51);
  fill(60);
  plate.show();
  fill(80);
  fill("purple");
  // circle(100 + (SIZE - 200)/2, 100 + (SIZE - 200)/2, 100)

  
  // if (colony.length < 10) {
  for (let i = 0; i < colony.length; i++) {
    let o = colony[i].run(colony, SIZE - 200);
    if (o != null) Newboids.push(o);
  }
  if (colony.length < 20) {
      colony = colony.concat(Newboids);
      Newboids = [];
  }

}

function mouseClicked() {
  colony.push( new Agent(new Genome([new Gene("A"), new Gene("C"), new Gene("C")]), mouseX, mouseY, 1));
  // colony.push(a);
  return false;
}