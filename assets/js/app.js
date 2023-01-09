// || GLOBAL VARIABLES
var map = L.map("map").setView([51.505, -0.09], 13);
var startLocation;
var endLocation;
var startMarker;
var endMarker;
var routeLine;
var isRouteDrawn = false;
// var mapLayer = MQ.mapLayer(),
//   map;

// VARIABLES FOR AQI (Air Quality Index)
var url = "http://api.waqi.info/feed/";
var url2 = "/?token=2541043dcded3bc723e5446a29135ac1523b1111";
var city;
var AQI;
var country;

function displayMap() {
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}", {
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: "abcd",
    accessToken: "ukHSBSSJvmHto21L0igMtBEPPz5BXrFd7buaLp6nOHvXHev79gRJKl3oqjqK2e0y",
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
      displayRouteDetails(routeData);
    })
    .catch(function (error) {
      console.error("API ERROR", error);
    });

  // reverse geocode API to get details on clicks
  $.get(`https://api.tomtom.com/search/2/reverseGeocode/${startLocation}.json?key=${apiKey}`)
    .then(function (startAddress) {
      console.log(startAddress);
      // Extract the city and country from the startAddress
      city = startAddress.addresses[0].address.municipality;
      country = startAddress.addresses[0].address.country;
      street = startAddress.addresses[0].address.street;
      postalCode = startAddress.addresses[0].address.extendedPostalCode;

      console.log(city);
      updateResultsPage();
      updateAQI(city);
    })
    .catch(function (error) {
      console.error("API GEO ERROR", error);
    });
}

function saveButton() {
  var saveButton = L.easyButton({
    position: "bottomright",
    title: "Save route",
    leafletClasses: true,
    className: "leaflet-bar leaflet-control",
    states: [
      {
        stateName: "save-route",
        icon: "fas fa-save",
        title: "Save route",
        onClick: function () {
          saveRoute(city, country, street, postalCode);
        },
      },
    ],
  }).addTo(map);
}

function saveRoute(city, country, street, postalCode) {
  if (!isRouteDrawn) return;

  console.log(city);
  var savedRouteData = JSON.parse(localStorage.getItem("routeData")) || [];

  var routeData = {
    city: city,
    country: country,
    street: street,
    postCode: postalCode,
    aqi: AQI,
    weather: "Current Weather variable", // update when completed
    latlngs: routeLine._latlngs,
  };

  // Add newly saved routeData to the beginning of the array
  savedRouteData.unshift(routeData);

  // And keep only the first 4 elements
  savedRouteData = savedRouteData.slice(0, 4);

  localStorage.setItem("routeData", JSON.stringify(savedRouteData));
}

function displayRoute(routeData) {
  // Extract the coordinates from route data
  var coordinates = routeData.routes[0].legs[0].points.map(function (coordinate) {
    // Transform each coordinate object to a Leaflet Latitude, Longitude object
    return L.latLng(coordinate.latitude, coordinate.longitude);
  });

  // Create a routeLine from the coordinates and add it to the map
  routeLine = L.polyline(coordinates, { color: "blue" }).addTo(map).snakeIn();
}

function onRouteClick(event) {
  // If a route is already drawn, display a popup and exit the function
  if (isRouteDrawn) {
    L.popup().setLatLng(event.latlng).setContent("Please clear the route before adding a new one").openOn(map);
    return;
  }

  // If the start location has not been set, set it to the clicked location and add a marker
  if (!startLocation) {
    startLocation = event.latlng.lat + "," + event.latlng.lng;
    startMarker = L.marker(event.latlng).addTo(map);
    return;
  }

  // If the start location has been set, set the end location to the clicked location and add a marker
  endLocation = event.latlng.lat + "," + event.latlng.lng;
  endMarker = L.marker(event.latlng).addTo(map);

  getRouteData(startLocation, endLocation);

  isRouteDrawn = true;
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
  map.on("locationfound", function (location) {
    currentLocation = location.latlng.lat + "," + location.latlng.lng;

    getRouteData(currentLocation);
  });
}

