var score = 0;
var increase = 1;
var cps = 1;
var loop;

var looping = true;
var ctx;

function draw() {
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // set font
    ctx.font = "16px Arial";
    loop = window.setInterval(async function() {
        await updateScore();
        drawScore(ctx)
    }, 1000);
    // stop loop
    window.addEventListener('keydown', this.pause, false);



    //https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element#9880302
    let canvasLeft = canvas.offsetLeft,
        canvasTop = canvas.offsetTop,
        elements = [];

    let onePerSecond = [];
    let perClick = [];
    let morePerClick = [];

    canvas.addEventListener('click', function(event) {
        let x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;

        // Collision detection between clicked offset and element
        // this is just for the one main element
        elements.forEach(function(element) {
            // https://stackoverflow.com/questions/16792841/detect-if-user-clicks-inside-a-circle
            if(Math.sqrt((x-element.centerX)*(x-element.centerX)+((y-element.centerY)*(y-element.centerY))) < element.radius) {
                // update and draw score
                score += increase;
                drawScore(ctx);

                // get angle from center
                var dy = y - element.centerY;
                var dx = x - element.centerX;
                var theta = Math.atan2(dy, dx);
                theta *= 180 / Math.PI;
                if(theta < 0) {
                    theta = 360 + theta;
                }

            }
        });
        onePerSecond.forEach(function(element) {
            if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                // update and draw score
                if (score >= 100) {
                    score -= 100;
                    cps += 1;
                    drawScore(ctx)
                }

            }
        });

        perClick.forEach(function(element) {
            if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                // increase increase variable
                if(score >= 200) {
                    increase += 1;
                    score -= 200;
                    drawScore(ctx);
                }

            }
        });

        morePerClick.forEach(function(element) {
            if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                // increase increase variable
                if(score >= 1000) {
                    increase += 5;
                    score -= 1000;
                    drawScore(ctx);
                }

            }
        });

    }, false);
    // add main element
    elements.push({
        color: '#05EFFF',
        width: 150,
        height: 150,
        radius: 75,
        centerY: (canvas.height / 2),
        centerX: (canvas.width / 2)
    });

    // add element that increases clicks per second
    onePerSecond.push({
        color: '#DD02FF',
        width: 75,
        height: 50,
        top: 330,
        left: 30
    })

    // add element that increases number of coins per manual click
    perClick.push({
        color: '#66FF07',
        width: 75,
        height: 50,
        top: 330,
        left: 130
    });
    morePerClick.push({
        color: '#ED0713',
        width: 90,
        height: 50,
        top: 330,
        left: 230
    });

    // render elements
    elements.forEach(function(element) {
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(element.centerX, element.centerY, element.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = element.color;
        ctx.fill();
        ctx.stroke();
    });
    onePerSecond.forEach(function(element) {
        drawBorder(element.left, element.top, element.width, element.height);
        ctx.fillStyle = element.color;
        ctx.fillRect(element.left, element.top, element.width, element.height);
        ctx.fillStyle = '#000';
        ctx.fillText("1 CPS", element.left +2, element.top+20);
        ctx.fillText("100 Coins", element.left +2, element.top+40);
    });
    perClick.forEach(function(element) {
        drawBorder(element.left, element.top, element.width, element.height);
        ctx.fillStyle = element.color;
        ctx.fillRect(element.left, element.top, element.width, element.height);
        ctx.fillStyle = '#000';
        ctx.fillText("1 CP", element.left +2, element.top+20);
        ctx.fillText("200 Coins", element.left +2, element.top+40);
    });
    morePerClick.forEach(function(element) {
        drawBorder(element.left, element.top, element.width, element.height);
        ctx.fillStyle = element.color;
        ctx.fillRect(element.left, element.top, element.width, element.height);
        ctx.fillStyle = '#000';
        ctx.fillText("5 CP", element.left +2, element.top+20);
        ctx.fillText("1000 Coins", element.left +2, element.top+40);
    });
    // draw score
    drawScore(ctx);

    // draw help
    ctx.fillStyle = '#BBB';
    ctx.fillText("press 'p' to pause and resume", 20, 395);
    ctx.fillStyle = '#000';
    ctx.fillText('1 Coin', 180, 205);




}

function drawScore(context) {
    // clear score
    context.clearRect(0, 0, 100, 100);
    // set color of text to black
    context.fillStyle = '#000';
    // draw score
    context.fillText("Coins: " + score, 10, 20);
    context.fillText("CPS: " + cps, 10, 40);
    context.fillText("CP: " + increase, 10, 60);
}

function updateScore() {
    score += cps;
}

function pause(e) {
    var code = e.keyCode;
    // 80 is p, for pause
    if(code == 80) {
        if(looping) {
            alert("paused");
            window.clearInterval(loop);
            console.log("paused");
            looping = false;
        } else {
            // start again
            loop = window.setInterval(async function() {
                    await updateScore();
                    drawScore(ctx)
                }, 1000);
            alert("resumed");
            looping = true;
        }

    }
}
// https://stackoverflow.com/questions/38173871/html5-canvas-how-to-border-a-fillrect
function drawBorder(xPos, yPos, width, height, thickness = 1) {
    ctx.fillStyle = '#000';
    ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}
