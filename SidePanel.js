class Sequencer {
    constructor(p1, p2) {
        this.agent = null;
        this.pos1 = p1;
        this.pos2 = p2;
        this.content = null;
        this.animationFrame = 0;
        this.sector = new Sector(0, 3, createVector(p2.x + 20, p2.y + 30));
    }

    show() {
        rect(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
        text(this.content.slice(0, this.animationFrame), this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
        this.sector.update(null, 100, createVector(this.pos2.x - this.pos1.x, this.pos2.y + 20), 1, false, false, 0);
        if (this.animationFrame < this.content.length) {
            this.animationFrame++;
        }
    }

    SequenceAgent(agent) {
        this.agent = agent;
        this.animationFrame = 0;
        this.content = this.agent.getGenome().toString();
        this.sector.addAgent(agent);
    }

}

class SidePanel {
    
    constructor(SIZE) {
        this.panelx = SIZE - (PLATESIZE + LIP*3);
        this.panely = PLATESIZE;
        this.position1 = createVector(PLATESIZE + LIP*2, LIP)
        this.position2 = createVector(SIZE - (PLATESIZE + LIP*3), PLATESIZE)

        //play pause button
        this.playpause = createButton("Pause");
        this.playpause.position((this.position1.x + 0.5*this.panelx) - this.panelx/4, 0.9*this.panely);
        this.playpause.mouseClicked(playPauseToggle);
        this.playpause.style("font-size", "25px");
        this.playpause.style('background-color',255);
        this.playpause.size(this.panelx/2, this.panelx/3);
        console.log(this.playpause);

        //slider to control mutation
        this.mutationRateSlider = createSlider(0.0, 0.5, 0.05, 0.001);
        this.mutationRateSlider.position((this.position1.x + 0.125*this.panelx), 0.3*this.panely);
        this.mutationRateSlider.size(this.panelx * 0.75);

        //dna screen
        this.sequencer = new Sequencer(createVector(this.position1.x + LIP/2, this.position1.y + LIP/2), createVector(this.position2.x - LIP/2, this.position1.y + LIP/2 + this.panelx/4));
        this.sequencer.SequenceAgent(new Agent(new Genome([new Gene("G"), new Gene("T"), new Gene("T")]), this.position2.x - LIP/2 + 20, this.position1.y + LIP/2 + this.panelx/4 + 30, 1))
        
        //

    }

    getMutationRate() {
        return this.mutationRateSlider.value();
    }

    show(SIZE) {
        textAlign(CENTER, CENTER);
        fill(200);
        rect(this.position1.x, this.position1.y, this.position2.x, this.position2.y);
        fill(0);
        textSize(25)
        text("Mutation Rate: " + this.mutationRateSlider.value(), (this.position1.x + 0.5*this.panelx),0.3*this.panely + 50)
        this.sequencer.show();
    }

    //TODO: why is playpause undefined

}

function playPauseToggle() {
    if (pauseFlag) {
        pauseFlag = false;
        this.style('background-color','white');
        this.html("Pause");
    } else {
        pauseFlag = true;
        this.style('background-color','grey');
        this.html("Resume");
    }
    return pauseFlag;
}