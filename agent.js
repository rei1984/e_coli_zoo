
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
    setGene(val) {
        this.val = val;
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
        for (var i = 0; i < this.genes.length; i++) {
            // out += this.genes[i].toString() + ", ";
            out += this.genes[i].toString()
        } 
        // out += this.genes[this.genes.length - 1].toString();
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
        this.lifeSpan = 0;
        let g = this.genome.getGenes();
        this.resistance = 0.1;
        if (g[0].toString() == "C" && g[1].toString() == "A") {
            this.resistance = 0.99;
            if (g[2].toString() == "A") {
                this.resistance = 0.99999;
            }
        }
    }
    getGenome() {
        return this.genome;
    }
    split(mutationRate) {
        var newGenome = mutate(this.genome, mutationRate);
        
        var newID = this.id + this.position.x;

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

    getSeparation(proximalAgents, plateSize, platecentre) {
        let force = createVector(0, 0);
        for (var i = 0; i < proximalAgents.length; i++) {
            // let d = p5.Vector.dist(this.position, agent.position);
            // if (d > 0 && d < 20.0) {
            let agent = proximalAgents[i];
            // stroke("red");
            // line(agent.position.x, agent.position.y, this.position.x, this.position.y);
            let diff = p5.Vector.sub(this.position, agent.position);
            let d = p5.Vector.dist(this.position, agent.position);
            if (d > 0) {
                diff.normalize();
                diff.div(d);
                force.add(diff);
            }
        }

        if (proximalAgents.length > 0) {
            force.div(proximalAgents.length);
        }

        let d = p5.Vector.dist(this.position, platecentre);
        if (d > plateSize/2 - 25) {
            let diff = p5.Vector.sub(platecentre, this.position);
            diff.normalize();
            diff.div(d)
            diff.mult(1000);
            force.add(diff);
        }

        // As long as the vector is greater than 0
        if (force.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            force.normalize();
            force.mult(this.maxspeed);
            force.sub(this.velocity);
            force.limit(this.maxforce);
        }
        return force
    }



    // //TODO: Merge this and cohesion to save computation time

    updatePosition() {
        this.position.add(this.velocity);
        return this.position;
    }
    updateVelocity(proximalAgents, plateSize, platecentre) {
        // let coh = this.getCohesion(colony);
        // let coh = createVector(0, 0);
        let coh = createVector(Math.random(), Math.random());
        if (Math.random() < 0.5) {
            coh.x = coh.x*(-1);
        }
        if (Math.random() < 0.5) {
            coh.y = coh.y*(-1);
        }
        coh.normalize();
        coh.mult(this.maxspeed);
        coh.sub(this.velocity);
        coh.limit(this.maxspeed);
        coh.mult(0.2);

        // let seperation = vectorScalar(this.getSeparation(colony), 1 * this.instability);
        let sep = this.getSeparation(proximalAgents, plateSize, platecentre);

        var acceleration = createVector(0, 0);

        sep.mult(1.6);//1.4

        //if we have no need to seek or move away from another bacterium stop and don't move
        if (sep.x == 0 && sep.y == 0 && coh.x == 0 && coh.y == 0) {
            this.velocity.set(0, 0);
        } else {
            acceleration.add(sep);
            acceleration.add(coh);
            this.velocity.add(acceleration);
            this.velocity.limit(this.maxspeed);
            this.updatePosition();
        }

        


    }

    die() {
        if (this.lifeSpan > 20) {    
            console.log("DEATH");
            return true;
        }
        
        return false;
    }

    feed(val) {
        this.splitrecovery = this.splitrecovery + val;
        this.lifeSpan = this.lifeSpan + 0.1 - (val); 
    }

    antibiotic(val, plateSize) {
        let platecentre = createVector(LIP + plateSize/2, LIP + plateSize/2);
        let d = p5.Vector.dist(this.position, platecentre);
        if (d < (plateSize - 600)/2) {
            this.lifeSpan = this.lifeSpan + 10*(1-this.resistance); 
        } else if (d < (plateSize - 300)/2) {
                this.lifeSpan = this.lifeSpan + (1-this.resistance);
        }
    } 

    attempSplit(mutationRate) {
        let offspring = null;
        let m = Math.random();
        if (m < 0.01 && this.splitrecovery > 10) {
            // this.lifeSpan++;
            offspring = this.split(mutationRate);
            this.splitrecovery = 0;
        }
        return offspring;
    }

    run(proximalAgents, plateSize, platecentre) {
        // this.flock(boids);
        this.updateVelocity(proximalAgents, plateSize, platecentre);
        // this.borders();
        this.show();

        return true;
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
        if (this.position.x > 800) {
          this.position.x = 0;
        } else if (this.position.x < 0) {
          this.position.x = 800;
        }
        if (this.position.y > 800) {
          this.position.y = 0;
        } else if (this.position.y < 0) {
          this.position.y = 800;
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
        // stroke(200);
        
        let r = this.genome.getGenes()[0].toInteger();
        let g = this.genome.getGenes()[1].toInteger();
        let b = this.genome.getGenes()[2].toInteger();
        stroke(r, g, b, 150);
        fill(r, g, b);
        ellipse(this.position.x, this.position.y, 16, 16);
        
        // fill(r, g, b, 150);
        // ellipse(this.position.x, this.position.y, 40, 40);
    }
}

//TODO: mutation function
function mutate(genome, mutationRate) {
    // if (Math.round(Math.random() * (100)) > 5) return genome;

    // mutatedFlag = 1;

    let copy = genome.getGenes().slice();
    
    if (Math.random() < mutationRate) {
        // console.log("MUTATION!");
        //choose a base location for mutation
        let mutagen = Math.floor(Math.random() * copy.length);

        //mutate that space with a random base
        // let base = (["A", "C", "T", "G"][Math.floor(Math.random()*4)])
        switch(copy[mutagen].toString()) {
            case "A": copy[mutagen] = new Gene("T"); break;
            case "C": copy[mutagen] = new Gene("G"); break;
            case "T": copy[mutagen] = new Gene("A"); break;
            case "G": copy[mutagen] = new Gene("C"); break;
            
        }

        //set the gene
        

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
    return new Agent(startGenome, 400, 400, 1);
}
