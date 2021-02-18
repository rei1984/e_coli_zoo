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
var PickedUpAgent = null;
// let flag = 0;
// sampleSpace[startPos] = starter;
// space[SIZE/2][SIZE/2] = "@";


function setup() {
  textFont('Helvetica');
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
  if (PickedUpAgent) {
    PickedUpAgent.show();
    PickedUpAgent.position = createVector(mouseX, mouseY);
  }

}

// function doubleClick() {
//   // colony.push( );
//   console.log([mouseX, mouseY])
//   plate.addAgent(new Agent(new Genome([new Gene("G"), new Gene("T"), new Gene("T")]), mouseX, mouseY, 1));
//   // colony.push(a);
//   return false;
// }

function keyPressed() {
  if (keyCode === 80) {
    pauseFlag = !pauseFlag;
  }
}

function mouseClicked() {
  // check if trying to pick up a bacterium

  let x = floor((mouseX - LIP)/(PLATESIZE/30));
  let y = floor((mouseY - LIP)/(PLATESIZE/30));
  
  if (x > 30 || y > 30 ) {
    //if on the sequencer
    if (p5.Vector.dist(createVector(mouseX, mouseY), createVector(1025, 300)) < 35) {
      if (PickedUpAgent) {
        sidepanel.sequencer.SequenceAgent(PickedUpAgent);
        PickedUpAgent = null;
      } else {
        PickedUpAgent = sidepanel.sequencer.getAgent();
        sidepanel.sequencer.releaseAgent();
      }
    } else if (p5.Vector.dist(createVector(mouseX, mouseY), createVector(1100, 300)) < 15) {
      if (PickedUpAgent) {
        sidepanel.sequencer.addCMPAgent(PickedUpAgent);
        PickedUpAgent = null;
      } else {
        PickedUpAgent = sidepanel.sequencer.getCMPAgent();
        sidepanel.sequencer.releaseCMPAgent();
      }     
    } else {

    }
  } else {
    let i = 0;
    if (PickedUpAgent) {
      plate.addAgent(PickedUpAgent, mouseX, mouseY, 1);
      PickedUpAgent = null;
    } else {
      while (i < plate.sectors[x][y].population.length) {
        if (p5.Vector.dist(plate.sectors[x][y].population[i].position, createVector(mouseX, mouseY)) < 10) {
          console.log(plate.sectors[x][y].population[i]);
          PickedUpAgent = plate.sectors[x][y].population[i];
          plate.sectors[x][y].moveAgent(plate.sectors[x][y].population[i], null);
          return;
        }
        i++;
      }  
    }  
  }
  
}