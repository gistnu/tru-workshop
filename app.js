var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    }),
    map = new L.Map('map', {
        center: new L.LatLng(51.505, -0.04),
        zoom: 13
    }),
    drawnItems = L.featureGroup().addTo(map).bindPopup('tttttt');

L.control.layers({
    'osm': osm.addTo(map),
    "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    })
}, {
    'drawlayer': drawnItems
}, {
    position: 'topleft',
    collapsed: true
}).addTo(map);


map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        }
    }
}));

map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;

    drawnItems.addLayer(layer);
    console.log('draw:created->');
    //console.log(JSON.stringify(layer.toGeoJSON()));
    var t = (JSON.stringify(layer.toGeoJSON().geometry));
    //console.log(t);

    //var popup = L.popup()
    //.setLatLng(latlng)
    //.setContent('<p>Hello world!<br />This is a nice popup.</p>')
    //.openOn(map);

    $.post("insert.php", {
        name_t: 'test',
        geom: t
    }, function (data, status) {
        console.log(data);
        //alert("Data: " + data + "\nStatus: " + status);

    });

});

map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        var t = (JSON.stringify(layer.toGeoJSON().geometry));
        //do whatever you want; most likely save back to db
        $.post("update.php", {
            name_t: 'test',
            geom: t
        }, function (data, status) {
            console.log(data);
            //alert("Data: " + data + "\nStatus: " + status);

        });

    });
});