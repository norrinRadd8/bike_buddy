// || GLOBAL VARIABLES
var map = L.map("map").setView([51.505, -0.09], 13);
var startLocation;
var endLocation;
var routeLine;
var startMarker;
var endMarker;
var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";

function displayMap() {
  // Add a tile layer to the map
  L.tileLayer("https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=2fce13a5a3924a44beca122bc08ecb82", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>',
  }).addTo(map);
}

function getRouteData(startLocation, endLocation) {
  var calculateRouteURL = `${baseURL}${startLocation}:${endLocation}/json?key=${apiKey}&travelMode=bicycle&traffic=true&routeType=thrilling&hilliness=low&avoid=motorways&avoid=tollRoads&avoid=ferries&avoid=unpavedRoads`;
  // Info for params > travelMode plots route with bicycle lanes if pos + traffic plots route with least traffic + routeType allows the use of hilliness to plot routes with low elevation + avoid motorways, tollRoads, ferries & unpavedRoads

  // Retrieve the route data from TOMTOM
  $.get(calculateRouteURL)
    .then(function (routeData) {
      // Pass route data to displayRoute()
      displayRoute(routeData);
    })
    .catch(function (error) {
      console.error("API ERROR", error);
    });
}

function displayRoute(routeData) {
  // Extract the coordinates from route data
  var coordinates = routeData.routes[0].legs[0].points.map(function (coordinate) {
    // Transform each coordinate object to a Leaflet Latitude, Longitude object
    return L.latLng(coordinate.latitude, coordinate.longitude);
  });

  // Create a route line from the coordinates and add it to the map
  routeLine = L.polyline(coordinates, { color: "blue" }).addTo(map);

  // Zoom the map to fit the routeLine
  map.fitBounds(routeLine.getBounds());
}

function clearRoute() {
  // Remove the routeLine and markers from the map
  map.removeLayer(routeLine);
  map.removeLayer(startMarker);
  map.removeLayer(endMarker);

  // Reset the locations and markers
  startLocation = null;
  endLocation = null;
  startMarker = null;
  endMarker = null;
}

function displayCurrentLocation() {
  L.control
    .locate({
      position: "topright",
      strings: {
        title: "Show current location",
      },
    })
    .addTo(map);
}

// || INITIALISE THE PAGE
function init() {
  displayMap();
  displayCurrentLocation();
  search();

  // Click event to draw routeLine on the map between a start and end location
  map.on("click", function (event) {
    // If start location is already set, set the end location to the clicked location
    if (!startLocation) {
      startLocation = event.latlng.lat + "," + event.latlng.lng;
      startMarker = L.marker(event.latlng).addTo(map);
    } else {
      endLocation = event.latlng.lat + "," + event.latlng.lng;
      endMarker = L.marker(event.latlng).addTo(map);

      // Retrieve route data and display it on the map
      getRouteData(startLocation, endLocation);
    }
  });
}

// Search control within map
function search() {

var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
})
  .on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest()
    ]).addTo(map);
    map.fitBounds(poly.getBounds());
  })
  .addTo(map);
}

init();
