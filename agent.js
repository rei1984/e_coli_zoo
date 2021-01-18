
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
    constructor(genes) {
        this.genes = genes;
    }
    // constructor(genes) {
    //     this.genes = genes;
    // }
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
    constructor(genome, x, y, id) {
        this.genome = genome;
        // this.position = createVector(x, y);
        this.id = id;
        this.velocity = new p5.Vector(0, 0);
        this.position = createVector(x, y);
        this.r = 3.0;
        this.maxspeed = 0.5;    // Maximum speed
        this.maxforce = 0.02; // Maximum steering force
        this.splitrecovery = 100;
    }
    getGenome() {
        return this.genome;
    }
    split() {
        //get a location for split
        // var loc = this.getSplitSpace();
        // console.log("Splitting...");
        // console.log(loc);

        // if (loc == null) return null;

        // console.log("Splitting going ahead");
        //create new genome copy
        
        var newGenome = mutate(this.genome);
        
        var newID = 2;

        let r = Math.random();

        if (r < 0.25) {
            var offspring = new Agent(newGenome, this.position.x + 1, this.position.y + 1, newID);
        } else if (r < 0.5) {
            var offspring = new Agent(newGenome, this.position.x + 1, this.position.y - 1, newID);
        } else if (r < 0.75) {
            var offspring = new Agent(newGenome, this.position.x - 1, this.position.y + 1, newID);
        } else {
            var offspring = new Agent(newGenome, this.position.x - 1, this.position.y - 1, newID);
        }

        

        console.log(this.id + " SPLIT into " + newID + " with GENOME:[ " + newGenome.toString() + " ]...");

        // space[loc.x][loc.y] = offspring;
        // space[loc.x][loc.y] = offspring.toString();

        // colony.push(offspring);

        return offspring;
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        return steer;
      }

    getCohesion(colony) {
        let neighbordist = 100;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < colony.length; i++) {
          let d = p5.Vector.dist(this.position, colony[i].position);
          if ((d > 0) && (d < neighbordist)) {
            sum.add(colony[i].position); // Add location
            count++;
          }
        }
        if (count > 0) {
          sum.div(count);
          return this.seek(sum); // Steer towards the location
        } else {
          return createVector(0, 0);
        }
    }
    //TODO: Merge this and cohesion to save computation time
    getSeparation(colony) {
        let desiredseparation = 20.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < colony.length; i++) {
          let d = p5.Vector.dist(this.position, colony[i].position);
          // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
          if ((d > 0) && (d < desiredseparation)) {
            // Calculate vector pointing away from neighbor
            let diff = p5.Vector.sub(this.position, colony[i].position);
            diff.normalize();
            diff.div(d); // Weight by distance
            steer.add(diff);
            count++; // Keep track of how many
          }
        }
        // Average -- divide by how many
        if (count > 0) {
          steer.div(count);
        }
      
        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
          // Implement Reynolds: Steering = Desired - Velocity
          steer.normalize();
          steer.mult(this.maxspeed);
          steer.sub(this.velocity);
          steer.limit(this.maxforce);
        }
        return steer;
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
    getActingForces(colony) {
        let cohesion = this.getCohesion(colony);
        // let seperation = vectorScalar(this.getSeparation(colony), 1 * this.instability);
        let seperation = this.getSeparation(colony);

        sep.mult(1.4);
        // ali.mult(1.0);
        coh.mult(1.1);
        
        if (sep.x == 0 && sep.y == 0 && coh.x == 0 && coh.y == 0) {
            this.acceleration.set(0, 0);
            this.velocity.set(0, 0);
        }

        return ActingForces;
    }

    updatePosition() {
        this.position.add(this.velocity);
        return this.position;
    }
    updateVelocity(colony) {
        // let coh = this.getCohesion(colony);
        let coh = createVector(0, 0);
        // let seperation = vectorScalar(this.getSeparation(colony), 1 * this.instability);
        let sep = this.getSeparation(colony);

        var acceleration = createVector(0, 0);

        sep.mult(1.8);//1.4
        // ali.mult(1.0);
        // coh.mult(1);

        //if we have no need to seek or move away from another bacterium stop and don't move
        if (sep.x == 0 && sep.y == 0 && coh.x == 0 && coh.y == 0) {
            this.velocity.set(0, 0);
        } else {
            acceleration.add(sep);
            // acceleration.add(coh);
            this.velocity.add(acceleration);
            this.velocity.limit(this.maxspeed);
            this.updatePosition();
        }

        


    }



    run(colony) {
        // this.flock(boids);
        let offspring = null;
        this.updateVelocity(colony);
        this.borders();
        this.show();
        let m = Math.random();
        if (m < 0.01 && colony.length < 20 && this.splitrecovery > 100) {
          offspring = this.split();
          this.splitrecovery = 0;
        }
        if (m < 0.02 && m > 0.017) {
          var i = colony.indexOf(this);
          colony.splice(i, 1);
          return null;
        }
        this.splitrecovery++;
        return offspring;
        // this.split();
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

    borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
    }
    getSplitSpace() {

        return [this.position[0] + 5, this.position[1] + 5];
    
    }

    show() {
        // strokeWeight(10);
        // fill(127, 127);
        stroke(200);
        let r = this.genome.getGenes()[0].toInteger();
        let g = this.genome.getGenes()[1].toInteger();
        let b = this.genome.getGenes()[2].toInteger();
        fill(r, g, b);
        ellipse(this.position.x, this.position.y, 16, 16);
    }
}

//TODO: mutation function
function mutate(genome) {
    // if (Math.round(Math.random() * (100)) > 5) return genome;

    // mutatedFlag = 1;

    let copy = genome.getGenes().slice();
    
    if (Math.random() < 0.05) {
        console.log("MUTATION!");
        //choose a base location for mutation
        let mutagen = Math.floor(Math.random() * copy.length);

        //mutate that space with a random base
        let base = (["A", "C", "T", "G"][Math.floor(Math.random()*4)])

        //set the gene
        copy[mutagen] = new Gene(base);

    }

    //return the altered genome
    return new Genome(copy);
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

function getStarterAgent() {
    var startGenome = new Genome([new Gene('A'), new Gene('C'), new Gene('C')]);
    // startGenome.addGene(new Gene("A"));
    // startGenome.addGene(new Gene("C"));
    // startGenome.addGene(new Gene("C"));
    // startGenome.addGene(new Gene("T"));
    // startGenome.addGene(new Gene("G"));
    // startGenome.addGene(new Gene("G"));
    // startGenome.addGene(new Gene("A"));
    // startGenome.addGene(new Gene("T"));
    // startGenome.addGene(new Gene("T"));
    // startGenome.addGene(new Gene("A"));
    // startGenome.addGene(new Gene("A"));
    // let startPos = [300, 300];
    return new Agent(startGenome, 300, 300, 1);
}
