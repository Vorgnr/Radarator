'use strict';

var Plane = require('../models/plane.js');
var utils = require('../utils')
var config = require('../config')

var getStartPosition = function() {
    return [min, max][Math.random() * 2 | 0];
};

var createPlane = function() {
    while (planes.length < planesCount) {
        var p = new Plane();
        planes.push(p);
        appendPlane(planeList, p);
    };
}

module.exports = {
	createN: function(n) {
		var planes = [];
		for (var i = 0; i < n; i++) {
			planes.push(this.createOne());
		};
		return planes;
	},
	
	createOne: function() {
		var plane = new Plane();

		if (~utils.plusOrMinus()) {
		    plane.x = utils.getRandomBetween(config.plane.minAngle, config.plane.maxAngle);
		    plane.y = getStartPosition();
		} else {
		    plane.y = utils.getRandomBetween(config.plane.minAngle, config.plane.maxAngle);
		    plane.x = getStartPosition();
		}

		plane.vx = utils.plusOrMinus() * utils.getRandomBetween(config.plane.minAngle, config.plane.maxAngle);
		plane.vy = utils.plusOrMinus() * utils.getRandomBetween(config.plane.minAngle, config.plane.maxAngle);

		return plane
	}
};