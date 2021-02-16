var shapes = [];
var colour = [];
var pflag = false;
plist = [];
pdo = false;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  // background(220);
  blendMode(BLEND);
  for (var i = 0; i < shapes.length; i++) {
    fill(colour[i][0], colour[i][1], colour[i][2], colour[i][3]);
    stroke(colour[i][0], colour[i][1], colour[i][2], colour[i][3]);
    // console.log(colour[i][0],colour[i][1], colour[i][2]);
    circle(shapes[i].x, shapes[i].y, 50);
  }
  if (pdo) {
    beginShape();
    curveVertex(plist[0].x, plist[0].y);
    for (var i = 0; i < plist.length; i++) {
      curveVertex(plist[i].x, plist[i].y);
    }
    curveVertex(plist[0].x, plist[0].y);
    endShape();
  }
}

function mouseClicked() {
  if (pflag) {
    plist.push(createVector(mouseX, mouseY))
  } else {
    r = random(255); // r is a random number between 0 - 255
    g = random(255); // g is a random number betwen 100 - 200
    b = random(255); // b is a random number between 0 - 100
    a = random(255); // a is a random number between 200 - 255
    shapes.push(createVector(mouseX, mouseY));
    colour.push([r, g, b, a]);
  }

  // console.log(r + " " + g + " " + b);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    pflag = !pflag;
  } else if (keyCode === RIGHT_ARROW) {
    console.log(plist);
    pdo = !pdo;
  }
}