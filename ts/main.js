"use strict";
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const cw = 800;
const ch = 800;
canvas.width = cw;
canvas.height = ch;
var shape1 = createRandomPolygone(1, 8, 100, 2, 1.5, 0.1);
var slice = Vector.fromAngle(randomFloat(0, Math.PI * 2), 100).unit();
ctx.translate(cw / 2, ch / 2);
function draw() {
    ctx.clearRect(-cw, -ch, cw * 2, ch * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    for (let j of shape1) {
        ctx.beginPath();
        ctx.moveTo(...j[0].toArray());
        for (let i of j) {
            ctx.lineTo(...i.toArray());
        }
        ctx.lineTo(...j[0].toArray());
        ctx.stroke();
        ctx.closePath();
    }
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(...slice.negative().setLength(500).toArray());
    ctx.lineTo(...slice.negative().setLength(300).toArray());
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(...slice.setLength(500).toArray());
    ctx.lineTo(...slice.setLength(300).toArray());
    ctx.stroke();
    ctx.closePath();
    for (let i of shape1) {
        for (let j = 0; j < i.length; j++) {
            const e = i[j];
            const e2 = j >= i.length - 1 ? i[0] : i[j + 1];
            const p = LineLineIntersection(Vector.null, slice.setLength(10), e, e2);
            if (false) {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.font = "10px Arial";
                ctx.fillText("" + Math.floor(slice.dot(e) * 100) / 100, e.x, e.y - 20);
                ctx.beginPath();
                ctx.moveTo(...e2.substract(e).setLength(-1000).add(e).toArray());
                ctx.lineTo(...e2.substract(e).setLength(1000).add(e).toArray());
                ctx.strokeStyle = "rgba(0,0,0,0.3)";
                ctx.stroke();
                ctx.closePath();
            }
            if (p.pos === null)
                continue;
            if (false && p.pos !== null) {
                ctx.fillStyle = p.u <= 0 || p.u >= 1 ? "rgba(255, 0, 255,0.5)" : "red";
                const r = p.u <= 0 || p.u >= 1 ? 3 : 5;
                ctx.beginPath();
                ctx.arc(p.pos.x, p.pos.y, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    requestAnimationFrame(draw);
}
function play() {
    const newShape = [];
    let ioffset = 0;
    for (let _i = 0; _i < shape1.length; _i++) {
        newShape.push([]);
        const i = shape1[_i];
        for (let j = 0; j < i.length; j++) {
            const e = i[j];
            const e2i = j >= i.length - 1 ? 0 : j + 1;
            const e2 = i[e2i];
            const p = LineLineIntersection(Vector.null, slice.setLength(10), e, e2);
            if (p.pos === null || p.u <= 0 || p.u >= 1) {
                newShape[_i].push(e);
                continue;
            }
            ;
            const m = p.pos.substract(e);
            newShape[_i].push(e, e.add(m.setLength(m.length() - 10)), e.add(m.setLength(m.length() + 10)));
        }
    }
    const rings = [];
    for (let i of newShape) {
        let ring1 = [];
        let ring2 = [];
        for (let j of i) {
            if (slice.reverse().multiply(new Vector(1, -1)).dot(j) > 0) {
                ring1.push(j);
            }
            else {
                ring2.push(j);
            }
        }
        const res = [];
        if (ring1.length > 0)
            res.push(ring1);
        if (ring2.length > 0)
            res.push(ring2);
        rings.push(...res);
    }
    shape1 = rings;
    slice = Vector.fromAngle(randomFloat(0, Math.PI * 2), 100).unit();
}
play.rate = 1;
//play.interval = setInterval(play, 1000 / play.rate);
draw();
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
    return Math.floor(randomFloat(min, max));
}
function createRandomPolygone(rings, vertex, size, RingRandomness = 2, ringSizeRng = 2, ringSizeRng2 = 0.1) {
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
    return shape;
}
function toDeg(rad) {
    return rad / Math.PI * 180;
}
function LineLineIntersection(v1, v2, v3, v4) {
    const div = ((v1.x - v2.x) * (v3.y - v4.y) - (v1.y - v2.y) * (v3.x - v4.x));
    if (div == 0) /*parallel or coincident*/
        return {
            pos: null,
            u: 0,
            t: 0
        };
    const t = ((v1.x - v3.x) * (v3.y - v4.y) - (v1.y - v3.y) * (v3.x - v4.x)) / div;
    const u = ((v1.x - v2.x) * (v1.y - v3.y) - (v1.y - v2.y) * (v1.x - v3.x)) / div;
    const p = new Vector(v1.x + t * (v2.x - v1.x), v1.y + t * (v2.y - v1.y));
    return {
        pos: p,
        u: u + 1,
        t: t
    };
}
