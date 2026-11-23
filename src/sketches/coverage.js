// branch() is adapted from the stochastic tree example in Daniel Shiffman's
// The Nature of Code examples: https://github.com/shiffman/The-Nature-of-Code-Examples
//
// That code is under the MIT License:
//
// Copyright (c) 2014 Daniel Shiffman
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// Recursive branching trees that grow with the input level and slowly
// cover the screen, switching between white and black every 5000 trees.
export default function coverage(p, audio) {
    let cul = 255;
    let porky = 0;

    function newTree(bigly) {
        porky++;
        if (porky > 5000) {
            porky = 0;
            cul = cul == 255 ? 0 : 255;
        }
        p.stroke(cul, 40);
        p.push();
        branch(bigly);
        p.pop();
    }

    function branch(h) {
        // thickness of the branch is mapped to its length
        const sw = p.map(h, 2, 120, 1, 3);
        p.strokeWeight(sw);
        // Draw the actual branch
        p.line(0, 0, 0, h);
        // Move along to end
        p.translate(0, h);

        // Each branch will be 2/3rds the size of the previous one
        h *= 0.80;

        // All recursive functions must have an exit condition!!!!
        // Here, ours is when the length of the branch is 2 pixels or less
        if (h > 10) {
            // A random number of branches
            const n = Math.floor(p.random(1, 3));

            for (let i = 0; i < n; i++) {
                // Picking a random angle
                const theta = p.random(-p.PI / 3, p.PI / 3);
                p.push(); // Save the current state of transformation (i.e. where are we now)
                p.rotate(theta); // Rotate by theta
                branch(h); // Ok, now call myself to branch again
                p.pop(); // Whenever we get back here, we "pop" in order to restore the previous matrix state
            }
        }
    }

    return {
        setup() {
            p.background(0);
        },

        draw() {
            p.translate(p.width / 2, p.height / 2);
            for (let i = 0; i < 7; i++) {
                const micLevel = audio.level(0.6);
                p.rotate(1.047198);
                newTree(p.map(micLevel, 0, 1, 20, p.height / 2));
            }
        },

        windowResized() {
            p.background(0);
        },
    };
}
