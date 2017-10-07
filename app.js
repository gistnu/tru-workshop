var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
osm = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: osmAttrib
});

//create overlayers from wms
var prov = L.tileLayer.wms("http://gistnu.com/geoserver/ows?", {
layers: 'gistnu:province',
format: 'image/png',
transparent: true,
attribution: 'map by <a href="https://gistnu.com">cgi</a>'
});

var map = new L.Map('map', {
center: new L.LatLng(18.65, 99.75),
zoom: 8
});

var polygonStyle = {
color: 'blue',
fillColor: 'yellow',
weight: 3,
opacity: 0.65,
};

var lineStyle = {
color: "red",
weight: 3,
dashArray: [5, 5],
};

var markerStyle = L.icon({
iconUrl: 'http://localhost/lab_leaflet/img/ic_favorite_black_24dp_1x.png',
iconSize: [32, 37],
iconAnchor: [16, 37],
popupAnchor: [0, -28]
});

var polygonLayer = new L.GeoJSON.AJAX("http://localhost/tru-workshop/geojson.php?type=polygon", {
onEachFeature: onEachFeature,
style: polygonStyle
}).addTo(map);

var lineLayer = new L.GeoJSON.AJAX("http://localhost/tru-workshop/geojson.php?type=polyline", {
onEachFeature: onEachFeature,
style: lineStyle
}).addTo(map);

var markerLayer = new L.GeoJSON.AJAX("http://localhost/tru-workshop/geojson.php?type=marker", {
onEachFeature: onEachFeature
}).addTo(map);

function onEachFeature(feature, layer) {
var popupContent = '<form role="form" id="form" class="form-control" enctype="multipart/form-data">' +
    'name: <input class="form-control" type="text" id="name_t" value = "' + feature.properties.name_t + '" disabled><br>' +
    'desc: <input class="form-control" type="text" id="desc_t" value = "' + feature.properties.desc_t + '"><br>' +
    'type: <input class="form-control" type="text" id="type_g"  value = "' + feature.properties.type_g + '" disabled><br>' +
    '<button type="button" onclick="test()">Submit</button>' +
    //'<button type="button" onclick="test('aa','+ feature.properties.desc_t+', '+feature.properties.type_g+')">Submit</button>'+
    '</form>';
var widthPop = {
    minWidth: 400
};
layer.bindPopup(popupContent, widthPop);
};

function test() {
var name_t = $("#name_t").val();
var desc_t = $("#desc_t").val();
var type_g = $("#type_g").val();
var dataString = "name_t=" + name_t + "&desc_t" + desc_t + "&type_g=" + type_g;
console.log(dataString);

$.post("update2.php", {
    name_t: name_t,
    desc_t: desc_t
}, function (data, status) {
    console.log(data);
    polygonLayer.refresh();
    lineLayer.refresh();
    markerLayer.refresh();
});
};

L.control.layers({
'osm': osm.addTo(map),
"google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'google'
})
}, {
'ขอบเขตจังหวัด': prov,
'polygonLayer': polygonLayer,
'lineLayer': lineLayer,
'markerLayer': markerLayer,
}).addTo(map);


var opt1 = {
edit: {
    featureGroup: polygonLayer,
    poly: {
        allowIntersection: false,
    }
},
draw: {
    polygon: {
        allowIntersection: false,
        showArea: true
    },
    rectangle: false,
    polyline: false,
    circle: false,
    marker: false,
    circlemarker: false
}
}

var opt2 = {
edit: {
    featureGroup: lineLayer,
},
draw: {
    polygon: false,
    rectangle: false,
    polyline: {
        allowIntersection: false
    },
    circle: false,
    marker: false,
    circlemarker: false
}
}

var opt3 = {
edit: {
    featureGroup: markerLayer,
},
draw: {
    polygon: false,
    rectangle: false,
    polyline: false,
    circle: false,
    marker: true,
    circlemarker: false
}
}

map.addControl(new L.Control.Draw(opt1));
map.addControl(new L.Control.Draw(opt2));
map.addControl(new L.Control.Draw(opt3));

map.on('draw:created', function (e) {
var currentdate = new Date();
var datetime = "ID" + currentdate.getDate() + "-" +
    (currentdate.getMonth() + 1) + "-" +
    currentdate.getFullYear() + "-" +
    currentdate.getHours() + "-" +
    currentdate.getMinutes() + "-" +
    currentdate.getSeconds();

var layers = e.layer;

var geom = (JSON.stringify(layers.toGeoJSON().geometry));
console.log(layers);

$.post("insert.php", {
    name_t: datetime,
    geom: geom,
    layerType: e.layerType
}, function (data, status) {
    console.log(data);
    polygonLayer.refresh();
    lineLayer.refresh();
    markerLayer.refresh();
});
});

map.on('draw:edited', function (e) {
var layers = e.layers;
//console.log(layers)
layers.eachLayer(function (layer) {
    var name_t = layer.toGeoJSON().properties.name_t;
    var geom = (JSON.stringify(layer.toGeoJSON().geometry));
    $.post("update.php", {
        name_t: name_t,
        geom: geom
    }, function (data, status) {
        console.log(data);
    });
});
});

map.on("draw:deleted", function (e) {

var layers = e.layers;
layers.eachLayer(function (layer) {
    var name_t = layer.toGeoJSON().properties.name_t;
    $.post("delete.php", {
        name_t: name_t
    }, function (data, status) {
        console.log(data);
    });
});
});