class DialogBox {
    constructor() {
        this.stage = 0;
        this.savedStage = 0;
        this.tick = 0;
        // this.fadeTick = 0;
        this.target = null;
        this.msg = [
            "Hey there scientist! Today I want you to conduct an experiment for me! As you can see we have set up a petri dish for you to use.", //0
            "See those rings in the middle? They are layers of antibiotic which will kill the bacteria that come into contact. Try picking up a sample and placing it in there. Press P to generate a new bacteria sample.", //1
            "On the side here we have some starter bacteria ready for you to experiment with... when you move them over to the dish you will see them spread and feed on the agar... well until they touch the antibiotic anyway! Try it now place one down and see what happens!", //2
            "Hey that one there looks a little different! But why is it different? Move him into the Sequence-o-matic-5000 on the side.", //3
            "From here we can see the code generating but to see what has changed move our original into the 'compare to' box.", //4
            "Now we can see the changes highlighted.... Looks like a base changed during mitosis.", //5
            "Feel free to pause and play the simulation if you want to look at the genetic changes as the bacteria mutate and spread across the dish.", //6
            "Would look as if another mutant has made it into the centre of the dish with 10 times as much antibiotic!", //7
            "We started with a population with no resistance to the antibiotic and now they are thriving in there! Soon these variants will colonise the inner sections of the dish.", //8
            "Hopefully this will have demonstrated to you how quickely over-exposure to antibiotic can cause micro-evolution in bacteria. Feel free to experiment and watch the bacteria evolve again." //9
        ];
        this.firstMutagenBox = false;
        this.boxPos = null;
    }

    reset() {
        this.tick = 0;
    }

    show() {
        fill(200);
        rect(50, 900, 1100, 200);
        if (this.agileBox) {
            this.agileBox.doBox();
            if (this.agileBox.done) {
                this.agileBox = null;
                pauseSet(false);
            }
        }
        fill('yellow');
        ellipse(1050, 950, 120, 180);
        fill('black');
        text("(CHARACTER)", 1050, 950)
        switch (this.stage) {
            case 0: this.showDialogText(0); break;
            case 1: this.stage1Show(); break;
            case 2: this.stage2Show(); break;
            case 3: this.stage3Show(); break;
            case 4: this.showDialogText(4); break;
            case 5: this.stage5Show(); break;
            case 6: this.showDialogText(6); next.hide(); break;
            case 7: this.showDialogText(7); next.show();  break;
            case 8: this.showDialogText(8); break;
            case 9: this.showDialogText(9); next.hide(); break;
        }
    }

    stage1Show() {
        this.showDialogText(1);
        drawArrow(createVector(885, 895), createVector(574 - 885, 661 - 895), 'orange');
        drawArrow(createVector(1050, 897), createVector(535 - 1050, 489 - 897), 'red');
        next.show();
    }
    
    stage2Show() {
        this.showDialogText(2);
        if ((this.tick < this.msg[2].length*2)) {
            drawArrow(createVector(600, 900), createVector(380, 400 - 900), 'orange');
        }
        next.hide();
    }

    stage3Show() {
        this.showDialogText(3);
        drawArrow(createVector(600, 900), createVector(380, 400 - 900), 'orange');
        pauseSet(true);
        next.hide();
    }

    stage5Show() {
        pauseSet(false);
        this.showDialogText(5);
        next.show();
    }
    
    showDialogText(n) {
        textSize(27);
        fill(0);
        stroke(0);
        let msg = this.msg[n];
        text(msg.substr(0, this.tick/2), 60, 910, 900, 190);
        if (this.tick < msg.length*2) {
            this.tick++;
        }
    }

    setupAgileBox(n, agent) {
        pauseSet(true);
        this.agileBox = new agileBox(n, agent.position);
    }

    // setupAgileBox(n, x, y) {
    //     pauseFlag = true;
    //     this.agileBox = new agileAgentBox(n, createVector(x, y));
    // }
}

class agileBox {
    constructor(type, position) {
        this.fadeTick = -10;
        this.lifespan = 600;
        this.done = false;
        this.position = position;
        this.type = type;
        this.msg = [
            "See how they split! That is mitosis and every time that happens the genetic code is copied into the new form. When this happens there is a small chance that they will have a mix up and mutate...",
            "This bacteria looks a little different to the others...",
            "Hmmm I would have a look at that one if I was you.... maybe try and put it in the antibiotic",
            "This variant here must have a change that makes it resistant to at least some antibiotic... see if you can find which changes allow for this."
        ]
    }

    doBox() {
        this.showAgileBox(this.type, this.position);
        if (this.lifespan == 0) {
            this.done = true;
        }
    }
    
    showAgileBox(n, p) {
        textSize(27);
        // let colour = color(255);
        // colour.setAlpha(this.fadeTick);
        fill(255, this.fadeTick);
        // color(255, 0, 0, this.fadetick)
        // stroke(4);
        // console.log(this.fadeTick)
        
        rect(p.x + 10, p.y + 10, 200, 200)
        fill(0, this.fadeTick);
        textSize(16);
        textAlign(LEFT);
        text(this.msg[n], p.x + 20, p.y + 20, 190, 190)
        textAlign(CENTER);
        if (this.fadeTick < 255 && this.lifespan > 51) {
            this.fadeTick+= 5;
        } else if (this.lifespan <= 51) {
            this.fadeTick -= 5;
        }
        this.lifespan--;
    }
}

// class agileAgentBox extends agileBox {
//     constructor() {
//         this.fadetick = 0;
//         this.lifespan = 500;
//         this.done = false;
//         this.position = position;
//         this.type = type;
//     }
// }

function incrementStage() {
    dialog.stage++;
    dialog.tick = 0;
}

function interruptStage(go) {
    dialog.savedStage = dialog.stage;
    dialog.stage = go;
}

//https://p5js.org/reference/#/p5.Vector/add
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(10);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

