// Draws a polygon of the given radius centred on (x, y). `sides` may be
// fractional: vertices sit every TWO_PI / sides radians until a full turn,
// so 4.5 sides gives four even edges and one short one.
function polygon(x, y, radius, sides) {
  var step = TWO_PI / sides;
  beginShape();
  for (var k = 0; k * step < TWO_PI; k++) {
    vertex(x + cos(k * step) * radius, y + sin(k * step) * radius);
  }
  endShape(CLOSE);
}
