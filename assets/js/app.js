// Global
var map = L.map("map").setView([51.505, -0.09], 13);
var startLocation;
var endLocation;
var routeLine;
var startMarker;
var endMarker;

function displayMap() {
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

function getRouteData(startLocation, endLocation) {
  var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
  var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";
  //var params = "&routeType=bicycle&travelMode=bike&traffic=true&avoid=motorway";
  var calculateRouteURL = `${baseURL}${startLocation}:${endLocation}/json?key=${apiKey}`;

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

  // Create a routeLine from the coordinates and add it to the map
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

function init() {
  displayMap();
  displayCurrentLocation();

  // Click event to draw routeLine on the map between a start and end location
  map.on("click", function (event) {
    // If startLocation is already set, set the endLocation to the clicked location
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

init();
