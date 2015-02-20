'use strict';

var config = require('./config');
var planeFactory = require('./factories/planeFactory');
var availablePlanes = [];

function Radar() {
	this.circleCount = config.radar.circleCount;
    this.rayon = config.radar.rayon;
	this.backgroundColor = config.radar.backgroundColor;
	this.strokeStyle = config.radar.strokeStyle;
	this.lineWidth = config.radar.lineWidth;
	this.planes = [];
    this.planesNumberLimit = config.radar.planeNumberLimit;
	this.circles = [];
	this.lines = [];
    this.position = config.radar.position;
    this.size = config.radar.size;
    this.wave = config.radar.wave;
};

Radar.prototype.createPlanes = function() {
    var planeToCreate = this.planesNumberLimit - this.planes.length;
    this.planes = this.planes.concat(planeFactory.createN(planeToCreate));
}

Radar.prototype.movePlanes = function() {
    this.getAvailablePlanes().forEach(function(p) {
        p.move();
    });
    this.refreshPlanes();
};

Radar.prototype.refreshPlanes = function() {
    this.planes = this.getAvailablePlanes();
};

Radar.prototype.getAvailablePlanes = function() {
    if(!availablePlanes.length) {
        availablePlanes = this.planes.filter(function(p) {
            return p.isAvailable();
        });
    }
    return availablePlanes;
};

module.exports = Radar;