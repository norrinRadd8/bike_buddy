// || GLOBAL VARIABLES

// Initialise the map and set the initial view when page is first loaded
var map = L.map("map").setView([51.505, -0.09], 13);

var startLocation;
var endLocation;
var startMarker;
var endMarker;
var routeLine;
var isRouteDrawn = false; // to determine whether a route is drawn or not, default false
var country;
var city = "Leeds";
var AQI;
var country;
var weatherRouteData;

var mapLayer = MQ.mapLayer(),
  map;


  // Hide & Show Elements
  var page1 = $('#page1');
  var page2 = $('#page2');
  
  page2.hide()
 
  $('body').css('overflow','hidden') 

  var startBtn = $('#startedButton')
    startBtn.click(function() {
    page1.hide(1000)
    page2.show();

    $('body').css('overflow','hidden') 

  });

  var sideLogo = $('#sideLogo')
    sideLogo.click(function() {

    page1.show(1000);
    page2.hide();

    document.body.style.overflow = "scroll";
  });


  // Modal Tooltips
  var greyScreen = $('#greyScreen');
  var modal1 = $('#modal1');
  var modal2 = $('#modal2');
  var modal3 = $('#modal3');
  var modal4 = $('#modal4');
  var modal5 = $('#modal5');

  $('#greyScreen').hide();
  $('#modal1').hide();
  $('#modal2').hide();
  $('#modal3').hide();
  $('#modal4').hide();
  $('#modal5').hide();

  function modalScreen() {

    var ls = localStorage.getItem('namespace.visited');
    if (ls == null) {
        
        localStorage.setItem('namespace.visited', 1)
    }
    
    if(ls !== null){
     
      return;
    }

  $('#greyScreen').show();
  $('#modal1').show();
  $('#modal2').hide();
  $('#modal3').hide();
  $('#modal4').hide();
  $('#modal5').hide();

modal1.click(function(){
  $('#modal1').hide();
  $('#modal2').show();

})

modal2.click(function(){
  $('#modal2').hide();
  $('#modal3').show();

})

modal3.click(function(){
  $('#modal3').hide();
  $('#modal4').show();

})

modal4.click(function(){
  $('#modal4').hide();
  $('#modal5').show();

})

modal5.click(function(){
  $('#modal1').hide();
  $('#modal5').hide();
  $('#greyScreen').hide();

})

  var greyScreen = $('#greyScreen');
  greyScreen.click(function() {
   

  })



};

// Displays the map/tile layer to the map
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

// Gets data for the route from TOMTOM API's
function getRouteData(startLocation, endLocation) {
  var apiKey = "7kW5591HWQBXAVyMwGHUlDFNjWbvrhTF";
  var baseURL = "https://api.tomtom.com/routing/1/calculateRoute/";
  var calculateRouteURL = `${baseURL}${startLocation}:${endLocation}/json?key=${apiKey}&travelMode=bicycle&traffic=true&routeType=thrilling&hilliness=low&avoid=motorways&avoid=tollRoads&avoid=ferries&avoid=unpavedRoads`;
  // Info for params > travelMode plots route with bicycle lanes if pos + traffic plots route with least traffic + routeType allows the use of hilliness to plot routes with low elevation + avoid motorways, tollRoads, ferries & unpavedRoads
  if (startLocation && endLocation) {
    // console.log(startLocation);
    // Retrieve the route data from TOMTOM
    $.get(calculateRouteURL)
      .then(function (routeData) {
        // Pass route data to other Functions
        displayRoute(routeData);
        // displayRouteDetails(routeData);
      })
      .catch(function (error) {
        console.error("API ERROR", error);
      });
  }

  if (startLocation) {
    // Reverse geocode the start location to get address details (when a route is plotted - the startLocation is the start of the route)
    $.get(`https://api.tomtom.com/search/2/reverseGeocode/${startLocation}.json?key=${apiKey}`)
      .then(function (startAddress) {
        // console.log(startAddress);

        // Extracts location data from startAddress
        city = startAddress.addresses[0].address.municipality;
        country = startAddress.addresses[0].address.country;
        street = startAddress.addresses[0].address.street;
        postalCode = startAddress.addresses[0].address.extendedPostalCode;

        updateAQI(city);

        displayWeatherIcon(city);

        updateResultsPage();
      })
      .catch(function (error) {
        console.error("API GEO ERROR", error);
      });
  }
}

