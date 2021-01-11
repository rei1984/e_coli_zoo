const colony = [];

const MAX = 200;

function setup() {
  createCanvas(SIZE, SIZE);
  for (let i = 0; i < MAX; i++) {
    flock.push(new Agent);
  }
}

function draw() {
  background(51);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}