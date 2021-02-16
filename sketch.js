var colony = [];
var Newboids = [];

var sampleSpace = new Map();
//create the study space
const MUTP = 10;
const SIZE = 1200;
const PLATESIZE = SIZE - 400;
const LIP = 50;
const MAX = 200;

var plate = null;
var pauseFlag = false;
// let flag = 0;
// sampleSpace[startPos] = starter;
// space[SIZE/2][SIZE/2] = "@";


function setup() {
  var myCanvas = createCanvas(SIZE, SIZE);
  // myCanvas.parent('simdiv');
  sidepanel = new SidePanel(SIZE);
  plate = new Plate(30, PLATESIZE, 1, 1);
  pauseFlag = false;
  // plate.setupLinkage()
//   for (let i = 0; i < MAX; i++) {
//     flock.push(new Agent);
//   }
  // colony.push(getStarterAgent());
}

function draw() {
  // scale(0.5);
  cursor('cursor.cur')
  stroke(200);  
  background(0);
  fill(60);
  plate.show();
  sidepanel.show(SIZE);
  fill(80);
  fill("purple");
  // circle(100 + (SIZE - 200)/2, 100 + (SIZE - 200)/2, 100)

  
  // // if (colony.length < 10) {
  // for (let i = 0; i < colony.length; i++) {
  //   let o = colony[i].run(colony, SIZE - 200);
  //   if (o != null) Newboids.push(o);
  // }
  // if (colony.length < 20) {
  //     colony = colony.concat(Newboids);
  //     Newboids = [];
  // }
  plate.updateAgents(pauseFlag, true, sidepanel.getMutationRate());

}

function mouseClicked() {
  // colony.push( );
  plate.addAgent(new Agent(new Genome([new Gene("G"), new Gene("T"), new Gene("T")]), mouseX, mouseY, 1));
  // colony.push(a);
  return false;
}

function keyPressed() {
  if (keyCode === 80) {
    pauseFlag = !pauseFlag;
  }
}

function mousePressed() {
  //check if trying to pick up a bacterium
  // let x = floor((agent.position.x - LIP)/(this.plateSize/this.size));
  // let y = floor((agent.position.y - LIP)/(this.plateSize/this.size));

  // for (let i = 0; i < plate.sectors[x][y].population.length; i++) {
  //   if (p5.Vector.dist(plate.sectors[x][y].population[i].position, createVector(mouseX, mouseY)) < 10) {
  //     plate.sectors[x][y].moveAgent(plate.sectors[x][y].population[i], null);
  //   }
  // }

  
}