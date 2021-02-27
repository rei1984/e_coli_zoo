class Sequencer {
    constructor() {
        this.agent = null;
        this.comparisonAgent = null;
        this.content;
        this.out = "Nothing to sequence";
        // this.filler = "TGAAAACGGAGTTGCCGACGACGAAAGCGACTTTGGGTTC";
        this.animationFrame = 0;
        this.sector = new Sector(0, 1, createVector(990, 315));
        this.CMPsector = new Sector(0, 1, createVector(1100, 315));
        this.CMPcontent;
    }

    show() {
        //draw screen
        fill(255);
        rect(925, 250, 200, 50);
        fill(0);
        rect(925, 75, 200, 175);
        stroke(255);
        strokeWeight(4);
        circle(1025, 350, 75);
        circle(1100, 350, 35);
        textSize(15);
        strokeWeight(1)
        stroke(0);
        fill(0);
        text("Compare To", 1100, 375);
        // strokeWeight(1);
        textSize(20)
        //if there is an agent being sequenced:
        if (this.agent) {
            let x = 940;
            let y = 90;
            let msg = "Sequenced. ";
            //print the sequence
            for (var i = 0; i < this.animationFrame; i++) {
                fill('white');
                stroke('white');
                //if we have a CMP being made then highlight the differences
                if (this.comparisonAgent) {
                    // if (i == 18) {
                    //     // console.log("18 - " + this.CMPcontent.charAt(1) + ", " +  this.content.charAt(1))
                    // }
                    if (i == 10 && this.CMPcontent.charAt(0) != this.content.charAt(0)) {
                        fill('red');
                        stroke('red');
                        msg += "[bp10: " + this.CMPcontent.charAt(0) + " to " + this.content.charAt(0) + "] ";
                    } else if (i == 18 && this.CMPcontent.charAt(1) != this.content.charAt(1)) {
                        fill('red');
                        stroke('red');
                        msg += "[bp18: " + this.CMPcontent.charAt(1) + " to " + this.content.charAt(1) + "] ";
                    } else if (i == 31 && this.CMPcontent.charAt(2) != this.content.charAt(2)) {
                        fill('red');
                        stroke('red');
                        msg += "[bp31:" + this.CMPcontent.charAt(2) + " to " + this.content.charAt(2) + "] ";
                    }
                }
                //print
                text( this.out[i], x, y);
                x += textWidth(this.out[i]) + 3;
                if (x > 1110) {
                    x = 940;
                    y += 30;
                }
            }
            textSize(15);
            stroke(0);
            fill(0);
            text(msg, 925, 250, 200, 50);
            text("Sequence-o-matic-5000", 1025, 65);
            

            //update the main sector
            this.sector.update(null, 70, createVector(1025, 350), 1, false, false, 0);
            //update the CMP sector
            if (this.animationFrame < this.out.length) {
                this.animationFrame++;
            }
        }
        if (this.comparisonAgent) {
            this.CMPsector.update(null, 35, createVector(1100, 350), 1, false, false, 0);
            //increment animation frame
        }
    }

    SequenceAgent(agent) {
        let temp = this.agent;
        if (this.agent) this.releaseAgent();
        this.agent = agent;
        this.animationFrame = 0;
        this.content = this.agent.getGenome().toString();
        this.out = "TGAAAACGGAGTTGCCGACGACGAAAGCGACTTTGGGTTCTTACCGATAAGC";
        console.log(this.content);
        this.out = replaceAt(this.out, 10, this.content[0]);
        this.out = replaceAt(this.out, 18, this.content[1]);
        this.out = replaceAt(this.out, 31, this.content[2]);
        console.log(this.out);
        // this.out = temp;
        // this.out = "";
        this.sector.addAgent(agent);
        
        if (dialog.stage == 3 && this.agent.genome.toString() == dialog.target.genome.toString()) {
            incrementStage();
            if (this.comparisonAgent && this.comparisonAgent.genome.toString() == "GTT") {
                incrementStage();
            }
        }

        return temp;

    }

    addCMPAgent(agent) {
        let temp = this.comparisonAgent;
        if (this.comparisonAgent) this.releaseCMPAgent();
        this.animationFrame = 0;
        this.comparisonAgent = agent;
        this.CMPcontent = this.comparisonAgent.getGenome().toString();
        this.CMPsector.addAgent(agent);

        if (dialog.stage == 4 && agent.genome.toString() == "GTT") {
            console.log("NOOO")
            incrementStage();
        }

        return temp;
    }

    releaseCMPAgent() {
        this.CMPcontent = "";
        this.animationFrame = 0;
        this.CMPsector.moveAgent(this.comparisonAgent, null);
        console.log(this.CMPsector.population)
        this.comparisonAgent = null;       
    }

    getAgent() {return this.agent}

    getCMPAgent() {return this.comparisonAgent}

    releaseAgent() {
        this.content = "Nothing to sequence";
        this.out = "Nothing to sequence";
        this.animationFrame = 0;
        this.sector.moveAgent(this.agent, null);
        this.agent = null;
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
        // console.log(this.playpause);

        //slider to control mutation
        this.mutationRateSlider = createSlider(0.0, 0.5, 0.05, 0.001);
        this.mutationRateSlider.position((this.position1.x + 0.125*this.panelx), 0.7*this.panely);
        this.mutationRateSlider.size(this.panelx * 0.75);

        //dna screen
        this.sequencer = new Sequencer();
        this.sequencer.SequenceAgent(new Agent(new Genome([new Gene("G"), new Gene("T"), new Gene("T")]), 1012, 350, 1))
        
        //

    }

    getMutationRate() {
        return this.mutationRateSlider.value();
    }

    show(SIZE) {
        textAlign(CENTER, CENTER);
        fill(200);
        rect(900, 50, 250, 800);
        fill(0);
        textSize(25)
        text("Mutation Rate: " + this.mutationRateSlider.value(), (this.position1.x + 0.5*this.panelx),0.7*this.panely + 50)
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

function pauseSet(b) {
    pauseFlag = b;
    if (!pauseFlag) {
        sidepanel.playpause.style('background-color','white');
        sidepanel.playpause.html("Pause");
    } else {
        sidepanel.playpause.style('background-color','grey');
        sidepanel.playpause.html("Resume");
    }   
    return pauseFlag;
}

function replaceAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}