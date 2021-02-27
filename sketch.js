var colony = [];
var Newboids = [];

var sampleSpace = new Map();
//create the study space
const MUTP = 10;
const SIZE = 1200;
const PLATESIZE = SIZE - 400;
const LIP = 50;
const MAX = 200;
const SQR = 30;

var plate = null;
var pauseFlag = false;
var PickedUpAgent = null;
var firstMutagenFlag = false;
var firstMitosisFlag = false;
var secondaryMutagenFlag = false;
var secondaryMutagenInAntiBioticFlag = false;
var primaryMutagenFlag = false;
var primaryMutagenInAntiBioticFlag = false;
var next = null;
// let flag = 0;
// sampleSpace[startPos] = starter;
// space[SIZE/2][SIZE/2] = "@";


function setup() {
  textFont('Helvetica');
  var myCanvas = createCanvas(SIZE, SIZE);
  // myCanvas.parent('simdiv');
  
  dialog = new DialogBox();
  plate = new Plate(SQR, PLATESIZE, 1, 1);
  pauseFlag = false;
  sidepanel = new SidePanel(SIZE);
  next = createButton("Next");
  next.position(1040, 1050);
  next.mouseClicked(incrementStage);
  next.style("font-size", "25px");
  next.style('background-color',255);
  next.size(100);
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
  dialog.show();

}

// function doubleClick() {
//   // colony.push( );
//   console.log([mouseX, mouseY])
//   plate.addAgent(new Agent(new Genome([new Gene("G"), new Gene("T"), new Gene("T")]), mouseX, mouseY, 1));
//   // colony.push(a);
//   return false;
// }

function keyTyped() {
  if (key == 'p') {
    PickedUpAgent = new Agent(new Genome([new Gene("G"), new Gene("T"), new Gene("T")]), mouseX, mouseY);
  }
}

function mouseClicked() {
  console.log([mouseX, mouseY]);
  // check if trying to pick up a bacterium

  let x = floor((mouseX - LIP)/(PLATESIZE/SQR));
  let y = floor((mouseY - LIP)/(PLATESIZE/SQR));
  
  if (x > SQR || y > SQR) {
    //if on the sequencer
    if (p5.Vector.dist(createVector(mouseX, mouseY), createVector(1025, 350)) < 35) {
      if (PickedUpAgent) {
        PickedUpAgent = sidepanel.sequencer.SequenceAgent(PickedUpAgent);
      } else {
        PickedUpAgent = sidepanel.sequencer.getAgent();
        sidepanel.sequencer.releaseAgent();
      }
    } else if (p5.Vector.dist(createVector(mouseX, mouseY), createVector(1100, 350)) < 15) {
      if (PickedUpAgent) {
        PickedUpAgent = sidepanel.sequencer.addCMPAgent(PickedUpAgent);
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