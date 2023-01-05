function displayMap() {
  var map = L.map("map").setView([51.505, -0.09], 13);

  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

// Retrieve route data
function getData() {
  var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
  var startLocation = "52.520008,13.404954";
  var endLocation = "52.5200,13.404955";
  var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";
  var calculateRouteURL = baseURL + startLocation + ":" + endLocation + "/json?key=" + apiKey;

  // Params > "&routeType=bicycle&travelMode=bike&traffic=true&avoid=motorway"

  // Retrieve the route data
  $.get(calculateRouteURL).then(function (routeData) {
    console.log(routeData);
    displayRoutes(routeData);
  });
}

function displayRoutes(routeData) {
  // Extract the coordinates from route data
  var coordinates = routeData.routes[0].legs[0].points;
  console.log(coordinates);
}

// Initialise
function init() {
  displayMap();
  getData();
}

init();
