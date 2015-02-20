'use strict';

var config = require('./config');

function Radar() {
	this.circleCount = config.radar.circleCount;
    this.rayon = config.radar.rayon;
	this.backgroundColor = config.radar.backgroundColor;
	this.strokeStyle = config.radar.strokeStyle;
	this.lineWidth = config.radar.lineWidth;
	this.planes = [];
	this.circles = [];
	this.lines = [];
    this.position = config.radar.position;
    this.size = config.radar.size;
    this.wave = config.radar.wave;
};

module.exports = Radar;