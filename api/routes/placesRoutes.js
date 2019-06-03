'use strict';
module.exports = function(app) {
  var places = require('../controllers/placesController');
 // var places = require('../controllers/scriptTest');
  app.route('/places/:startLat&:startLong&:endLat&:endLong&:detour')
    .get(places.find_locations)

};
