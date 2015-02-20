'use strict';

var Radar = require('../radar.js')

var initCircle = function(radar) {
	for (var i = radar.circleCount; i >= 0; i--) {
		radar.circles.push({
			rayon: i * 100
		});
	};
};

var initLines = function(radar) {
	radar.lines.push({
		start: {
			x: 0,
			y: radar.position.y
		},
		end: {
			x: radar.size,
			y: radar.position.y
		}
	});

	radar.lines.push({
		start: {
			x: radar.position.x,
			y: 0
		},
		end: {
			x: radar.position.x,
			y: radar.size
		}
	});
};

module.exports = {
	create: function() {
		var radar = new Radar();

		initCircle(radar);
		initLines(radar);

		return radar;
	}
}