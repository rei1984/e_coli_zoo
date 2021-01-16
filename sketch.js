var colony = [];

var sampleSpace = new Map();
//create the study space
const MUTP = 10;
const SIZE = 600;
const MAX = 200;

var startGenome = new Genome();
startGenome.addGene(new Gene("A"));
startGenome.addGene(new Gene("C"));
startGenome.addGene(new Gene("C"));
// startGenome.addGene(new Gene("T"));
// startGenome.addGene(new Gene("G"));
// startGenome.addGene(new Gene("G"));
// startGenome.addGene(new Gene("A"));
// startGenome.addGene(new Gene("T"));
// startGenome.addGene(new Gene("T"));
// startGenome.addGene(new Gene("A"));
// startGenome.addGene(new Gene("A"));
let startPos = [SIZE/2, SIZE/2];
let starter = new Agent(startGenome, startPos, 1);
colony.push(starter);
let flag = 0;
// sampleSpace[startPos] = starter;
// space[SIZE/2][SIZE/2] = "@";




function setup() {
  createCanvas(SIZE, SIZE);
//   for (let i = 0; i < MAX; i++) {
//     flock.push(new Agent);
//   }
}

function draw() {
  background(51);
  // if (colony.length < 10) {
    
    newAgents = [];
    for (let agent of colony) {
      // boid.(flock);
      agent.updateVelocity(colony);
      // console.log(agent.velocity);
      agent.updatePosition();
      agent.edges();
      if (colony.length < 10) {
      let offspring = agent.split();
      // console.log(offspring);
      newAgents.push(offspring);
      // console.log(newAgents);
      console.log(colony);
      }
      // agent.show();
      strokeWeight(10);
      // color('purple')
      let r = agent.genome.getGenes()[0].toInteger();
      let g = agent.genome.getGenes()[1].toInteger();
      let b = agent.genome.getGenes()[2].toInteger();
      color(r, g, b);
      circle(agent.position[0], agent.position[1], 10);
    }
    colony = colony.concat(newAgents);
  // }
  
  // color('purple');
  // circle(SIZE/2, SIZE/2, 10);
  // delay(1);
}