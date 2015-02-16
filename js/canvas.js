var Plane = function() {
    var createGuid = function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return S4().toLowerCase();
    }
    this.id = createGuid();

    var plusOrMinus = function() {
        return [-1, 1][Math.random() * 2 | 0];
    };

    var getStartPosition = function() {
        return [min, max][Math.random() * 2 | 0];
    };

    var getRandomBetween = function(min, max) {
        return Math.random() * (max - min) + min;
    }

    if (~plusOrMinus()) {
        this.x = getRandomBetween(min, max);
        this.y = getStartPosition();
    } else {
        this.y = getRandomBetween(min, max);
        this.x = getStartPosition();
    }

    this.isOutOfBound = false;
    var minAngle = 0.1;
    var maxAngle = 1;
    this.vx = plusOrMinus() * getRandomBetween(minAngle, maxAngle);
    this.vy = plusOrMinus() * getRandomBetween(minAngle, maxAngle);
    this.passengerCount = Math.round(getRandomBetween(2, 400));
}

Plane.prototype.isAvailable = function() {
    return !this.isOutOfBound && !this.isCrashed;
}

Plane.prototype.draw = function() {
    if (this.x >= min && this.x <= max && this.y >= min && this.y <= max) {
        this.x += this.vx;
        this.y += this.vy;
        context.fillRect(this.x, this.y, planeSize, planeSize);
    } else {
        this.isOutOfBound = true;
    }
};

var canvas = document.getElementById("radar");
var planeList = document.getElementById("planeList");
var selectedPlaneList = document.getElementById("selectedPlaneList");
var crashedPlaneList = document.getElementById("crashedPlaneList");
var deadCounterSpan = document.getElementById("deadCounter");
var context = canvas.getContext("2d");
var mousePosition = document.getElementById("mousePosition");
var canvasSize = 1000;
var min = canvasSize * (-0.05);
var max = canvasSize * 1.05;
canvas.width = canvasSize;
canvas.height = canvasSize;
var circleInitialPosition = canvasSize / 2;
var planesCount = 25;
var planeSize = 25;
var planes = [];
var selectedPlanes = [];
var crashedPlanes = [];
var startAngle = Math.PI;
var deadCounter = 0;

var radarColor = "rgba(0, 161, 80, 0.8)";
var selectedPlaneColor = "rgb(50, 0, 0)";
var planeColor = "rgb(200, 0, 0)";
var selectorColor = planeColor;

var createPlane = function() {
    while (planes.length < planesCount) {
        var p = new Plane();
        planes.push(p);
        appendPlane(planeList, p);
    };
}

var appendPlane = function(l, p) {
    var planeItem = document.createElement("li");
    var id = document.createElement("b");
    id.appendChild(document.createTextNode(p.id));
    var spanXY = document.createElement("span");
    spanXY.appendChild(document.createTextNode(Math.round(p.x) + ", " + Math.round(p.y) + " "));
    planeItem.appendChild(id);
    planeItem.appendChild(spanXY);
    if(p.isCrashed) {
        var spanCrashed = document.createElement("span");
        spanCrashed.appendChild(document.createTextNode("Crashed"));
        planeItem.appendChild(spanCrashed);
    }
    planeItem.setAttribute("id", p.id);
    l.appendChild(planeItem);
}

var drawRadar = function() {
    context.lineWidth = 5;
    context.strokeStyle = '#000';
    context.fillStyle = radarColor;
    for (var i = 5; i >= 0; i--) {
        drawCircle(circleInitialPosition, circleInitialPosition, i * 100);
    };

    context.moveTo(0, circleInitialPosition);
    context.lineTo(canvasSize, circleInitialPosition);
    context.moveTo(circleInitialPosition, 0);
    context.lineTo(circleInitialPosition, canvasSize);
    context.stroke();
}

var drawLine = function() {
    var center = circleInitialPosition;
    context.lineWidth = 8;
    startAngle += 0.01;
    context.moveTo(center, center);
    context.lineTo(center + center * Math.cos(startAngle), center + center * Math.sin(startAngle));
    context.stroke();
}

