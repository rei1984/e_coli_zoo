
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // isOccupied() {
    //     return space[x][y];
    // }
}

class Gene {
    constructor(val) {
        this.val = val;
    }
    toString() {
        return this.val;
    }
    toInteger() {
        switch (this.val) {
            case 'A': return 50;
            case 'C': return 100;
            case 'T': return 150;
            case 'G': return 255;
            default: return 0;
        }
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
        this.instability = Math.random();
        this.velocity = [0, 0];
        this.maxSpeed = 1;
        this.maxForce = 0.03;
    }
    getGenome() {
        return this.genome;
    }
    split() {
        //get a location for split
        var loc = this.getSplitSpace();
        // console.log("Splitting...");
        // console.log(loc);

        if (loc == null) return null;

        // console.log("Splitting going ahead");
        //create new genome copy
        var newGenome = mutate(this.genome);
        
        var newID = 2;

        var offspring = new Agent(newGenome, loc, newID);

        console.log(this.id + " SPLIT into " + newID + " with GENOME:[ " + newGenome.toString() + " ]...");

        // space[loc.x][loc.y] = offspring;
        // space[loc.x][loc.y] = offspring.toString();

        // colony.push(offspring);

        return offspring;
    }
    getCohesion(colony) {
        return [0, 0];
    }
    getSeparation(colony) {
        let idealSep = 10;
        let o = [0, 0];
        let count = 0;
        for (var c in colony) {
            let d = vectorDiff(this.position, c.position);
            if (d > 0 && d < idealSep) {
                let diff = VectorDiff(this.position, c.position);
                let norm = VectorNorm(diff);
                o = vectorSum(o, norm);
            }
        }

        // var o = [0, 0];
        // for (var c of colony) {
        //   let distVector = vectorDiff(this.position, c.position);
        //   let vNorm = vectorNorm(distVector);
        //   if (this != c && vNorm < 100) {
        //     o = vectorSum(o, vectorScalar(distVector, 1 / (vNorm * vNorm * vNorm)));
        //   }
        // }
        // return o;
      }
    getActingForces(colony) {
        let cohesion = this.getCohesion(colony);
        // let seperation = vectorScalar(this.getSeparation(colony), 1 * this.instability);
        let seperation = this.getSeparation(colony);
        let ActingForces = [];
        ActingForces.push(cohesion[0] + seperation[0]);
        ActingForces.push(cohesion[1] + seperation[1]);
        return ActingForces;
    }
    updateVelocity(colony) {
        let actingForces = this.getActingForces(colony);
        // console.log("Acting force = " + actingForces);
        this.velocity[0] = actingForces[0] + this.velocity[0];
        this.velocity[1] = actingForces[1] + this.velocity[1];
        return this.velocity;
    }
    updatePosition() {
        this.position = vectorSum(this.position, this.velocity);
        return this.position;
    }
    toString() {
        let no = 0;
        for (var i = 0; i < this.genome.getGenes().length; i++) {
            no += this.genome.getGenes()[i].toString().charCodeAt(0);
        }
        no = (no % 48) + 48;
        return String.fromCharCode(no);
    }
    edges() {
        if (this.position.x > 600) {
          this.position.x = 0;
        } else if (this.position.x < 0) {
          this.position.x = 600;
        }
        if (this.position.y > 600) {
          this.position.y = 0;
        } else if (this.position.y < 0) {
          this.position.y = 600;
        }
      }
    getSplitSpace() {

        return [this.position[0] + 5, this.position[1] + 5];
    
    }
        // let possibleLocs = [];
    
        
    
        // for (var i = 0; i < 3; i++) {
    
        //     if (space[pos.x + 5*i][pos.y] == " ") possibleLocs.push(new Point(pos.x + 5*i, pos.y));
        //     if (space[pos.x - 5*i][pos.y] == " ") possibleLocs.push(new Point(pos.x - 5*i, pos.y));
        //     if (space[pos.x][pos.y + 5*i] == " ") possibleLocs.push(new Point(pos.x, pos.y + 5*i));
        //     if (space[pos.x][pos.y - 5*i] == " ") possibleLocs.push(new Point(pos.x, pos.y - 5*i));
        
        // }
        // if (possibleLocs.length == 0) return null;
    
        // return (possibleLocs[Math.floor(Math.random()*possibleLocs.length)]);
    
        // return [pos.x][pos.y + 1];
    
    // }
    show() {
        strokeWeight(10);
        color('purple')
        // let r = this.genome.getGenes()[0].toInteger();
        // let g = this.genome.getGenes()[1].toInteger();
        // let b = this.genome.getGenes()[2].toInteger();
        // color(r, g, b);
        circle(this.position.x, this.position.y, 10);
    }
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