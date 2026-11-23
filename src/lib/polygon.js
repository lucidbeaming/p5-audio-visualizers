// Draws a polygon of the given radius centred on (x, y). `sides` may be
// fractional: vertices sit every TWO_PI / sides radians until a full turn,
// so 4.5 sides gives four even edges and one short one.
export function polygon(p, x, y, radius, sides) {
  const step = p.TWO_PI / sides;
  p.beginShape();
  for (let k = 0; k * step < p.TWO_PI; k++) {
    p.vertex(x + Math.cos(k * step) * radius, y + Math.sin(k * step) * radius);
  }
  p.endShape(p.CLOSE);
}
