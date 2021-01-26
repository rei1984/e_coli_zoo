class Sector {
    constructor(id, size) {
        this.population = [];
        // this.antibiotic = antibiotic;
        this.id = id;  
        this.neighbours = [];  
        this.proximalAgents = [];
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

    setupLinkage(sectors) {
        //replace the index with a reference to the sector
        this.neighbours.forEach(function(ref) {
            if (ref != this.id) ref = sectors[ref[0]][ref[1]];
        })
    }

    //adds an agent to the sector and informs neighbours of arrival
    addAgent(agent) {
        this.population.push(agent);
        // this.proximalAgents.push(agent); //agent is already there
        this.neighbours.forEach(function(ref) {
            //ensure all neighbours know of the agent
            ref.proximalAgents.push(agent);
        })
        return true;
    }

    //removes and agent and informs neighbours of departure
    moveAgent(agent, sink) {
        this.neighbours.forEach(function(ref) {
            if (ref.isEqual(sink)) {
                ref.addAgent(agent);
            } else {
                ref.proximalAgents.remove(agent);
            }
        })
        this.population.remove(agent);
        this.proximalAgents.remove(agent);
        return true;
    }

    killAgent(agent) {
        this.neighbours.forEach(function(ref) {
            ref.proximalAgents.remove(agent);
        })
        this.population.remove(agent);
        this.proximalAgents.remove(agent);
        return true;       
    }

    getNeighbours() {return this.neighbours;}

    update() {
        this.population.forEach(function(agent) {
            agent.run(neighbours);
        })
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

        this.effect = effect;
        this.totalPopulation = 0;
    }

    addAgent(agent) {
        this.sectors[floor((agent.position.x - 200)/(this.plateSize/this.size))][floor((agent.position.y - 200)/(this.plateSize/this.size))].addAgent(agent)
        this.totalPopulation++;
    }

    updateAgents() {

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                this.sectors[i][j].update();
            }
        }

    }

    show() {
        color(20);
        rect(100, 100, this.plateSize, this.plateSize);
        circle(100 + this.plateSize/2, 100 + this.plateSize/2, this.plateSize);
    }
}