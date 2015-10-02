// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var ich = require("icanhaz");
var data = require("./foreignBorn.geo.json");

var countryLookup = "PercentForeignBorn";
var country = "Overall immigrant population";

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
        number: commafy(feature.properties[countryLookup]),
        s: feature.properties[countryLookup] == 1 ? "": "s"
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

function commafy( num ) {
  console.log(num)
  if (num.length >= 4) {
    num = num.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  return num;
}

function getColor(d) {
  if (countryLookup == "PercentForeignBorn") {
    d = d.slice(0, -1);
    return d >= 40 ? '#08519c' :
           d >= 30 ? '#3182bd' :
           d >= 20 ? '#6baed6' :
           d >= 10  ? '#bdd7e7' :
                      '#eff3ff' ;
  } else {
    return d > 499 ? '#54278f' :
           d > 199 ? '#756bb1' :
           d > 99 ? '#9e9ac8' :
           d > 49  ? '#cbc9e2' :
           d > 0  ? '#f2f0f7' :
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

document.querySelector(".key").innerHTML = require("./_overallLegend.html");

Array.prototype.slice.call(document.querySelectorAll('.tab')).forEach(function(tab) {
  tab.addEventListener("click", function() {
    if (document.querySelector(".selected")) document.querySelector(".selected").classList.remove("selected");
    tab.classList.add("selected");
    country = tab.innerHTML;
    if (country == "Overall immigrant population") {
      document.querySelector(".key").innerHTML = require("./_overallLegend.html");
      countryLookup = "PercentForeignBorn";
    } else {
      document.querySelector(".key").innerHTML = require("./_countryLegend.html");
      countryLookup = tab.innerHTML.replace(" ", "");
    }
    geojson.setStyle(style);
    map.closePopup();
  })
});
