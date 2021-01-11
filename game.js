const { off } = require("process");

//create the study space
const MUTP = 10;
const SIZE = 40;
var mutatedFlag = 0;
var counter = 0;
var colony = [];
var space = new Array(SIZE);
for (var y = 0; y < space.length; y++) {
    space[y] = new Array(SIZE);
    for (var x = 0; x < space[y].length; x++) {
        if (y == 0 || y == space[y].length - 1) {
            space[y][x] = 1;
        } else {
            space[y][x] = " ";
        }
    }
    space[y][0] = 1;
    space[y][SIZE] = 1;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isOccupied() {
        return space[x][y];
    }
}

class Gene {
    constructor(val) {
        this.val = val;
    }
    toString() {
        return this.val;
    }
}

class Genome {
    constructor() {
        this.genes = [];
    }
    //get the list of genes
    getGenes() {
        return this.genes;
    }
    //set a gene at position x to value nctd
    setGene(x, nctd) {
        if (x >= this.genes.length || x < 0) return 0;
        this.genes[x] = nctd;
        return 1;
    }
    addGene(nctd) {
        this.genes.push(nctd);
    }
    toString() {
        var out = "";
        for (var i = 0; i < this.genes.length - 1; i++) {
            out += this.genes[i].toString() + ", ";
        } 
        out += this.genes[this.genes.length - 1].toString();
        return out;
    }
}

class Agent {
    constructor(genome, pos, id) {
        this.genome = genome;
        this.position = pos;
        this.id = id;
    }
    getGenome() {
        return this.genome;
    }
    split() {
        //get a location for split
        var loc = getSplitSpace(this.position);
        
        if (loc == null) return null;
        //create new genome copy
        var newGenome = mutate(this.genome);
        
        var newID = counter++;

        var offspring = new Agent(newGenome, loc, newID);

        console.log(this.id + " SPLIT into " + newID + " with GENOME:[ " + newGenome.toString() + " ]...");

        // space[loc.x][loc.y] = offspring;
        space[loc.x][loc.y] = offspring.toString();

        colony.push(offspring);

        return offspring;
    }
    toString() {
        let no = 0;
        for (var i = 0; i < this.genome.getGenes().length; i++) {
            no += this.genome.getGenes()[i].charCodeAt(0);
        }
        no = (no % 48) + 48;
        return String.fromCharCode(no);
    }
}

function getSplitSpace(pos) {

    let possibleLocs = [];

    if (space[pos.x + 1][pos.y] == " ") possibleLocs.push(new Point(pos.x + 1, pos.y));
    if (space[pos.x - 1][pos.y] == " ") possibleLocs.push(new Point(pos.x - 1, pos.y));
    if (space[pos.x][pos.y + 1] == " ") possibleLocs.push(new Point(pos.x, pos.y + 1));
    if (space[pos.x][pos.y - 1] == " ") possibleLocs.push(new Point(pos.x, pos.y - 1));

    if (possibleLocs.length == 0) return null;

    return (possibleLocs[Math.floor(Math.random()*possibleLocs.length)]);

}

//TODO: mutation function
function mutate(genome) {
    if (Math.round(Math.random() * (100)) > MUTP) return genome;

    mutatedFlag = 1;
    
    //choose a base location for mutation
    let mutagen = (Math.round(Math.random() * (genome.getGenes().length)) > genome.getGenes().length);

    //mutate that space with a random base
    let base = (["A", "C", "T", "G"][Math.floor(Math.random()*4)])

    //set the gene
    genome.setGene(mutagen, base);

    //return the altered genome
    return genome;
}

function printColony() {
    arrText = '';
    for (var i = 0; i < space.length; i++) {
        for (var j = 0; j < space[i].length; j++) {
            arrText+=space[i][j].toString() + ' ';
        }
        console.log(arrText);
        arrText='';
    }
}

var startGenome = new Genome();
startGenome.addGene("A");
startGenome.addGene("C");
startGenome.addGene("C");
startGenome.addGene("T");
startGenome.addGene("G");
startGenome.addGene("G");
startGenome.addGene("A");
startGenome.addGene("T");
startGenome.addGene("T");
startGenome.addGene("A");
startGenome.addGene("A");
colony.push(new Agent(startGenome, new Point(SIZE/2, SIZE/2)))
space[SIZE/2][SIZE/2] = "@";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// colony[0].split();
// printColony();
// let temp = Math.round(Math.random() * (100));
// console.log(temp);
// console.log(temp < MUTP);
let i = 0; 
while (i < 400 && mutatedFlag == 0) { 
  task(i); 
   i++; 
} 
function task(i) { 
  setTimeout(function() { 
    console.clear();
    
    colony[Math.floor(Math.random()*colony.length)].split();
     printColony();
  }, 30 * i); 
} 

// frame();

// while(colony.length < 400) {
//     for (var i = 0; i < colony.length; i++) {
//         console.clear();
//         sleep(2000);
//         colony[i].split();
//         printColony();
//     }
// }