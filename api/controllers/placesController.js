require ("isomorphic-fetch")

'use strict';




var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB6eoTpuX_AHKj3tsKkKcr8S2uyhjFCm4k',
  Promise: Promise
});



exports.find_locations = function(req, res) {
    var startLong = req.params.startLong
    var startLat = req.params.startLat
    var endLong = req.params.endLong
    var endLat = req.params.endLat
    var detour = req.params.detour

    fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248bcb5125eeeef41cba41fe3a00de9e7e9&start=${startLong},${startLat}&end=${endLong},${endLat}`)
    
  .then(response => response.json())
  .then(data =>  tripPoints = data.features[0].geometry.coordinates)
  
  .finally(async function(){

        var points = findTripPointsHalfDetourApart(tripPoints,detour);
        var i=0;
        var placesOfInterest = [];
        
        for (point of points){  
            var response = await makeGoogleRequest(point);
            placesOfInterest.push(response.json.results)
        }

        placesOfInterest = placesOfInterest.filter(onlyUnique);
        flattenedPOIArray = [].concat.apply([],placesOfInterest);
        var placesJSObjects = [];
        flattenedPOIArray.forEach(function(place) {
            placeJSO = new PlaceOfInterest(place.name,place.rating,new Location(place.geometry.location.lat,place.geometry.location.lng))
            placesJSObjects.push(placeJSO);
          })
        var result = JSON.stringify(placesJSObjects);
        res.json(result);    
      })
}

class PlaceOfInterest{
  constructor(name,rating,location) {
  this.name = name;
  this.rating = rating;
  this.location = location;
  }
}

class Location{
  constructor(latitude,longitude){
  this.latitude = latitude;
  this.longitude = longitude;
  }
}


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


function findTripPointsHalfDetourApart(tripPoints,detour) {
var spacedOutTripPoints = [];
var pointOfReference = tripPoints[0];
spacedOutTripPoints.push(pointOfReference)
  for (var i = 1; i<tripPoints.length; i++) {
    var comparisonPoint = tripPoints[i]
      if (workOutDistanceBetween(pointOfReference,comparisonPoint) > (detour/2)) {
          spacedOutTripPoints.push(comparisonPoint);
          pointOfReference = comparisonPoint;
      }
      i++;
  }

  return spacedOutTripPoints;

}


function workOutDistanceBetween(point1,point2){

    var longitudeDifference = point1[0] - point2[0]
        var latitudeDifference = point1[1] - point2[1];

        var degreesDifference = Math.pow((Math.pow(longitudeDifference,2) + Math.pow(latitudeDifference,2)),0.5);

        return degreesDifference * 111;   // based on the slightly inaccurate assumption that 1 degree lat = 1 degree long = 111kms
}


function makeGoogleRequest(point) {

    var latLng = (point[1]+','+point[0])
    var request = {
      location: latLng,
      radius: 10000
    };

    return googleMapsClient.placesNearby(request).asPromise();
}