// Creates the saveButton on the map to save the current route and location details on click
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

// Saves the current route when drawn and location data when the saveButton is clicked
function saveRoute(city, country, street, postalCode) {
  // If route is not currently drawn, exit the function
  if (!isRouteDrawn) return;

  // console.log(city);

  // If a route is drawn, get route data or an empty array if there is none
  var savedRouteData = JSON.parse(localStorage.getItem("routeData")) || [];

  // A routeData object to save route and location data to localStorage
  var routeData = {
    city: city,
    country: country,
    street: street,
    postCode: postalCode,
    aqi: AQI,
    weather: weatherRouteData,
    latlngs: routeLine._latlngs,
  };

  

  // Add newly saved routeData to the beginning of the savedRouteData array
  savedRouteData.unshift(routeData);

  // And keep only the first 4 elements
  savedRouteData = savedRouteData.slice(0, 4);

  // Save the savedRouteData to localStorage
  localStorage.setItem("routeData", JSON.stringify(savedRouteData));
}

// Creates a route on the map
function displayRoute(routeData) {
  // Extract the coordinates from route data
  var coordinates = routeData.routes[0].legs[0].points.map(function (coordinate) {
    // Transform each coordinate object to a Leaflet Latitude, Longitude object
    return L.latLng(coordinate.latitude, coordinate.longitude);
  });

  // Assign, L.polyline used to draw the line on the map to routeLine variable
  routeLine = L.polyline(coordinates, { color: "blue" }).addTo(map).snakeIn();
}

// This Function handles the click event on the map
function onRouteClick(event) {
  // Icons
  var startMarkerIcon = L.icon({
    iconUrl: "assets/images/marker-blue.png",
    iconSize: [30],
    iconAnchor: [18, 45],
  });

  var endMarkerIcon = L.icon({
    iconUrl: "assets/images/marker-green.png",
    iconSize: [30],
    iconAnchor: [18, 45],
  });

  // If a route is already drawn, display a popup and exit the function
  if (isRouteDrawn) {
    L.popup().setLatLng(event.latlng).setContent("Please clear the route before adding a new one").openOn(map);
    return;
  }

  // If the start location has not been set, set it to the clicked location and add a marker
  if (!startLocation) {
    startLocation = event.latlng.lat + "," + event.latlng.lng;
    startMarker = L.marker(event.latlng, { icon: startMarkerIcon }).addTo(map);
    startMarker = L.marker(event.latlng).addTo(map);
    return;
  }

  // If the start location has been set, set the end location to the clicked location and add a marker
  endLocation = event.latlng.lat + "," + event.latlng.lng;
  endMarker = L.marker(event.latlng, { icon: endMarkerIcon }).addTo(map);

  // Get the route data from the Tom Tom calculate route API using the start and end locations
  getRouteData(startLocation, endLocation);

  // Set to true to show that a route is currently drawn
  isRouteDrawn = true;
}

// Creates a control button on the map to display current location
function updateCurrentLocation() {
  L.control
    .locate({
      position: "topright",
      strings: {
        title: "Show current location",
      },
    })
    .addTo(map);
  // When a location is found, get the current location coords, e.g lat,lng
  map.on("locationfound", function (location) {
    // console.log(location);
    // console.log(location.latitude);
    // console.log(location.longitude);

    // Get the coords of current location

    var lat = location.latitude;
    var lng = location.longitude;

    // Get the route data for the current location
    getRouteData(lat + "," + lng, null);
  });
}

// Clears the route and markers when the clearRouteButton is clicked
function clearRoute(clearRouteButton) {
  // If route is not currently drawn, exit the function
  if (!isRouteDrawn) return;

  // If route is drawn,

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
          clearRoute(clearButton); // call the clearRoute Function on click
        },
      },
    ],
  }).addTo(map);
}

