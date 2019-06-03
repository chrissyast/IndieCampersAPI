require ("isomorphic-fetch")

'use strict';


//var mongoose = require('mongoose'),
//  Task = mongoose.model('Tasks');

// exports.list_all_tasks = function(req, res) {
//   Task.find({}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB6eoTpuX_AHKj3tsKkKcr8S2uyhjFCm4k',
  Promise: Promise
});


/* include any js files here */

//include('js/myFile2.js');

exports.find_locations = function(req, res) {

    res.json(searchCoordinates(req.params.startLat,req.params.startLong,req.params.endLat,req.params.endLong,req.params.detour))

  }
  //);
//};



var map, places, infoWindow;
      var markers = [];
      var autocomplete;
      var countryRestrict = {'country': 'us'};
      var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
      var hostnameRegexp = new RegExp('^https?://.+?/');
      var startPoint;
      var endPoint;
      var detourDistance;
   
      var searchComplete = false;
    var googleAPI = 'AIzaSyB6eoTpuX_AHKj3tsKkKcr8S2uyhjFCm4k'
   


var searchCoordinates = function(startLat,startLong,endLat,endLong,detour){
 
fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248bcb5125eeeef41cba41fe3a00de9e7e9&start=${startLong},${startLat}&end=${endLong},${endLat}`)
  .then(response => response.json())
  .then(data =>  tripPoints = data.features[0].geometry.coordinates)
  //return 
  .finally(function(){
  findPlacesWithinRangeOfRoute(tripPoints,detour);
  });
}



async function findPlacesWithinRangeOfRoute() {
  
  var point = [49.215369,2.627365]
  var results = await googlePlaces(point)
    console.log('line 69')
     console.log(results)
    
    //(function(){
    
      
    var placesJSObjects = [];
    results.forEach(function(place) {
      placeJSO = new PlaceOfInterest(place.name,place.rating,new Location(place.geometry.location.lat(),place.geometry.location.lng())) //these are just two objects I've created with those properties
      placesJSObjects.push(placeJSO);   
    //})
   return placesJSObjects;
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


function googlePlaces(point) {


var placesOfInterest = [];

var latLng = (point[1]+','+point[0])
  var request = {
      location: latLng,
      radius: 10000
  };

  
    googleMapsClient.placesNearby(request).asPromise()
    
    .then(function(response){        
       placesOfInterest.push(response.json.results)      
          
    }) 

    .finally(function(){

       console.log('end of googlePlaces function:')
       console.log(placesOfInterest);
       return(placesOfInterest);
    
      })
    
  }
  
   

/*
googleMapsClient.placesNearby(request,
    function(err,response){
        
        if(!err){
          console.log('after push')
          placesOfInterest.push(response.json.results)      
        }
        else{
          console.log("it's fucked")
        } 
             
    }); 
    i++;
    if(i==points.length) {
      console.log("I'm here");
      console.log(placesOfInterest);
      return placesOfInterest;
    }
    else {
      console.log('round ' + i + '....fight!')
    }
  }
    }*/

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


function findTripPointsHalfDetourApart(tripPoints,detour) {
var spacedOutTripPoints = [];
var pointOfReference = tripPoints[0];
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

        return degreesDifference * 111;
}

