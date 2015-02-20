'use strict';

module.exports = {
    getRandomBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    createGuid: function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return S4().toLowerCase();
    },

    plusOrMinus: function() {
        return [-1, 1][Math.random() * 2 | 0];
    },

    isPointInRect: function(ra, rc, p) {
        var x1 = Math.min(ra.x, rc.x);
        var x2 = Math.max(ra.x, rc.x);
        var y1 = Math.min(ra.y, rc.y);
        var y2 = Math.max(ra.y, rc.y);
        return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
    },

    generatePlaneName: function() {
        var countries = ['fr', 'de', 'uk', 'se', 'us', 'sp', 'gr', 'jp', 'ch', 'sw'];
        var models = ['720', '630', '740', '707', '727', 'A360', 'A350', 'A320'];
        var brands = ['Boeing', 'AirBus', 'Atr', 'Jet'];
        return [brands.getRandomValue(), models.getRandomValue(), countries.getRandomValue()].join('-');
    }
}