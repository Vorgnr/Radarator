'use strict';

function Drawer(context) {
	this.context = context;
};

Drawer.prototype.drawRadar = function(radar, x, y) {
	this.context.lineWidth = radar.lineWidth;
	this.context.strokeStyle = radar.strokeStyle;
	this.context.fillStyle = radar.backgroundColor;

	radar.circles.forEach(function(c) {
		this.drawCircle(x, y, c.rayon);
	}.bind(this));

	radar.lines.forEach(function(l) {
		this.drawLine(l.start, l.end);
	}.bind(this));

	radar.wave.startAngle += radar.wave.step;
	this.drawWave(radar.position, radar.rayon, 
		radar.wave.lineWidth, 
		radar.wave.startAngle);
};

Drawer.prototype.drawCircle = function(x, y, rayon) {
    this.context.beginPath();
    this.context.arc(x, y, rayon, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();
    this.context.stroke();
}

Drawer.prototype.drawLine = function(start, end) {
	this.context.moveTo(start.x , start.y);
	this.context.lineTo(end.x, end.y);
	this.context.stroke();
};

Drawer.prototype.drawWave = function(start, rayon, lineWidth, startAngle) {
	this.context.lineWidth = lineWidth;
	this.drawLine(start, {
		x: start.x + rayon * Math.cos(startAngle),
		y: start.y + rayon * Math.sin(startAngle)
	});
	this.context.stroke();
};

Drawer.prototype.drawPlanes = function(planes) {
	planes.forEach(function(p) {
		this.drawPlane(p);
	}.bind(this));
};

Drawer.prototype.drawPlane = function(plane) {
	this.context.fillStyle = plane.color;
	this.context.fillRect(plane.x, plane.y, plane.height, plane.width);
};

module.exports = Drawer;