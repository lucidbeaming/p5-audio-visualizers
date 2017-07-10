// Based on the stochastic tree code here:
// https://github.com/shiffman/The-Nature-of-Code-Examples

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
        micLevel = mic.getLevel(.6);
        bigly = map(micLevel, 0, 1, 20, height / 2);
        rotate(1.047198);
        newTree(bigly);
    }

}

function newTree(bigly) {
    porky++;
    if(porky>5000){
      porky=0;
      if(cul==255){
        cul=0;
      } else {
        cul=255;
      }
    }
    stroke(cul,40);
    push();
    branch(bigly);
    pop();
}

function branch(h) {
    // thickness of the branch is mapped to its length
    var sw = map(h, 2, 120, 1, 3);
    strokeWeight(sw);
    // Draw the actual branch
    line(0, 0, 0, h);
    // Move along to end
    translate(0, h);

    // Each branch will be 2/3rds the size of the previous one
    h *= 0.80;

    // All recursive functions must have an exit condition!!!!
    // Here, ours is when the length of the branch is 2 pixels or less
    if (h > 10) {
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
