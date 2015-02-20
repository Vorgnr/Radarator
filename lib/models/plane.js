'use strict';

var utils = require('../utils')
var config = require('../config').plane;

var Plane = function() {
    this.id = utils.createGuid();
    this.speed = 1;
    this.isOutOfBound = false;
    this.isAtAirPort = false;
    this.passengerCount = Math.round(utils.getRandomBetween(2, 400));
    this.name = generatePlaneName();
}

Plane.prototype.isAvailable = function() {
    return !this.isOutOfBound && !this.isCrashed && !this.isAtAirPort;
};

// Plane.prototype.isOutOfBound = function() {
//     return this.x < config.minPosition && this.x > config.maxPosition && this.y < config.minPosition && this.y > config.maxPosition
// }

Plane.prototype.isLanded = function() {
    this.isAtAirPort = utils.isPointInRect(
    	{ x: airPortInitialposition.x, y: airPortInitialposition.y }, 
        { x: airPortInitialposition.x + airPortSize, y: airPortInitialposition.y + airPortSize }, 
        { x: this.x, y: this.y });
    return this.isAtAirPort;
}

Plane.prototype.takeOff = function() {
    this.runway = [1, 2, 3, 4].getRandomValue();
    var x,y;
    switch(this.runway) {
        case 1:
            x = 500;
            y = 400;
            this.goUp();
            break;
        case 2:
            x = 600;
            y = 500;
            this.goRight();
            break;
        case 3:
            x = 500;
            y = 600;
            this.goDown();
            break;
        case 4:
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

module.exports = Plane;