var drawPlanes = function() {
    createPlane();
    planes.forEach(function(p, i) {
        if (p.isAvailable()) {
            context.fillStyle = p.isSelected ? selectedPlaneColor : planeColor;
            p.draw();
            var otherPlanes = getOthersNotCrashedPlanes(p.id);
            otherPlanes.forEach(function(op) {
                var isCrashed = isPointInRect({
                    x: p.x, 
                    y: p.y
                }, { 
                    x: p.x + planeSize, 
                    y: p.y + planeSize 
                }, { 
                    x: op.x, 
                    y: op.y
                });
                if(isCrashed){
                    p.isCrashed = isCrashed;
                    op.isCrashed = isCrashed;
                    deadCounter += p.passengerCount + op.passengerCount;
                    deadCounterSpan.innerHTML = deadCounter;
                    appendPlane(crashedPlaneList, op);
                    appendPlane(crashedPlaneList, p);
                }
            });
        } else {
            var planeItem = document.getElementById(p.id);
            planeList.removeChild(planeItem);
            planes.splice(i, 1);
        }
    });
}

var draw = function() {
    context.clearRect(0, 0, canvasSize, canvasSize);
    drawRadar();
    drawPlanes();
    drawLine();
    drawSelector();
}

var drawCircle = function(x, y, rayon) {
    context.beginPath();
    context.arc(x, y, rayon, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.stroke();
}

function writeMessage(message) {
    mousePosition.innerHTML = message
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getOthersNotCrashedPlanes(planeId) {
    return planes.filter(function(p){
        return p.id !== planeId && !p.isCrashed;
    });
}

function getSelectedPlanes() {
    return planes.filter(function(p) {
        return p.isSelected;
    })
}

var initialSelectorPosition = null;
var currentSelectorPosition = null;

canvas.addEventListener('mousemove', function(e) {
    var mousePos = getMousePos(canvas, e);
    var message = 'X: ' + Math.round(mousePos.x) + ' Y: ' + Math.round(mousePos.y);
    writeMessage(message);
}, false);

canvas.addEventListener('mousedown', function(e) {
    initialSelectorPosition = getMousePos(canvas, e);
    currentSelectorPosition = initialSelectorPosition;
    document.addEventListener('mousemove', setSelector);
    document.addEventListener('mouseup', selectPlane);
});

function selectPlane() {
    document.removeEventListener('mousemove', setSelector);
    document.removeEventListener('mouseup', selectPlane);

    planes.forEach(function(p, i) {
        p.isSelected = isPointInRect(initialSelectorPosition, currentSelectorPosition, {
            x: p.x,
            y: p.y
        });
    });

    selectedPlanes = getSelectedPlanes();
    clearSelector();
}

function clearSelector() {
    initialSelectorPosition = null;
    currentSelectorPosition = null;
}

function setSelector(e) {
    currentSelectorPosition = getMousePos(canvas, e);
}

function drawSelector() {
    if (initialSelectorPosition && currentSelectorPosition) {
        context.globalAlpha = 0.5;
        context.fillStyle = selectorColor;
        var lx = currentSelectorPosition.x - initialSelectorPosition.x
        var ly = currentSelectorPosition.y - initialSelectorPosition.y
        context.fillRect(initialSelectorPosition.x, initialSelectorPosition.y, lx, ly);
        context.globalAlpha = 1;
    }
}

function rectArea(a, b, c) {
    return Math.abs((b.x - a.x) * (c.y - a.y));
}

function isPointInRect(ra, rc, p) {
    var x1 = Math.min(ra.x, rc.x);
    var x2 = Math.max(ra.x, rc.x);
    var y1 = Math.min(ra.y, rc.y);
    var y2 = Math.max(ra.y, rc.y);
    return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
}

function displaySelectedPlanes() {
    selectedPlaneList.innerHTML = '';
    if (selectedPlanes.length) {
        selectedPlanes.forEach(function(p) {
            appendPlane(selectedPlaneList, p);
        })
    }
}

window.onload = function() {
    var frame = 1000 / 60;
    setInterval(draw, frame);
    setInterval(function(){
        displaySelectedPlanes();
    }, 10000 / 60)
}