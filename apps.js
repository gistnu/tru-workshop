// create base layer - provider: https://leaflet-extras.github.io/leaflet-providers/preview/
var osm_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osm_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var googlemaps = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'google'
})

//create overlayers from wms
var prov = L.tileLayer.wms("http://cgi.uru.ac.th/gs-gb/ows?", {
    layers: 'nan:site_province',
    format: 'image/png',
    transparent: true,
    attribution: 'map by <a href="http://cgi.uru.ac.th">cgi</a>'
});

var amp = L.tileLayer.wms("http://cgi.uru.ac.th/gs-gb/ows?", {
    layers: 'nan:site_amphoe',
    format: 'image/png',
    transparent: true,
    attribution: 'map by <a href="http://cgi.uru.ac.th">cgi</a>'
});

var tam = L.tileLayer.wms("http://cgi.uru.ac.th/gs-gb/ows?", {
    layers: 'nan:site_tambon',
    format: 'image/png',
    transparent: true,
    attribution: 'map by <a href="http://cgi.uru.ac.th">cgi</a>'
});

var drawnItems = new L.FeatureGroup();

//console.log(geojsonFeature);
//var geojsonLayer = new L.GeoJSON.AJAX("geojson.php");

// create layer group in control
var baseMaps = {
    'Openstreet map': osm_Mapnik,
    'Openstreet Black & White': osm_BlackAndWhite,
    'Googlemaps': googlemaps,
};
var overlayMaps = [];
var lyr = {
    'ขอบเขตจังหวัด': prov,
    'ขอบเขตอำเภอ': amp,
    'ขอบเขตตำบล': tam,
    //'draw': drawnItems
    //'geojsonLayer': geojsonLayer
};
overlayMaps.push(lyr);

//console.log(overlayMaps);
//create map
var map = new L.map('map', {
    center: [18.65, 99.75],
    zoom: 8,
    layers: [osm_Mapnik, prov, amp, tam, drawnItems]
});

L.control.layers(baseMaps, overlayMaps[0]).addTo(map);

var json = 'http://localhost/tru-workshop/geojson.php';
$.ajax({
    type: "POST",
    url: json,
    dataType: 'json',
    success: function (response) {
        var json = L.geoJson(response).addTo(map);

        var lyr2 = {
            'ขอบเขตจังหวัด2': L.geoJson(response)
        };

        overlayMaps.push(lyr2);
        //map.fitBounds(geojsonLayer.getBounds());
        //$("#info").fadeOut(500);
        //var da = 'da';
    }
});

console.log(overlayMaps);

var options = {
    position: 'topleft',
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        },
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        },
        //polyline: false,
        //polygon: false,
        //rectangle: false,
        circle: false,
        //marker: true,
        circlemarker: false
    },
    remove: true
};

map.addControl(new L.Control.Draw(options));

// Truncate value based on number of decimals
var _round = function (num, len) {
    return Math.round(num * (Math.pow(10, len))) / (Math.pow(10, len));
};
// Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
var strLatLng = function (latlng) {
    return "(" + _round(latlng.lat, 6) + ", " + _round(latlng.lng, 6) + ")";
};

// Generate popup content based on layer type
// - Returns HTML string, or null if unknown object
var getPopupContent = function (layer) {
    // Marker - add lat/long
    if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        return strLatLng(layer.getLatLng());
        // Circle - lat/long, radius
    } else if (layer instanceof L.Circle) {
        var center = layer.getLatLng(),
            radius = layer.getRadius();
        return "Center: " + strLatLng(center) + "<br />" +
            "Radius: " + _round(radius, 2) + " m";
        // Rectangle/Polygon - area
    } else if (layer instanceof L.Polygon) {
        var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
            area = L.GeometryUtil.geodesicArea(latlngs);
        return "Area: " + L.GeometryUtil.readableArea(area, true);
        // Polyline - distance
    } else if (layer instanceof L.Polyline) {
        var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
            distance = 0;
        if (latlngs.length < 2) {
            return "Distance: N/A";
        } else {
            for (var i = 0; i < latlngs.length - 1; i++) {
                distance += latlngs[i].distanceTo(latlngs[i + 1]);
            }
            return "Distance: " + _round(distance, 2) + " m";
        }
    }
    return null;
};


// Object created - bind popup to layer, add to feature group
// map.on(L.Draw.Event.CREATED, function(event) {
//     var layer = event.layer;
//     var content = getPopupContent(layer);
//     if (content !== null) {
//         layer.bindPopup(content);
//     }
//     drawnItems.addLayer(layer);
// });

// Object(s) edited - update popups
// map.on(L.Draw.Event.EDITED, function(event) {
//     var layers = event.layers;
//     var content = null;
//     layers.eachLayer(function(layer) {
//         content = getPopupContent(layer);
//         if (content !== null) {
//             layer.setPopupContent(content);
//         }
//     });
// });

map.on('draw:created', function (e) {
    var layers = e.layer;
    drawnItems.addLayer(layers);

    var content = getPopupContent(layers);
    layers.bindPopup(content);

    var geom = (JSON.stringify(layers.toGeoJSON().geometry));
    
    $.post("insert.php", {
        name_t: 'test',
        geom: geom
    }, function (data, status) {
        console.log(data);
        //alert("Data: " + data + "\nStatus: " + status);
    });

});

map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        console.log(layers);
    });
});


