var Plane = function(){
    var createGuid = function(){
        var S4 = function(){
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
        }
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }
    this.id = createGuid();

    var plusOrMinus = function(){
        return [-1,1][Math.random()*2|0];
    };

    var getStartPosition = function(){
        return [min, max][Math.random()*2|0];
    };

    if(~plusOrMinus()){
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
}

Plane.prototype.draw = function() {
    if(this.x >= min && this.x <= max && this.y >= min && this.y <= max){
        this.x += this.vx;
        this.y += this.vy;
        context.fillRect(this.x, this.y, 10, 10);
    } else {
        this.isOutOfBound = true;
    }
};

var canvas = document.getElementById("radar");
var planeList = document.getElementById("planeList");
var context = canvas.getContext("2d");
var canvasSize = 1000;
var min = canvasSize * (-0.95);
var max = canvasSize * 1.05;
canvas.width = canvasSize;
canvas.height = canvasSize;
var circleInitialPosition = 500;
var planesCount = 35;
var planes = [];

var startAngle = Math.PI;

var createPlane = function(){
    while(planes.length < planesCount){
        var p = new Plane();
        planes.push(p);
        var planeItem = document.createElement("li");
        var id = document.createElement("b");
        id.appendChild(document.createTextNode(p.id));
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(p.x + ", " + p.y));
        planeItem.appendChild(id);
        planeItem.appendChild(span);
        planeItem.setAttribute("id", p.id);
        planeList.appendChild(planeItem);
    };
}

function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

var drawRadar = function(){
    context.lineWidth = 5;
    context.strokeStyle = '#000';
    context.fillStyle = "rgba(52, 152, 219, 0.8)";
    for (var i = 5; i > 0; i--) {
        drawCircle(circleInitialPosition, circleInitialPosition, i * 100);
    };

    context.moveTo(0, 500);
    context.lineTo(1000, 500);
    context.moveTo(500, 0);
    context.lineTo(500, 1000);
    context.stroke();
}

var drawLine = function(){
    var center = 500;
    context.lineWidth = 8;
    startAngle += 0.01;
    context.moveTo(center, center);
    context.lineTo(center + center * Math.cos(startAngle), center + center * Math.sin(startAngle));
    context.stroke();
}

var drawPlanes = function(){
    context.fillStyle = "rgb(200, 0, 0)";
    createPlane();
    planes.forEach(function(p, i){
        if(!p.isOutOfBound)
            p.draw();
        else {
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
}
 
var drawCircle = function(x, y, rayon){
    context.beginPath();
    context.arc(x, y, rayon, 0, Math.PI*2);
    context.fill();
    context.closePath();
    context.stroke();
}

window.onload = function(){
    setInterval(draw, 1000/60);
}