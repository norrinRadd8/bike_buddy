// $.get("http://api.waqi.info/feed/shanghai/?token=demo"{
//     alert("Data: " + data + "\nStatus: " + status);
//   });

var url = "http://api.waqi.info/feed/";
var url2 = "/?token=2541043dcded3bc723e5446a29135ac1523b1111";
var city = "London";

$.get(url + city + url2).then(function (currentData) {
  console.log(currentData);

  $("#qualityBox").append(`
  ${city} 
  <p id="AQI"> AQI:${currentData.data.aqi}</p>
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
