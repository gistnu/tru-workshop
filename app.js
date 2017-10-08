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
    center: new L.LatLng(14.829186, 100.720592),
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






var marker_icon = L.Icon.extend({
    options: {
        iconSize: [40, 40]
    }
});
var icon_1 = new marker_icon({ iconUrl: 'https://image.flaticon.com/icons/png/128/188/188333.png' }),
    icon_2 = new marker_icon({ iconUrl: 'https://cdn2.iconfinder.com/data/icons/appicns/128/472814-appicns_Coda.png' }),
    icon_3 = new marker_icon({ iconUrl: 'http://www.iconsdb.com/icons/download/green/leaf-128.ico' }),
    icon_4 = new marker_icon({ iconUrl: 'http://www.freeiconspng.com/uploads/leaf-icon-20.png' });



var markerLayer = new L.GeoJSON.AJAX("http://localhost/tru-workshop/geojson.php?type=marker", {


    pointToLayer: function(feature, latlng) {

        return L.marker(latlng, { icon: icon_1 });

    },
    onEachFeature: onEachFeature


}).addTo(map);






function onEachFeature(feature, layer) {
    var popupContent = '<form role="form" id="form" class="form-horizontal" enctype="multipart/form-data">' +
        'name: <input type="text" class="form-control" id="name_t" name="name_t" value = "' + feature.properties.name_t + '" disabled ><br>' +
        'desc: <input type="text" class="form-control" id="desc_t" name="desc_t" value = "' + feature.properties.desc_t + '"><br>' +
        'type: <input type="text" class="form-control" id="type_g"  name="type_g" value = "' + feature.properties.type_g + '" disabled><br>' +
        '<button type="button" class="btn btn-success" onclick="test()">Submit</button>' +
        '</form>';

    var widthPop = {
        minWidth: '400'
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
    }, function(data, status) {
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
});





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

map.on('draw:created', function(e) {
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
    }, function(data, status) {
        console.log(data);
        polygonLayer.refresh();
        lineLayer.refresh();
        markerLayer.refresh();
    });
});

map.on('draw:edited', function(e) {
    var layers = e.layers;
    //console.log(layers)
    layers.eachLayer(function(layer) {
        var name_t = layer.toGeoJSON().properties.name_t;
        var geom = (JSON.stringify(layer.toGeoJSON().geometry));
        $.post("update.php", {
            name_t: name_t,
            geom: geom
        }, function(data, status) {
            console.log(data);
        });
    });
});

map.on("draw:deleted", function(e) {

    var layers = e.layers;
    layers.eachLayer(function(layer) {
        var name_t = layer.toGeoJSON().properties.name_t;
        $.post("delete.php", {
            name_t: name_t
        }, function(data, status) {
            console.log(data);
        });
    });
});






function onClick_home() {
    map.setView([14.884243, 100.639411], 13);
};



var polylineDrawer = new L.Draw.Polyline(map, this.opt2.polyline);

var polygonDrawer = new L.Draw.Polygon(map, this.opt1.polygon);

var markerDrawer = new L.Draw.Marker(map, this.opt3.marker);




$('#draw_line').click(function() {
    polylineDrawer.enable();
});
$('#draw_polygon').click(function() {
    polygonDrawer.enable();
});
$('#draw_marker').click(function() {
    markerDrawer.enable();
});



$("#prov_show").click(function(event) {
    event.preventDefault();
    if(map.hasLayer(prov)) {
        $(this).removeClass('selected');
        map.removeLayer(prov);
    } else {
        map.addLayer(prov);        
        $(this).addClass('selected');
   }
});

$("#polygon_show").click(function(event) {
    event.preventDefault();
    if(map.hasLayer(polygonLayer)) {
        $(this).removeClass('selected');
        map.removeLayer(polygonLayer);
    } else {
        map.addLayer(polygonLayer);        
        $(this).addClass('selected');
    }
});

$("#line_show").click(function(event) {
    event.preventDefault();
    if(map.hasLayer(lineLayer)) {
        $(this).removeClass('selected');
        map.removeLayer(lineLayer);
    } else {
        map.addLayer(lineLayer);                 
        $(this).addClass('selected');
   }
});

$("#marker_show").click(function(event) {
    event.preventDefault();
    if(map.hasLayer(markerLayer)) {
        $(this).removeClass('selected');
        map.removeLayer(markerLayer);
    } else {
        map.addLayer(markerLayer);                 
        $(this).addClass('selected');
   }
});
