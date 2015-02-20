'use strict';

var Plane = require('../models/plane.js');
var utils = require('../utils');
var config = require('../config').plane;

var getStartPosition = function() {
    return [config.minPosition, config.maxPosition][Math.random() * 2 | 0];
};

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

        var x = utils.getRandomBetween(config.minPosition, config.maxPosition);
        var y = getStartPosition();

		if (~utils.plusOrMinus()) {
		    plane.x = x;
		    plane.y = y;
		} else {
		    plane.y = x;
		    plane.x = y;
		}

		plane.vx = utils.plusOrMinus() * utils.getRandomBetween(config.minAngle, config.maxAngle);
		plane.vy = utils.plusOrMinus() * utils.getRandomBetween(config.minAngle, config.maxAngle);

        plane.color = plane.isSelected ? config.selectedColor : config.color;

		return plane
	}
};