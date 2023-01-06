// || GLOBAL VARIABLES
var map = L.map("map").setView([51.505, -0.09], 13);
var startLocation;
var endLocation;
var routeLine;
var startMarker;
var endMarker;

function displayMap() {
  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: 'ukHSBSSJvmHto21L0igMtBEPPz5BXrFd7buaLp6nOHvXHev79gRJKl3oqjqK2e0y'
}).addTo(map);
}

function getRouteData(startLocation, endLocation) {
  var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
  var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";

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

init();
