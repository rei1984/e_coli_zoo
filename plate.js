function removeFromList(inArray, val) {
    let outArray = [];
    for (var i = 0; i < inArray.length; i++) {
        if (inArray[i] === val) {
            //removed
        } else {
            outArray.push(inArray[i]);
        }
    }
    return outArray;
}

class Sector {
    constructor(id, size, position) {
        this.population = [];
        // this.antibiotic = antibiotic;
        this.id = id;  
        this.position = position;
        this.neighbours = [];  
        this.proximalAgents = [];
        this.size = size;
        this.food = 1.0;
        // this.angle = createVector(position.x + size/2, position.y + size/2).heading();
        /* 
        1   2   3
        4   i   5
        6   7   8
        */
        if (id[0] > 0 && id[1] < size - 1) this.neighbours.push([id[0] - 1, id[1] + 1]);
        if (id[1] < size - 1) this.neighbours.push([id[0], id[1] + 1]);
        if (id[0] < size - 1 && id[1] < size - 1) this.neighbours.push([id[0] + 1, id[1] + 1]);

        if (id[0] > 0) this.neighbours.push([id[0] - 1, id[1]]);
        if (id[0] < size- 1) this.neighbours.push([id[0] + 1, id[1]]);

        if (id[0] > 0 && id[1] > 0) this.neighbours.push([id[0] - 1, id[1] - 1]);
        if (id[1] > 0) this.neighbours.push([id[0], id[1] - 1]);
        if (id[0] < size - 1 && id[1] > 0) this.neighbours.push([id[0] + 1, id[1] - 1]);

        
    }

    show(plateSize) {
        fill(this.food*255, 20);
        strokeWeight(1);
        stroke(this.food*255, 20);
        square(this.position.x, this.position.y, plateSize/this.size);
        
    }


    addProximalAgent(agent) {
        this.proximalAgents.push(agent);
    }

    setupLinkage(sectors) {
        //replace the index with a reference to the sector
        for (var i = 0; i < this.neighbours.length; i++) {
            this.neighbours[i] = sectors[this.neighbours[i][0]][this.neighbours[i][1]];
        }
    }

    //adds an agent to the sector and informs neighbours of arrival
    addAgent(agent) {
        // console.log("adding agent " + agent.id + " to " + this.id);
        this.population.push(agent);
        // console.log(this.population);
        // console.log(this)
        // console.log(this.neighbours[0].id);
        // console.log(this.neighbours[1].id);
        this.proximalAgents.push(agent); //agent is already there
        for (var i = 0; i < this.neighbours.length; i++) {
            // console.log(this.id);
            // console.log(this.neighbours[i].id);
            //ensure all neighbours know of the agent
            this.neighbours[i].proximalAgents.push(agent);
        }
        // console.log("DONE");
        return true;
    }

    //removes and agent and informs neighbours of departure
    moveAgent(agent, sink) {
        this.proximalAgents = removeFromList(this.proximalAgents, agent);
        for (var i = 0; i < this.neighbours.length; i++) {
            
            // this.neighbours[i];
            // console.log(ref.id);
            // console.log(sink);
            this.neighbours[i].proximalAgents = removeFromList(this.neighbours[i].proximalAgents, agent);
            if (this.neighbours[i].isEqual(sink)) { 
                this.neighbours[i].addAgent(agent);
            }

        }
        this.population = removeFromList(this.population, agent);
        // console.log(this);
        // console.log(sink);
        

        return true;
    }

    killAgent(agent) {
        this.neighbours.forEach(function(ref) {
            ref.proximalAgents = removeFromList(ref, agent);
        })
        this.population = removeFromList(this.population, agent);
        this.proximalAgents = removeFromList(this.proximalAgents, agent);
        return true;       
    }

    getNeighbours() {return this.neighbours;}

