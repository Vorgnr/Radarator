var radarFactory = require('./factories/radarFactory');
var planeFactory = require('./factories/planeFactory');
var Drawer = require('./drawer');
var config = require('./config');

Array.prototype.getRandomValue = function() {
    return this[Math.floor(Math.random() * this.length)];
};

var drawer;
var radar;

var init = (function(){
	drawer = new Drawer(config.radar.element.getContext("2d"));
	radar = radarFactory.create();
	config.radar.element.width = config.radar.size;
	config.radar.element.height = config.radar.size;
})();

var main = function() {
	drawer.drawRadar(radar, config.radar.position.x, config.radar.position.y);
    radar.createPlanes();
    radar.movePlanes();
    drawer.drawPlanes(radar.getAvailablePlanes());
}

window.onload = function() {
    var frame = 1000 / 60;
    setInterval(main, frame);
    //main();
}
