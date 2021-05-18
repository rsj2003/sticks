const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const center = {x: window.innerWidth / 2, y: window.innerHeight / 2};
const particle = {x: 0, y: 0, deg: 0, speed: 0, length: 30};
const mouse = {x: center.x, y: center.y, Ldown: false, Hdown: false, Rdown: false};
const key = {shift: false, ctrl: false, alt: false};

canvas.width = center.x * 2;
canvas.height = center.y * 2;

const animate = e => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.03;
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    let x = particle.x + center.x;
    let y = particle.y + center.y;
    let deg = Math.atan2(mouse.y - y, mouse.x - x);

    if(deg - particle.deg >= Math.PI) particle.deg += Math.PI * 2;
    if(deg - particle.deg <= - Math.PI) particle.deg -= Math.PI * 2;

    particle.deg += (deg - particle.deg) * 0.08

    let dist = Math.sqrt(((x - mouse.x) * (x - mouse.x)) + ((y - mouse.y) * (y - mouse.y)));
    
    particle.speed += ((dist / 10) - particle.speed) * 1;
    
    x += Math.cos(particle.deg) * particle.speed;
    y += Math.sin(particle.deg) * particle.speed;
    
    // if(particle.speed >= 0) console.log(dist);

    particle.x = x - center.x;
    particle.y = y - center.y;

    ctx.strokeStyle = "#333";
    ctx.lineCap = "round";
    ctx.lineWidth = 15;
    ctx.fillStyle = "#fff";

    ctx.moveTo(x + (Math.cos(particle.deg) * -particle.length), y + (Math.sin(particle.deg) * -particle.length));
    ctx.lineTo(x + (Math.cos(particle.deg) * particle.length), y + (Math.sin(particle.deg) * particle.length));
    ctx.stroke();
    ctx.beginPath();

    ctx.arc(x + (Math.cos(particle.deg) * particle.length), y + (Math.sin(particle.deg) * particle.length), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();

    requestAnimationFrame(animate);
}

const init = e => {

    animate();
}

document.addEventListener("mousemove", e => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

document.addEventListener("mousedown", e => {
    if(e.button === 0) mouse.Ldown = true;
    if(e.button === 1) mouse.Hdown = true;
    if(e.button === 2) mouse.Rdown = true;
})

document.addEventListener("mouseup", e => {
    if(e.button === 0) {
        mouse.Ldown = false;
    }
    if(e.button === 1) {
        mouse.Hdown = false;
    }
    if(e.button === 2) {
        mouse.Rdown = false;
    }
})

document.addEventListener("contextmenu", e => {
    e.preventDefault();
})

document.addEventListener("keydown", e => {
    const keyD = e.key.toLocaleLowerCase();

    if(keyD === "shift") key.shift = true;
    if(keyD === "control") key.ctrl = true;
    if(keyD === "alt") key.alt = true;
})

document.addEventListener("keyup", e => {
    const keyD = e.key.toLocaleLowerCase();

    if(keyD === "shift") key.shift = false;
    if(keyD === "control") key.ctrl = false;
    if(keyD === "alt") key.alt = false;
})

window.addEventListener("resize", e => {
    center.x = window.innerWidth / 2;
    center.y = window.innerHeight / 2;

    canvas.width = center.x * 2;
    canvas.height = center.y * 2;
})

init();