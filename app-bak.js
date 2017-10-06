var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    });

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

//create geoJsonLayer
// var geoJsonLayer = L.geoJson(null, {
//     pmIgnore: false
// });

var map = new L.Map('map', {
    center: new L.LatLng(18.65, 99.75),
    zoom: 8
});

var  drawnItems = L.featureGroup().addTo(map).bindPopup('tttttt');

function onEachFeature(feature, layer) {
    layer.bindPopup('จังหวัด : '+ feature.properties.typ_n  + '<br>' + 'อำเภอ : '+ feature.properties.desc_t + '<br>' + 'ตำบล : '+ feature.properties.name_t + '<br>' + 'ชื่อหมู่บ้าน : '+ feature.properties.name_house + '<br>' + 'บ้านเลขที่ : '+ feature.properties.no_house +'<br>' + 'หมู่ที่ : '+ feature.properties.moo_house +'<br>' +'รหัสบ้าน : ' + feature.properties.id_house + '<br>' );
  };

  var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

var baseballIcon = L.icon({
    iconUrl: 'baseball-marker.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
});

var polygonLayer = new L.GeoJSON.AJAX
("http://localhost/tru-workshop/geojson.php?type=polygon",
{onEachFeature: onEachFeature}).addTo(map);

var lineLayer = new L.GeoJSON.AJAX
("http://localhost/tru-workshop/geojson.php?type=polyline",
{onEachFeature: onEachFeature}).addTo(map);

var pointLayer = new L.GeoJSON.AJAX
("http://localhost/tru-workshop/geojson.php?type=marker",
{onEachFeature: onEachFeature}).addTo(map);

var geoJsonLayer = L.geoJson(null, {		
    pmIgnore: false	
 });

 geoJsonLayer.addData(polygonLayer);
 geoJsonLayer.addData(lineLayer);
 geoJsonLayer.addData(pointLayer);

// var json = 'http://localhost/tru-workshop/geojson.php';

// var jsonAjax = $.ajax({
//     type: "GET",
//     url: json,
//     dataType: 'json',
//     success: function (response) {
//         geoJsonLayer.addData(response);
//         geoJsonLayer.addTo(map);
//     }
// });

L.control.layers({
    'osm': osm.addTo(map),
    "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    })
}, {
    'ขอบเขตจังหวัด': prov,
    'ขอบเขตอำเภอ': amp,
    'ขอบเขตตำบล': tam,
    'polygonLayer': polygonLayer,
    'lineLayer': lineLayer,
    'pointLayer': pointLayer,
}).addTo(map);

var options = {
    position: 'topleft',
    edit: {
        featureGroup: geoJsonLayer,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        },
        circle: false,
        rectangle:false,
        circlemarker:false
    }
};

map.addControl(new L.Control.Draw(options));

//map.on(L.Draw.Event.CREATED, function (e) {
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
        pointLayer.refresh();
    });

    console.log(e);
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

map.on("draw:deleted", function(e) {
    
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
