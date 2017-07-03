// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Stochastic Tree
// Renders a simple tree-like structure via recursion
// Angles and number of branches are random

var mic;
var amplitude;
var n;
var c;
var cul=255;
var porky=0;

function setup() {

    c = createCanvas(windowWidth, windowHeight);
    background(0);
    mic = new p5.AudioIn();
    mic.start();
    amplitude = new p5.Amplitude();
}

function draw() {
    translate(width / 2, height / 2);
    for (var i = 0; i < 7; i++) {
        micLevel = mic.getLevel(.8);
        bigly = map(micLevel, 0, 1, 20, height / 2);
        rotate(1.047198);
        newTree(bigly);
    }

}

function newTree(bigly) {
    porky++;
    if(porky>4000){
      porky=0;
      if(cul==255){
        cul=0;
      } else {
        cul=255;
      }
    }
    stroke(cul,30);
    push();
    branch(bigly);
    pop();
}

function branch(h) {
    // thickness of the branch is mapped to its length
    var sw = map(h, 2, 120, 1, 5);
    strokeWeight(1);
    // Draw the actual branch
    line(0, 0, 0, h);
    // Move along to end
    translate(0, h);

    // Each branch will be 2/3rds the size of the previous one
    h *= 0.87;

    // All recursive functions must have an exit condition!!!!
    // Here, ours is when the length of the branch is 2 pixels or less
    if (h > 15) {
        // A random number of branches
        var n = Math.floor(random(1, 3));

        for (var i = 0; i < n; i++) {
            // Picking a random angle
            var theta = random(-PI / 3, PI / 3);
            push(); // Save the current state of transformation (i.e. where are we now)
            rotate(theta); // Rotate by theta
            branch(h); // Ok, now call myself to branch again
            pop(); // Whenever we get back here, we "pop" in order to restore the previous matrix state
        }
    }
}
