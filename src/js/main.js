// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var ich = require("icanhaz");
var data = require("./foreignBorn.geo.json");

var countryLookup = "PercentForeignBorn";
var country = "Overall";

var mapElement = document.querySelector("leaflet-map");
var L = mapElement.leaflet;
var map = mapElement.map;

map.scrollWheelZoom.disable();

var focused = false;

var popupTemplate = require("./_popupTemplate.html");
ich.addTemplate("popupTemplate", popupTemplate);

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popupTemplate({
    country: country,
    number: feature.properties[countryLookup]
  }));
  layer.on({
    popupopen: function(e) {
      e.popup.setContent(ich.popupTemplate({
        country: country,
        number: feature.properties[countryLookup]
      }));
      focused = layer;
      layer.setStyle({ weight: 2, fillOpacity: 1, color: '#e08214'});
    },
    mouseover: function(e) {
      layer.setStyle({ weight: 2, fillOpacity: 1, color: '#e08214' });
    },
    mouseout: function(e) {
      if (focused && focused == layer) { return }
      layer.setStyle({ weight: 0.5, fillOpacity: 0.5, color: 'white' });
    }
  });
};

map.on("popupclose", function() {
  if (focused) {
    focused.setStyle({ weight: 0.5, fillOpacity: 0.5, color: 'white' });
    focused = false;
  }
});

function getColor(d) {
  if (countryLookup == "PercentForeignBorn") {
    d = d.slice(0, -1);
    return d > 40 ? '#54278f' :
           d > 30 ? '#756bb1' :
           d > 20 ? '#9e9ac8' :
           d > 10  ? '#bcbddc' :
           d > 0  ? '#dadaeb' :
                     '#f2f0f7' ;
  } else {
    return d > 500 ? '#08519c' :
           d > 200 ? '#3182bd' :
           d > 100 ? '#6baed6' :
           d > 50  ? '#bdd7e7' :
           d > 0  ? '#eff3ff' :
                     'white' ;
  }
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties[countryLookup]),
    weight: 0.5,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5
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
    country = tab.innerHTML;
    countryLookup = country == "Overall" ? "PercentForeignBorn" : tab.innerHTML.replace(" ", "");
    geojson.setStyle(style);
    map.closePopup();
  })
});
