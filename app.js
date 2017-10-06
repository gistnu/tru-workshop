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

function onEachFeature(feature, layer) {
    layer.bindPopup('จังหวัด : '+ feature.properties.typ_n  + '<br>' + 'อำเภอ : '+ feature.properties.desc_t + '<br>' + 'ตำบล : '+ feature.properties.name_t + '<br>' + 'ชื่อหมู่บ้าน : '+ feature.properties.name_house + '<br>' + 'บ้านเลขที่ : '+ feature.properties.no_house +'<br>' + 'หมู่ที่ : '+ feature.properties.moo_house +'<br>' +'รหัสบ้าน : ' + feature.properties.id_house + '<br>' );
  };

var geoJsonLayer = new L.GeoJSON.AJAX("http://localhost/tru-workshop/geojson.php",{onEachFeature: onEachFeature}).addTo(map);



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
    'drawlayer': geoJsonLayer
}).addTo(map);

var options = {
	position: 'topleft',
	draw: {
		polyline: {
			shapeOptions: {
				color: '#f357a1',
				weight: 10
			}
		},
		polygon: {
			allowIntersection: false, // Restricts shapes to simple polygons
			drawError: {
				color: '#e1e100', // Color the shape will turn when intersects
				message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
			},
			shapeOptions: {
				color: '#bada55'
			}
		},
		circle: false, // Turns off this drawing tool
		rectangle: {
			shapeOptions: {
				clickable: false
			}
		},
		marker: true
	},
	edit: {
		featureGroup: geoJsonLayer, //REQUIRED!!
		remove: true
	}
};

var options2 = {
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
        rectangle:{
            allowIntersection: false,
            showArea: true
        }
    }
};

map.addControl(new L.Control.Draw(options2));

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

    layers.bindPopup(
        '<form action="">'+
        'First name: <input type="text" name="FirstName" value="Mickey"><br>'+
        'Last name: <input type="text" name="LastName" value="Mouse"><br>'+
        '<input type="submit" value="Submit">'+
        '</form>'
    );

    $.post("insert.php", {
        name_t: datetime,
        geom: geom
    }, function (data, status) {
        console.log(data);
        geoJsonLayer.refresh();
    });

    // ตรงนี้ติดไว้ก่อน
    // map.on('viewreset', function(){
    //     console.log('resetting..');
    // })
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
