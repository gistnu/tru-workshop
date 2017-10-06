<?php
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

pg_connect("host=localhost user=postgres password=1234 dbname=addfeature") or die("Can't Connect Server");

    $name_t = $_POST['name_t'];
    $geom = $_POST['geom'];
    $type = $_POST['layerType'];

    //echo $geom;

    $sql = "INSERT INTO feature (name_t,geom,type_g) 
			VALUES ( '$name_t', ST_SetSRID(st_geomfromgeojson('$geom'), 4326), '$type')";
    //echo $sql;
    pg_query($sql);
        
    echo 'insert ok';
?>