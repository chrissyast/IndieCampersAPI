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


function include(file)
{

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

/* include any js files here */

//include('js/myFile2.js');

exports.read_a_task = function(req, res) {
  // //Task.findById(req.params.taskId, 
  //   function(err, task) {
  //   if (err)
  //     res.send(err);
    //res.json(req.params.startLat +  req.params.startLong + req.params.endLat + req.params.endLong + req.params.detour);
    //res.hello(req);
    //loadScript('https://apis.google.com/js/api.js',searchCoordinates(req.params.startLat,req.params.startLong,req.params.endLat,req.params.endLong,req.params.detour))
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
   //   var tripPoints;
      var searchComplete = false;
    var googleAPI = 'AIzaSyB6eoTpuX_AHKj3tsKkKcr8S2uyhjFCm4k'
    //var placesOfInterest = [];


var searchCoordinates = function(startLat,startLong,endLat,endLong,detour){
//function searchCoordinates(startLat,startLong,endLat,endLong,detour){
//detourDistance = document.getElementById("detour").value;

  
fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248bcb5125eeeef41cba41fe3a00de9e7e9&start=${startLong},${startLat}&end=${endLong},${endLat}`)
  .then(response => response.json())
  .then(data =>  tripPoints = data.features[0].geometry.coordinates)
  //return 
  .finally(function(){
  findPlacesWithinRangeOfRoute(tripPoints,detour);
  });
}

// function getIconForProperty(property) {
//   switch (property) {
//     case "startFrom":
//         return "icons/logo_start.png";
//     case "goTo":
//         return "icons/logo_end.png";
//     case "normal":  
//         return "icons/logo.png";
//     default:
//         return(null);
//   }
// }

async function findPlacesWithinRangeOfRoute(tripPoints,detour) {
    var points = findTripPointsHalfDetourApart(tripPoints,detour);
    //placesOfInterest = 
    //var placesOfInterest = googlePlaces(points)
  /*  console.log('line 100')
    console.log(googlePlaces(points))
    //return googlePlaces(points);
    const promise = new Promise((resolve,reject) => {
    resolve('Stuff worked');
    reject('Error it broke')
    })
  */  
   var result = await googlePlaces(points)
  console.log('line 109')
   console.log(place)
   // .then(function(){console.log('successful')},function(){console.log('unsuccessful')})
   // .catch(() => console.log("it's fucked"));
    
    .then(function(){
    console.log('line 113');
    console.log(placesOfInterest);
      
    flattenedPOIArray = flattenedPOIArray.filter(onlyUnique);
    console.log(flattenedPOIArray);
    var placesJSObjects = [];
    flattenedPOIArray.forEach(function(place) {
      placeJSO = new PlaceOfInterest(place.name,place.rating,new Location(place.geometry.location.lat(),place.geometry.location.lng()))
      placesJSObjects.push(placeJSO);   
    })
   // placesOfInterest = placesOfInterest.filter(onlyUnique);
    //flattenedPOIArray = [].concat.apply([],placesOfInterest);
   
   // console.log('hi');
 //   flattenedPOIArray = flattenedPOIArray.filter(onlyUnique);
   // console.log(flattenedPOIArray);
 //   var placesJSObjects = [];
 /*   flattenedPOIArray.forEach(function(place) {
      placeJSO = new PlaceOfInterest(place.name,place.rating,new Location(place.geometry.location.lat(),place.geometry.location.lng()))
      placesJSObjects.push(placeJSO);

    });*/
  //var test = JSON.stringify(placesJSObjects);
  //var test = JSON.stringify(placesOfInterest);
     //return(test);
  //   return(test);
      //saveToFirebase(test);
})}

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


async function googlePlaces(points) {
var i=0;
var placesOfInterest = [];
for (point of points){

var latLng = (point[1]+','+point[0])
  var request = {
    location: latLng,
  //  location: [49.215369,2.627365],
    radius: 10000
  };

  
    googleMapsClient.placesNearby(request).asPromise()
    //.then(function(err,response){
    .then(function(response){        
        //if(!err){
        //  console.log('inside function')
          placesOfInterest.push(response.json.results)      

             
    }) 

    .finally(function(){
      i++;
      if (i==points.length){
      //  console.log('returning!')
      //  console.log(placesOfInterest)
         placesOfInterest = placesOfInterest.filter(onlyUnique);
        flattenedPOIArray = [].concat.apply([],placesOfInterest);
           var placesJSObjects = [];
    flattenedPOIArray.forEach(function(place) {
      //console.log(flattenedPOIArray[0].geometry.location.lat)

       placeJSO = new PlaceOfInterest(place.name,place.rating,new Location(place.geometry.location.lat,place.geometry.location.lng))
       placesJSObjects.push(placeJSO);
       }); // other end of forEach
  //     console.log('line 175');
   //    console.log(placesJSObjects);
       var test = JSON.stringify(placesJSObjects);
      console.log('end of googlePlaces function:')
       console.log(test);
       return(test);
    
      }
    /*  else {
        console.log('Round ' + i + ' of ' + points.length)
      }*/
    //console.log(placesOfInterest)
    //return(placesOfInterest)
  })
      }
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

