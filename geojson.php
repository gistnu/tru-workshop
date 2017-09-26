<?php
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

pg_connect("host=localhost user=postgres password=1234 dbname=addfeature") or die("Can't Connect Server");

$sql1 = "SELECT row_to_json(fc) 
FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
   FROM (SELECT 'Feature' As type
    , ST_AsGeoJSON(lg.geom, 4)::json As geometry
    , row_to_json((SELECT l FROM (SELECT gid, name_t) As l
      )) As properties
   FROM feature As lg ) As f ) As fc";


$sql = 'select * from feature';

   $res = pg_query($sql);
  
   while ($row = pg_fetch_row($res)) {
    echo $row[0];
  }

?>