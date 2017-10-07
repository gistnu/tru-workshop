<?php
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

pg_connect("host=localhost user=postgres password=1234 dbname=addfeature") or die("Can't Connect Server");
$type = $_GET[type];
$sql = "SELECT json_build_object(
    'type',     'FeatureCollection',
    'features', json_agg(feature)
)
FROM (
  SELECT json_build_object(
    'type',       'Feature',
    'id',         gid,
    'geometry',   ST_AsGeoJSON(geom)::json,
    'properties', to_json(row)
  ) AS feature
  FROM (SELECT * FROM feature where type_g = '$type') row) features;";

   $res = pg_query($sql);
  
   while ($row = pg_fetch_row($res)) {
    echo $row[0];
  }


?>