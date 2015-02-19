'use strict';

var Plane = function() {
    var createGuid = function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return S4().toLowerCase();
    }
    this.id = createGuid();
    this.speed = 1;

    var plusOrMinus = function() {
        return [-1, 1][Math.random() * 2 | 0];
    };

    var getStartPosition = function() {
        return [min, max][Math.random() * 2 | 0];
    };

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
    this.isAtAirPort = false;
    this.vx = plusOrMinus() * getRandomBetween(minAngle, maxAngle);
    this.vy = plusOrMinus() * getRandomBetween(minAngle, maxAngle);
    this.passengerCount = Math.round(getRandomBetween(2, 400));
    this.name = generatePlaneName();
}

Plane.prototype.isAvailable = function() {
    return !this.isOutOfBound && !this.isCrashed && !this.isAtAirPort;
};

Plane.prototype.isLanded = function() {
    this.isAtAirPort = isPointInRect({x: airPortInitialposition.x, y: airPortInitialposition.y}, 
        {x: airPortInitialposition.x + airPortSize, y: airPortInitialposition.y + airPortSize}, 
        {x: this.x, y: this.y});
    return this.isAtAirPort;
}

Plane.prototype.takeOff = function() {
    this.runway = [1, 2, 3, 4].getRandomValue();
    console.log(this.runway);
    var x,y;
    switch(this.runway) {
        case 1:
            //x = airPortInitialposition.x + airPortSize / 2;
            //y = airPortInitialposition.y;
            x = 500;
            y = 400;
            this.goUp();
            break;
        case 2:
            //x = airPortInitialposition.x + airPortSize;
            //y = airPortInitialposition.y - airPortSize / 2;
            x = 600;
            y = 500;
            this.goRight();
            break;
        case 3:
            //x = airPortInitialposition.x + airPortSize / 2;
            //y = airPortInitialposition.y - airPortSize;
            x = 500;
            y = 600;
            this.goDown();
            break;
        case 4:
            //x = airPortInitialposition.x - airPortSize / 2;
            //y = airPortInitialposition.y;
            x = 400;
            y = 500;
            this.goLeft();
            break;
    }
    this.x = x;
    this.y = y;
    this.isAtAirPort = false;
}

Plane.prototype.draw = function() {
    if (this.x >= min && this.x <= max && this.y >= min && this.y <= max) {
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
        context.fillRect(this.x, this.y, planeSize, planeSize);
    } else {
        this.isOutOfBound = true;
    }
};

Plane.prototype.goUp = function(){
    this.vy = Math.abs(this.vy);
    this.vy *= -1;
}

Plane.prototype.goDown = function(){
    this.vy = Math.abs(this.vy);
}

Plane.prototype.goLeft = function(){
    this.vx = Math.abs(this.vx);
    this.vx *= -1;
}

Plane.prototype.goRight = function(){
    this.vx = Math.abs(this.vx);
}

Plane.prototype.speedUp = function() {
    this.speed += 0.3;
}

Plane.prototype.speedDown = function() {
    this.speed -= 0.3;
}

var canvas = document.getElementById("radar");
var planeList = document.getElementById("planeList");
var selectedPlaneList = document.getElementById("selectedPlaneList");
var crashedPlaneList = document.getElementById("crashedPlaneList");
var landedPlaneList = document.getElementById("landedPlaneList");
var deadCounterSpan = document.getElementById("deadCounter");
var context = canvas.getContext("2d");
var mousePosition = document.getElementById("mousePosition");
var canvasSize = 1000;
var min = canvasSize * (-0.05);
var max = canvasSize * 1.05;
canvas.width = canvasSize;
canvas.height = canvasSize;
var circleInitialPosition = canvasSize / 2;
var planesCount = 10;
var planeSize = 25;
var planes = [];
var selectedPlanes = [];
var crashedPlanes = [];
var landedPlanes = [];
var startAngle = Math.PI;
var deadCounter = 0;

var airPortColor = "rgb(37, 14, 248)";
var airPortInitialposition = { x:450, y: 450};
var airPortSize = 100;

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

var getRandomBetween = function(min, max) {
    return Math.random() * (max - min) + min;
}

Array.prototype.getRandomValue = function() {
    return this[Math.floor(Math.random() * this.length)];
}

var appendPlane = function(l, p) {
    var planeItem = document.createElement("li");
    var id = document.createElement("b");
    id.appendChild(document.createTextNode(p.name));
    var spanXY = document.createElement("span");
    spanXY.appendChild(document.createTextNode(Math.round(p.x) + ", " + Math.round(p.y) + " "));
    planeItem.appendChild(id);
    planeItem.appendChild(spanXY);
    if(p.isCrashed) {
        var spanCrashed = document.createElement("span");
        spanCrashed.appendChild(document.createTextNode("RIP : " + p.passengerCount));
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
        var t = p.isLanded();
        if(t) {
            var alreadyLanded = landedPlanes.filter(function(pl){ return pl.id == p.id});
            if(!alreadyLanded.length){
               appendPlane(landedPlaneList, p);
               landedPlanes.push(p); 
            }
        } else if (p.isAvailable()) {
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
    drawAirPort(airPortInitialposition.x, airPortInitialposition.y, airPortSize, airPortColor)
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

var drawAirPort = function(x, y, size, color) {
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
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

document.addEventListener('keydown', function(e){
    if(selectedPlanes.length){
        changeAllSelectedPlaneDirection(e.keyIdentifier);
    }
})

landedPlaneList.addEventListener('mouseup', function(e){
    var plane = landedPlanes.filter(function(p){
        return p.id == e.target.parentElement.id;
    });
    plane[0].takeOff();
});

function changeAllSelectedPlaneDirection(d){
    selectedPlanes.forEach(function(p){
        if(d === "Up"){
            p.goUp();
        }
        else if(d === "Right"){
            p.goRight();
        }
        else if(d === "Left"){
            p.goLeft();
        }
        else if(d === "Down"){
            p.goDown();
        } else if(d === "U+004B") {
            p.speedUp();
        } else if(d === "U+004D") {
            p.speedDown();
        }
        else
            return;
    });
}

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

function generatePlaneName(){
    var countries = ['fr', 'de', 'uk', 'se', 'us', 'sp', 'gr', 'jp', 'ch', 'sw'];
    var models = ['720', '630', '740', '707', '727', 'A360', 'A350', 'A320'];
    var brands = ['Boeing', 'AirBus', 'Atr', 'Jet'];
    return [brands.getRandomValue(), models.getRandomValue(), countries.getRandomValue()].join('-');
}

function sendPlanes() {
    if(landedPlanes.length) {
        landedPlanes.forEach(function(p, i){
            p.takeOff();
            landedPlanes.splice(i, 1);
            var planeItem = document.getElementById(p.id);
            landedPlaneList.removeChild(planeItem);
        });
    }
}

window.onload = function() {
    var frame = 1000 / 60;
    setInterval(draw, frame);
    setInterval(function(){
        displaySelectedPlanes();
    }, 10000 / 60);
}