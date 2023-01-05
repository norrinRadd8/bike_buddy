// Global
var map = L.map("map").setView([51.505, -0.09], 13);
var startLocation;
var endLocation;
var routeLine;

function displayMap() {
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // L.control.locate().addTo(map);
}

function getRouteData(startLocation, endLocation) {
  var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
  var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";
  var calculateRouteURL = `${baseURL}${startLocation}:${endLocation}/json?key=${apiKey}&travelMode=bicycle&traffic=true&routeType=thrilling&hilliness=low`;

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
  // Remove the routeLine from the map
  map.removeLayer(routeLine);

  // Reset the locations
  startLocation = null;
  endLocation = null;
}

function init() {
  displayMap();

  // Click event to draw routeLine on the map between a start and end location
  map.on("click", function (event) {
    // If start location is already set, set the end location to the clicked location
    if (!startLocation) {
      startLocation = event.latlng.lat + "," + event.latlng.lng;
    } else {
      endLocation = event.latlng.lat + "," + event.latlng.lng;

      // Retrieve route data and display it on the map
      getRouteData(startLocation, endLocation);
    }
  });
}

init();
