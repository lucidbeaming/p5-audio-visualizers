var mic;
function setup(){
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.90,64);
  fft.setInput(mic);
}
function draw(){
  background(0);
  
  var spectrum = fft.analyze();
  noFill();
  
  smooth(1);
  micLevel = mic.getLevel();
  for (var i = 0; i< spectrum.length; i++){

    var x = map(i, 0, spectrum.length, 0, width);
    var h = map(spectrum[i], 0, 255, 0, 300);
    var pees = map(h,0,300,3,30);
    var redd= ((i+1)/spectrum.length)*100;
    stroke(redd,50+i,175-(i*3));
    rotate((i/spectrum.length)/30);
    polygon((width/2)+150, (height/2)-100, h, pees)
  }

  
//  noFill();
  stroke(0,175,0);
//  ellipse(width/2, height/2, constrain(height-micLevel*height*5, 0, height), constrain(height-micLevel*height*5, 0, height));

}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}