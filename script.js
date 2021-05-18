const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const center = {x: window.innerWidth / 2, y: window.innerHeight / 2};
const particle = [];
const mouse = {x: 0, y: 0, LDX: 0, LDY: 0, LDD: 0, Ldown: false, Hdown: false, Rdown: false, hover: {state: false, item: "", group: 0, type: ""}, LDkey: {shift: false}};
const key = {shift: false, ctrl: false, alt: false};

canvas.width = center.x * 2;
canvas.height = center.y * 2;

const animate = e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mouse.hover.state = false;

    if(!mouse.Ldown) mouse.hover.item = "";
    if(!mouse.Ldown) mouse.hover.type = "";

    for(let j = 0; j < particle.length; j++) {
        const line = particle[j];
        for(let i = 0; i < line.length; i++) {
            const dot = line[i];

            ctx.beginPath();
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;

            if(mouse.Ldown && dot.select) {
                if(i === 0) {
                    dot.x = dot.prevX + mouse.x - mouse.LDX;
                    dot.y = dot.prevY + mouse.y - mouse.LDY;
                }else {
                    const par = line[i - 1];
                    if(!mouse.LDkey.shift && !key.shift) {
                        const x = par.x + center.x;
                        const y = par.y + center.y;
                        const deg = Math.atan2(mouse.y - y, mouse.x - x);
                        dot.deg = dot.prevDeg + deg - mouse.LDD;
                    }else if(!mouse.LDkey.shift && key.shift) {
                        const x = par.x + center.x;
                        const y = par.y + center.y;
                        const deg = Math.atan2(mouse.y - y, mouse.x - x);
                        dot.deg = dot.prevDeg + deg - mouse.LDD;

                        if(dot.deg < 0) dot.deg += (Math.PI * 2);

                        const degP = dot.deg % (Math.PI * 2);
                        
                        if(degP < Math.PI / 8) {
                            dot.deg = 0;
                        }else if(degP < Math.PI / 8 * 3) {
                            dot.deg = Math.PI / 4;
                        }else if(degP < Math.PI / 8 * 5) {
                            dot.deg = Math.PI / 4 * 2;
                        }else if(degP < Math.PI / 8 * 7) {
                            dot.deg = Math.PI / 4 * 3;
                        }else if(degP < Math.PI / 8 * 9) {
                            dot.deg = Math.PI / 4 * 4;
                        }else if(degP < Math.PI / 8 * 11) {
                            dot.deg = Math.PI / 4 * 5;
                        }else if(degP < Math.PI / 8 * 13) {
                            dot.deg = Math.PI / 4 * 6;
                        }else if(degP < Math.PI / 8 * 15) {
                            dot.deg = Math.PI / 4 * 7;
                        }else {
                            dot.deg = 0;
                        }
                    }else if(mouse.LDkey.shift && key.shift) {
                        const x = par.x + center.x - mouse.x;
                        const y = par.y + center.y - mouse.y;
                        const length = Math.sqrt((x * x) + (y * y));
                        dot.length = dot.prevLength + length - mouse.LDD;
                    }else if(mouse.LDkey.shift && !key.shift) {
                        const x = par.x + center.x - mouse.x;
                        const y = par.y + center.y - mouse.y;
                        const length = Math.sqrt((x * x) + (y * y));
                        dot.length = Math.round((dot.prevLength + length - mouse.LDD) / 10) * 10;
                    }
                }
            }else {
                dot.select = false;
            }
            
            if(i > 0) {
                const par = line[i - 1];

                if(i === 1) dot.parDeg = dot.deg;
                else dot.parDeg = par.parDeg + dot.deg;

                const x = par.x + center.x + (Math.cos(dot.parDeg) * dot.length);
                const y = par.y + center.y + (Math.sin(dot.parDeg) * dot.length);
                
                ctx.moveTo(par.x + center.x, par.y + center.y);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();

                dot.x = x - center.x;
                dot.y = y - center.y;
            }
        }

        for(let i = line.length - 1; i >= 0; i--) {
            const dot = line[i];
            ctx.beginPath();
            if(i === 0) {
                const x = dot.x + center.x;
                const y = dot.y + center.y;

                ctx.fillStyle = "#3f0a";
                ctx.strokeStyle = "#3f0a";
                ctx.lineWidth = 2;
                
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();

                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();

                const dist = Math.sqrt(((x - mouse.x) * (x - mouse.x)) + ((y - mouse.y) * (y - mouse.y)));

                if(dist <= 10 && !mouse.hover.state && !mouse.Ldown) {
                    mouse.hover.state = true;
                    dot.hover = true;
                    mouse.hover.type = "main";
                    mouse.hover.group = j;
                }else {
                    dot.hover = false;
                }
            }else {
                const par = line[i - 1];
                const x = par.x + center.x + (Math.cos(dot.parDeg) * dot.length);
                const y = par.y + center.y + (Math.sin(dot.parDeg) * dot.length);

                ctx.fillStyle = "#333a";
                
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();

                const dist = Math.sqrt(((x - mouse.x) * (x - mouse.x)) + ((y - mouse.y) * (y - mouse.y)));

                if(dist <= 6 && !mouse.hover.state && !mouse.Ldown) {
                    mouse.hover.state = true;
                    dot.hover = true;
                    mouse.hover.type = "sub";
                    mouse.hover.group = j;
                }else {
                    dot.hover = false;
                }
                if(dist <= 20 && (!mouse.Ldown || !dot.select) && i === line.length - 1) {
                    const addX = par.x + center.x + (Math.cos(dot.parDeg) * (dot.length + 15));
                    const addY = par.y + center.y + (Math.sin(dot.parDeg) * (dot.length + 15));
                    const removeX = par.x + center.x + (Math.cos(dot.parDeg) * (dot.length - 15));
                    const removeY = par.y + center.y + (Math.sin(dot.parDeg) * (dot.length - 15));

                    ctx.fillStyle = "#0f0a";

                    ctx.arc(addX, addY, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();

                    const addDist = Math.sqrt(((addX - mouse.x) * (addX - mouse.x)) + ((addY - mouse.y) * (addY - mouse.y)));
                    
                    if(addDist <= 5 && !mouse.hover.state && !mouse.Ldown) {
                        mouse.hover.state = true;
                        mouse.hover.item = "add";
                        mouse.hover.group = j;
                    }

                    ctx.fillStyle = "#f00a";

                    ctx.arc(removeX, removeY, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();

                    const removeDist = Math.sqrt(((removeX - mouse.x) * (removeX - mouse.x)) + ((removeY - mouse.y) * (removeY - mouse.y)));
                    
                    if(removeDist <= 5 && !mouse.hover.state && !mouse.Ldown) {
                        mouse.hover.state = true;
                        mouse.hover.item = "remove";
                        mouse.hover.group = j;
                    }
                }
            }
        }
    }

    if(mouse.hover.state) canvas.style.cursor = "pointer";
    if(!mouse.hover.state) canvas.style.cursor = "unset";

    requestAnimationFrame(animate);
}

const init = e => {
    particle.push([{x: 0, y: 0}, {deg: 0, length: 50, x: 0, y: 0}, {deg: 0, length: 50, x: 0, y: 0}, {deg: 0, length: 50, x: 0, y: 0}]);

    animate();
}

document.addEventListener("mousemove", e => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

document.addEventListener("mousedown", e => {
    if(e.button === 0) {
        mouse.Ldown = true;
        mouse.LDX = mouse.x;
        mouse.LDY = mouse.y;

        for(let j = 0; j < particle.length; j++) {
            const line = particle[j];
            for(let i = 0; i < line.length; i++) {
                const dot = line[i];
                if(dot.hover) {
                    dot.select = true;
                    if(i === 0) {
                        dot.prevX = dot.x;
                        dot.prevY = dot.y;
                    }else {
                        const par = line[i - 1];
                        if(!key.shift) {
                            const x = par.x + center.x;
                            const y = par.y + center.y;
                            mouse.LDkey.shift = false;
                            dot.prevDeg = dot.deg;
                            mouse.LDD = Math.atan2(mouse.y - y, mouse.x - x);
                        }else {
                            const x = par.x + center.x - mouse.x;
                            const y = par.y + center.y - mouse.y;
                            mouse.LDkey.shift = true;
                            mouse.LDD = Math.sqrt((x * x) + (y * y));
                            dot.prevLength = dot.length;
                        }
                    }
                }
            }
        }
    }
    if(e.button === 1) mouse.Hdown = true;
    if(e.button === 2) mouse.Rdown = true;
})

document.addEventListener("mouseup", e => {
    if(e.button === 0) {
        mouse.Ldown = false;
        mouse.LDkey.shift = false;
        if(mouse.x === mouse.LDX && mouse.y === mouse.LDY) {
            if(mouse.hover.item === "add") {
                const group = particle[mouse.hover.group];

                group.push({deg: 0, length: 50, x: 0, y: 0});
            }
            if(mouse.hover.item === "remove") {
                const group = particle[mouse.hover.group];

                group.splice(group.length - 1, 1);
                if(group.length <= 1) particle.splice(mouse.hover.group, 1);
            }

            if(key.ctrl && !mouse.hover.state) {
                particle.push([{x: mouse.x - center.x, y: mouse.y - center.y}, {deg: 0, length: 50, x: 0, y: 0}]);
            }

            if(key.alt && mouse.hover.type === "main") {
                particle.splice(mouse.hover.group, 1);
            }
        }
        if(mouse.hover.type === "main" && key.shift) {
            let sum = false;
            const group = particle[mouse.hover.group][0];
            for(let i = 0; i < particle.length; i++) {
                if(!sum && i !== mouse.hover.group) {
                    const item = particle[i][particle[i].length - 1];
                    const dist = Math.sqrt(((group.x - item.x) * (group.x - item.x)) + ((group.y - item.y) * (group.y - item.y)));
                    
                    if(dist <= 5) {
                        particle[mouse.hover.group][1].deg -= item.parDeg;
                        particle[i].push(...particle[mouse.hover.group].splice(1, particle[mouse.hover.group].length));
                        particle.splice(mouse.hover.group, 1);
                    }
                }
            }
        }
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