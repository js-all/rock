"use strict";
class Rock {
    constructor(shape, pos) {
        this.shape = shape;
        this.pos = pos;
    }
    static randomShape(vertex, size, sizeRandomness = 2, vertexRandomness = 2, vertexDisplacementRandomness = 0.1) {
        const ringSizeRng = vertexRandomness;
        const ringSizeRng2 = vertexDisplacementRandomness;
        const RingRandomness = sizeRandomness;
        const rings = 1;
        const shape = [];
        for (let j = 0; j < rings; j++) {
            const localeSize = size * ((randomFloat(j - 0.5, j + 0.5) * ((RingRandomness - 1 / RingRandomness) / rings)) + 1 / RingRandomness);
            shape.push([]);
            let restAngle = Math.PI * 2;
            for (let i = vertex; i > 0; i--) {
                const angle = randomFloat((restAngle / i / ringSizeRng), (restAngle / i * ringSizeRng));
                shape[j].push(Vector.fromAngle(angle + (Math.PI * 2 - restAngle), randomFloat(localeSize * (1 - ringSizeRng2), localeSize * (1 + ringSizeRng2))));
                restAngle -= angle;
            }
        }
        return new Rock(shape, Vector.null);
    }
}
