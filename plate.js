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
    constructor(id, size) {
        this.population = [];
        // this.antibiotic = antibiotic;
        this.id = id;  
        this.neighbours = [];  
        this.proximalAgents = [];
        this.size = size;
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
        console.log("adding agent " + agent.id + " to " + this.id);
        this.population.push(agent);
        console.log(this.population);
        console.log(this)
        // console.log(this.neighbours[0].id);
        // console.log(this.neighbours[1].id);
        this.proximalAgents.push(agent); //agent is already there
        for (var i = 0; i < this.neighbours.length; i++) {
            // console.log(this.id);
            // console.log(this.neighbours[i].id);
            //ensure all neighbours know of the agent
            this.neighbours[i].proximalAgents.push(agent);
        }
        console.log("DONE");
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
        console.log(this);
        console.log(sink);
        

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

    update(sectors, plateSize, size) { 
        //for each agent in the sector
        for (var i = 0; i < this.population.length; i++) {
            // console.log("wpp")
            let agent = this.population[i];

            console.log("updating agent " + agent.id);

            //display the agent
            agent.show();
            //update and move
            agent.run(this.proximalAgents, this.plateSize);

            //if agent should die kill it
            if (agent.die()) {
                this.killAgent(agent);
            }
            //if agent can split
            let offspring = agent.attempSplit();
            if (offspring) {
                console.log("SPLIT")
                this.addAgent(offspring);
            }
            
            //recalculate the sector id from updated position
            let secid = [floor((agent.position.x - 100)/(plateSize/size)), floor((agent.position.y - 100)/(plateSize/size))];
            if (!(secid[0] === this.id[0] && secid[1] === this.id[1])) {
                console.log("agent " + agent.id + " moving sector from " + this.id + " to " + secid);
                // let sector = sectors[secid[0], secid[1]];
                //move from here to sink sector
                this.moveAgent(agent, sectors[secid[0]][secid[1]]);
                console.log(this);
                console.log(sectors[secid[0]][secid[1]]);
            }
        }
    }

    isEqual(sector) {
        return (sector.id[0] == this.id[0] && sector.id[1] == this.id[1]);
    }



}

class Plate {

    constructor(size, plateSize, startingfitness, effect) {
        this.sectors = [];
        this.plateSize = plateSize;
        this.size = size;
        console.log("##");
        for (var i = 0; i < size; i++) {
            this.sectors[i] = [];
            for (var j = 0; j < size; j++) {
                this.sectors[i][j] = new Sector([i, j], size);
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
        let x = floor((agent.position.x - 100)/(this.plateSize/this.size));
        let y = floor((agent.position.y - 100)/(this.plateSize/this.size));
        // console.log(x)
        // console.log(y)
        // this.sectors[x][y].proximalAgents.push(agent);
        this.sectors[x][y].addAgent(agent)
        // if () console.log("succss");
        this.totalPopulation++;
    }

    updateAgents() {

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this.sectors[i][j].update(this.sectors, this.plateSize, this.size);
            }
        }

    }

    show() {
        let q = this.plateSize/this.size;
        color(20);
        rect(100, 100, this.plateSize, this.plateSize);
        circle(100 + this.plateSize/2, 100 + this.plateSize/2, this.plateSize);
        for (var i = 0; i < this.sectors.length; i++) {
            line(100 + i*q + q, 100, 100 + i*q + q, 900);
            line(100, 100 + i*q + q, 900, 100 + i*q + q);
        }
    }
}