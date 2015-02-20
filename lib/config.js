'use strict';


var radarSize = 1000;
var planeMinPosition = radarSize * (-0.05);
var planeMaxPosition = radarSize * 1.05;

var config = {
	radar: {
		element: document.getElementById('radar'),
		size: radarSize,
		circleCount: 5,
		planeNumberLimit: 10,
		rayon: 500,
		backgroundColor: 'rgba(0, 161, 80, 0.8)', 
		strokeStyle: '#000', 
		lineWidth: 5,
		position: {
			x: 500,
			y: 500
		},
		wave: {
			lineWidth: 8,
			startAngle: Math.PI, 
			step: 0.01
		}
	},
	plane: {
		minPosition: planeMinPosition,
		maxPosition: planeMaxPosition,
		minAngle: 0.1,
		maxAngle: 1,
		color: 'rgb(200, 0, 0)',
		selectedColor: 'rgb(50, 0, 0)',
		height: 30,
		width: 30
	}
};

module.exports = config;