// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var data = require("./foreignBorn.geo.json");

var mapElement = document.querySelector("leaflet-map");
var L = mapElement.leaflet;
var map = mapElement.map;

var country = "CentralAmerica";

var onEachFeature = function(feature, layer) {
};

function getColor(d) {
  return d > 500 ? '#54278f' :
         d > 250 ? '#756bb1' :
         d > 100 ? '#9e9ac8' :
         d > 50  ? '#bcbddc' :
         d > 20  ? '#dadaeb' :
                   '#f2f0f7' ;
}

function style(feature) {
  console.log(feature.properties)
  return {
    fillColor: getColor(feature.properties[country]),
    weight: 0.5,
    opacity: 1,
    color: 'white',
    fillOpacity: .5
  };
}

var geojson = L.geoJson(data, {
  style: style, 
  onEachFeature: onEachFeature
}).addTo(map);

Array.prototype.slice.call(document.querySelectorAll('.tab')).forEach(function(tab) {
  tab.addEventListener("click", function() {
    if (document.querySelector(".selected")) document.querySelector(".selected").classList.remove("selected");
    tab.classList.add("selected");
    country = tab.innerHTML.replace(" ", "");
    console.log(country)
    geojson.setStyle(style);
  })
});
