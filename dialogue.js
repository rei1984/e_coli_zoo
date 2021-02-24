class DialogBox {
    constructor() {
        this.stage = 0;
        this.savedStage = 0;
    }

    show() {
        fill(200);
        rect(50, 900, 1100, 200);
        switch (this.stage) {
            case 0: this.stage0Show(); break;
            case 1: this.stage1Show(); break;
        }
    }

    stage0Show() {
        textSize(27);
        fill(0);
        stroke(0);
        text("Hello! Today we will be seeing how ....", 60, 910, 990, 190);
    }

    stage1Show() {
        textSize(27);
        fill(0);
        stroke(0);
        drawArrow(createVector(600, 900), createVector(380, 400 - 900), 'orange');
        text("To begin place a sample of bacteria on the plate. See how if you place it on the antibiotic coated parts it will die.", 60, 910, 990, 190);
    }
}

function incrementStage() {
    dialog.stage++;
}

function interruptStage(go) {
    dialog.savedStage = dialog.stage;
    dialog.stage = go;
}

//https://p5js.org/reference/#/p5.Vector/add
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }