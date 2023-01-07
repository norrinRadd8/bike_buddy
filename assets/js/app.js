// || GLOBAL VARIABLES
var map = L.map("map").setView([51.505, -0.09], 13);
var startLocation;
var endLocation;
var routeLine;
var startMarker;
var endMarker;
var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";

var isRouteDrawn = false;
var mapLayer = MQ.mapLayer(),
  map;
// VARIABLES FOR AQI (Air Quality Index)

var url = "http://api.waqi.info/feed/";
var url2 = "/?token=2541043dcded3bc723e5446a29135ac1523b1111";
var city = "London";


function displayMap() {
  // Add a tile layer to the map
  L.tileLayer(
    "https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
      attribution:
        '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 0,
      maxZoom: 22,
      subdomains: "abcd",
      accessToken:
        "ukHSBSSJvmHto21L0igMtBEPPz5BXrFd7buaLp6nOHvXHev79gRJKl3oqjqK2e0y",
    }
  ).addTo(map);
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
  var coordinates = routeData.routes[0].legs[0].points.map(function (
    coordinate
  ) {
    // Transform each coordinate object to a Leaflet Latitude, Longitude object
    return L.latLng(coordinate.latitude, coordinate.longitude);
  });

  // Create a route line from the coordinates and add it to the map
  routeLine = L.polyline(coordinates, { color: "blue" }).addTo(map);

  // Zoom the map to fit the routeLine
  map.fitBounds(routeLine.getBounds());
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

function clearRoute() {
  // Remove the routeLine and markers from the map
  map.removeLayer(routeLine);
  map.removeLayer(startMarker);
  map.removeLayer(endMarker);

  // Reset
  startLocation = null;
  endLocation = null;
  startMarker = null;
  endMarker = null;
  isRouteDrawn = false;
}

function createClearRouteButton() {
  L.easyButton({
    position: "bottomright",
    title: "Clear route",
    leafletClasses: true,
    className: "leaflet-bar leaflet-control",
    states: [
      {
        stateName: "clear-route",
        icon: "fas fa-trash",
        title: "Clear route",
        onClick: clearRoute,
      },
    ],
  }).addTo(map);
}

function trafficMap() {
  L.control
    .layers(
      {
        Map: mapLayer,
        Satellite: MQ.satelliteLayer(),
        Dark: MQ.darkLayer(),
        Light: MQ.lightLayer(),
      },
      {
        "Traffic Flow": MQ.trafficLayer({ layers: ["flow"] }),
        "Traffic Incidents": MQ.trafficLayer({ layers: ["incidents"] }),
      }
    )
    .addTo(map);
}

// || INITIALISE THE PAGE
function init() {
  displayMap();
  displayCurrentLocation();
  search();
  createClearRouteButton();
  trafficMap();


  // Click event to draw routeLine on the map between a start and end location
  map.on("click", function (event) {
    // If a route is not drawn and a start location is not set, set the start location to the clicked location
    if (!isRouteDrawn && !startLocation) {
      startLocation = event.latlng.lat + "," + event.latlng.lng;
      (startMarker = L.marker(event.latlng)).addTo(map);
    } else if (!isRouteDrawn) {
      // If a route is not drawn and a start location is set, set the end location to the clicked location
      endLocation = event.latlng.lat + "," + event.latlng.lng;
      endMarker = L.marker(event.latlng).addTo(map);

      // Retrieve route data and display it on the map
      getRouteData(startLocation, endLocation);

      // Indicate that a route is drawn
      isRouteDrawn = true;
    } else {
      // If a route is drawn, display a popup to inform the user to clear the route first
      L.popup()
        .setLatLng(event.latlng)
        .setContent("Please clear the route before adding a new one")
        .openOn(map);
    }
  });
}

// Search control within map
function search() {
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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

// AQI (Air Quality index API) CODE

$.get(url + city + url2).then(function (currentData) {
  console.log(currentData);

  $("#aqi").append(`
  ${city} 
  <p id="AQIndex"> AQI:${currentData.data.aqi}</p>
  (Air Quality)
  
  `);

  var AQI = currentData.data.aqi;
  console.log(AQI);

  if (AQI <= 50) {
    $("#qualityBox").css({ backgroundColor: "green", color: "white" });
  }

  if (AQI >= 50) {
    $("#qualityBox").css({ backgroundColor: "orange", color: "white" });
  }

  if (AQI >= 100) {
    $("#qualityBox").css({ backgroundColor: "red", color: "white" });
  }
});