// function displayRouteDetails(routeData) {
//   var routeDistance = routeData.routes[0].summary.lengthInMeters;
//   var routeDuration = routeData.routes[0].summary.travelTimeInSeconds;
//   var arrivalTime = routeData.routes[0].summary.arrivalTime;
//   var departureTime = routeData.routes[0].summary.departureTime;

// Data for route to display on our page, if someone gets the chance when the design is done
// }

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

var placeHolder = $("#placeholder");
// console.log(placeHolder);

// Function to search for a location and display the results on the page WHEN a search is completed
function search() {
  var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
  }) // When a location is found, display it on the map and update the page
    .on("markgeocode", function (e) {
      // console.log(e);

      var bbox = e.geocode.bbox;

      var poly = L.polygon([bbox.getSouthEast(), bbox.getNorthEast(), bbox.getNorthWest(), bbox.getSouthWest()]).addTo(
        map
      );
      map.fitBounds(poly.getBounds());

      // If city or country data is not available, set the value to "Location Unavailable"
      if (typeof city !== "undefined" || typeof country !== "undefined") {
        city = e.geocode.properties.address.city;
        country = e.geocode.properties.address.country;
      } else {
        city = "Location Unavailable";
      }

      // There is no street or postalCode available with Search
      if (typeof street == "undefined" && typeof postalCode == "undefined") {
        street = "Address Unavailable";
      }

      // Call the functions to update the data on the page
      updateResultsPage();
      updateAQI(city);
      displayWeatherIcon(city);
    })
    .addTo(map);
}

function updateAQI(city) {
  var url = "http://api.waqi.info/feed/";
  var url2 = "/?token=2541043dcded3bc723e5446a29135ac1523b1111";

  $.get(url + city + url2).then(function (currentData) {
    AQI = currentData.data.aqi;
    if (AQI === "undefined") {
      AQI = "Unavailable";
    }
    if (typeof AQI !== "undefined") {
      $("#aqi").text(`(Test AQI): ${AQI}`);
    } else {
      $("#aqi").text("AQI Unavailable");
    }

    // console.log(AQI);

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

// Function to update the location data on the page
function updateResultsPage() {
  // If city or country data is not available, set the value to "Location Unavailable".
  if (typeof city !== "undefined" && typeof country !== "undefined") {
    $("#address_title").text(`${city}, ${country}`);
  } else {
    $("#address_title").text(`Location Unavailable`);
  }

  // If post code and street is not available, set the value to "Address Unavailable"
  if (typeof postalCode !== "undefined" && typeof street !== "undefined") {
    $("#address").text(`${street}, ${postalCode}`);
  } else {
    $("#address").text(`Address Unavailable`);
  }
}

// DISPLAY WEATHER ICON
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=6dbbcb8584e56ab51c6d42e5b87ce402&units=metric&`;
var iconUrl = "https://openweathermap.org/img/w/";
var weatherId = $("#weather");

function displayWeatherIcon(city) {
  $.get(currentURL + `q=${city}`).then(function (currentWeather) {
    // console.log(currentWeather);
    weatherRouteData = currentWeather.weather[0].icon;
    // console.log(weatherRouteData);
    return weatherId.html(`
            <div>
                <h3><img src="${iconUrl + currentWeather.weather[0].icon + ".png"}" alt="">
                </h3>
            </div>
            `);
  });
  return weatherRouteData;
}

// || INITIALISE THE PAGE
function init() {
  // Call Functions
  displayMap();
  updateCurrentLocation();
  search();
  clearRouteButton();
  saveButton();
  trafficMap();
  // displayWeatherIcon(city);
  modalScreen();

  // Click Event, pass in onRouteClick function
  map.on("click", onRouteClick);
}

init();

// 

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


// 




var newRouteData = JSON.parse(localStorage.getItem("routeData"));
console.log(newRouteData);

$("#airQualityBox").prepend(newRouteData[0].city + "<br>");
$("#airQualityBox").append("AQI: <br>" + newRouteData[0].aqi);
// $("#weatherBox").append("<img src="">" iconUrl + newRouteData[0].weather + ".png")
$("#weatherImage").attr("src", iconUrl + newRouteData[0].weather + ".png")