    update(sectors, plateSize, platecentre, size, pauseFlag, gameFlag, mutationRate) { 
        //for each agent in the sector
        this.show(plateSize);
        if (this.population.length == 0 && this.food < 0.99) this.food = this.food + 0.01;
        for (var i = 0; i < this.population.length; i++) {
            // console.log("wpp")
            let agent = this.population[i];

            // console.log("updating agent " + agent.id);

            //display the agent
            agent.show();

            if(!pauseFlag) {
                //update and move
                agent.run(this.proximalAgents, plateSize, platecentre);

                if (gameFlag) {

                    agent.antibiotic(this.resistance, plateSize)

                    //if agent should die kill it
                    if (agent.die()) {
                        this.killAgent(agent);
                    }

                    //feed agent
                    agent.feed(this.food * 0.1);

                    //deduct location fitness
                    this.food = this.food * 0.99;
                    

                    //if agent can split
                    let offspring = agent.attempSplit(mutationRate);
                    if (offspring) {
                        // console.log("SPLIT")
                        this.addAgent(offspring);
                    }
                    
                    //recalculate the sector id from updated position
                    let secid = [floor((agent.position.x - LIP)/(plateSize/size)), floor((agent.position.y - LIP)/(plateSize/size))];
                    if (!(secid[0] === this.id[0] && secid[1] === this.id[1])) {
                        // console.log("agent " + agent.id + " moving sector from " + this.id + " to " + secid);
                        // let sector = sectors[secid[0], secid[1]];
                        //move from here to sink sector
                        this.moveAgent(agent, sectors[secid[0]][secid[1]]);
                        // console.log(this);
                        // console.log(sectors[secid[0]][secid[1]]);
                    }
                }
            }
        }
    }

    isEqual(sector) {
        if (sector == null) return false;
        return (sector.id[0] == this.id[0] && sector.id[1] == this.id[1]);
    }



}

class Plate {

    constructor(size, plateSize, startingfitness, effect) {
        this.sectors = [];
        this.plateSize = plateSize;
        this.platecentre = createVector(LIP + plateSize/2, LIP + plateSize/2);
        this.size = size;
        console.log("##");
        for (var i = 0; i < size; i++) {
            this.sectors[i] = [];
            for (var j = 0; j < size; j++) {
                this.sectors[i][j] = new Sector([i, j], size, createVector(LIP + i*(this.plateSize/this.size), LIP + j*(this.plateSize/this.size)));
            }
        }

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                this.sectors[i][j].setupLinkage(this.sectors);
            }
        }

        this.effect = effect;
        this.totalPopulation = 0;
    }

    addAgent(agent) {
        let x = floor((agent.position.x - LIP)/(this.plateSize/this.size));
        let y = floor((agent.position.y - LIP)/(this.plateSize/this.size));
        // console.log(x)
        // console.log(y)
        // this.sectors[x][y].proximalAgents.push(agent);
        this.sectors[x][y].addAgent(agent);
        // if () console.log("succss");
        this.totalPopulation++;
    }

    updateAgents(pauseFlag, gameFlag, mutationRate) {
        // blendMode(BLEND);
        let S = [];
        let P = [];
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this.sectors[i][j].update(this.sectors, this.plateSize, this.platecentre, this.size, pauseFlag, gameFlag, mutationRate);
                // if (this.sectors[i][j].population > 0) {
                //     angles.push({angle: this.sectors[i][j].angle, position: this.sectors[i][j].position});
                // }
            }
        }
        blendMode(BLEND);
        // if (angles.length > 3) {
        //     angles.sort((a, b)=>(a.angle > b.angle) ? 1 : -1);
        //     for (var i=0; i<angles.length; i++) {
        //         let next = angles[i+1];
        //         let nextnext = angles[i+2];
        //         if (i == angles.length - 2) {
        //             next = angles[i+1];
        //             nextnext = angles[0];
        //         } else if (i == angles.length - 1) {
        //             next = angles[0];
        //             nextnext = angles[1];
        //         }
        //         if (p5.Vector.sub(angles[i].position, next.position).heading() >= p5.Vector.sub(angles[i].position, nextnext.position).heading()) {
        //             poly.push(next.position);
        //         }
        //     }
        //     strokeWeight(5);
        //     fill("green");
        //     beginShape();
        //     for (var i = 0; i < poly.length; i++) {
        //         curveVertex(poly[i].x, poly[i].y);
        //     }
        //     endShape();
        //     strokeWeight(1);
        // }
    }

    show() {
        let q = this.plateSize/this.size;
        strokeWeight(1);
        stroke(200);
        fill(51);
        rect(LIP, LIP, this.plateSize, this.plateSize);
        circle(LIP + this.plateSize/2, LIP + this.plateSize/2, this.plateSize);
        fill(60);
        circle(LIP + this.plateSize/2, LIP + this.plateSize/2, this.plateSize - 300);
        fill(80);
        circle(LIP + this.plateSize/2, LIP + this.plateSize/2, this.plateSize - 600);
        // for (var i = 0; i < this.sectors.length; i++) {
        //     line(100 + i*q + q, 100, 100 + i*q + q, 900);
        //     line(100, 100 + i*q + q, 900, 100 + i*q + q);
        // }
    }
}