function clearRoute(clearRouteButton) {
  if (!isRouteDrawn) return;

  // Remove the routeLine and markers from the map
  if (routeLine) map.removeLayer(routeLine);
  if (startMarker) map.removeLayer(startMarker);
  if (endMarker) map.removeLayer(endMarker);

  // Remove popups from the map
  map.closePopup();

  // Reset
  startLocation = null;
  endLocation = null;
  startMarker = null;
  endMarker = null;
  isRouteDrawn = false;

  clearRouteButton.disable();
}

function clearRouteButton() {
  var clearButton = L.easyButton({
    position: "bottomright",
    title: "Clear route",
    leafletClasses: true,
    className: "leaflet-bar leaflet-control",
    states: [
      {
        stateName: "clear-route",
        icon: "fas fa-trash",
        title: "Clear route",
        onClick: function () {
          clearRoute(clearButton);
        },
      },
    ],
  }).addTo(map);
}

function displayRouteDetails(routeData) {
  var routeDistance = routeData.routes[0].summary.lengthInMeters;
  var routeDuration = routeData.routes[0].summary.travelTimeInSeconds;
  var arrivalTime = routeData.routes[0].summary.arrivalTime;
  var departureTime = routeData.routes[0].summary.departureTime;

  // Data for route to display on our page, if someone gets the chance when the design is done

}


// function trafficMap() {
//   L.control
//     .layers(
//       {
//         Map: mapLayer,
//         Satellite: MQ.satelliteLayer(),
//         Dark: MQ.darkLayer(),
//         Light: MQ.lightLayer(),
//       },
//       {
//         "Traffic Flow": MQ.trafficLayer({ layers: ["flow"] }),
//         "Traffic Incidents": MQ.trafficLayer({ layers: ["incidents"] }),
//       }
//     )
//     .addTo(map);
// }

var placeHolder = $('#placeholder')
console.log(placeHolder)
// Search control within map
function search() {
  var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
  })
    .on("markgeocode", function (e) {
      console.log(e);

      var bbox = e.geocode.bbox;

      var poly = L.polygon([bbox.getSouthEast(), bbox.getNorthEast(), bbox.getNorthWest(), bbox.getSouthWest()]).addTo(
        map
      );
      map.fitBounds(poly.getBounds());

      city = e.geocode.properties.address.city;
      country = e.geocode.properties.address.country;
      street = "Not available";
      postalCode = "Not Available";

      // Update the page with the new data
      updateResultsPage();
      updateAQI(city);
    })
    .addTo(map);
}

function updateAQI(city) {
  $.get(url + city + url2).then(function (currentData) {
    console.log(currentData);

    AQI = currentData.data.aqi;
    $("#aqi").text(`(Test AQI): ${AQI}`);

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
}

function updateResultsPage() {
  $("#address_title").text(`${city}, ${country}`);
  $("#address").text(`${street}, ${postalCode}`);
}

// DISPLAY WEATHER ICON
var baseURL = 'https://api.openweathermap.org/data/2.5/';
var currentURL = baseURL + `weather?appid=6dbbcb8584e56ab51c6d42e5b87ce402&units=metric&`;
var iconUrl = 'https://openweathermap.org/img/w/';
var weatherId = $('#weather');
var city = 'London';

function displayWeatherIcon() {
  $.get(currentURL + `q=${city}`)
        .then(function(currentWeather) {
            console.log(currentWeather)
          
            weatherId.append(`
            <div>
                <h3><img src="${iconUrl + currentWeather.weather[0].icon + '.png'}" alt="">
                </h3>
            </div>
            `)  
        })
      }

// || INITIALISE THE PAGE
function init() {
  // Call Functions
  displayMap();
  displayWeatherIcon();
  displayCurrentLocation();
  search();
  clearRouteButton();
  saveButton();
  // trafficMap();
  

  // Click Events
  map.on("click", onRouteClick);
}

init();
