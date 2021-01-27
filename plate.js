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

    addProximalAgent(agent) {
        this.proximalAgents.push(agent);
    }

    setupLinkage(sectors) {
        //replace the index with a reference to the sector
        for (var i = 0; i < this.neighbours.length; i++) {
            if (!this.isEqual(this.neighbours[i])) this.neighbours[i] = sectors[this.neighbours[i][0]][this.neighbours[i][1]];
        }
    }

    //adds an agent to the sector and informs neighbours of arrival
    addAgent(agent) {
        var agent = agent;
        this.population.push(agent);
        console.log(this.neighbours[0].id);
        console.log(this.neighbours[1].id);
        // this.proximalAgents.push(agent); //agent is already there
        for (var i = 0; i < this.neighbours.length; i++) {
            // console.log(this.id);
            // console.log(this.neighbours[i].id);
            //ensure all neighbours know of the agent
            this.neighbours[i].proximalAgents.push(agent);
        }
        console.log("woo wee foo");
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

    update(sectors) { 
        for (var i = 0; i < this.population.length; i++) {
            let agent = this.population[i];
            agent.run(this.proximalAgents, this.plateSize);
            let secid = [floor((agent.position.x - 200)/(this.plateSize/this.size)), floor((agent.position.y - 200)/(this.plateSize/this.size))];
            if (secid != this.id) {
                let sector = sectors[sec[0], sec[1]];
                moveAgent(agent, sector);
            }
        }
    }

    isEqual(sector) {
        return (sector.id == this.id);
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
        let x = floor((agent.position.x - 200)/(this.plateSize/this.size));
        let y = floor((agent.position.y - 200)/(this.plateSize/this.size));
        console.log(this.sectors[floor((agent.position.x - 200)/(this.plateSize/this.size))][floor((agent.position.y - 200)/(this.plateSize/this.size))])
        this.sectors[x][y].proximalAgents.push(agent);
        if (this.sectors[x][y].addAgent(agent)) console.log("succss");
        this.totalPopulation++;
    }

    updateAgents() {

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.sectors[i][j].population.length > 0) {
                    console.log("Oooooo")
                }
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