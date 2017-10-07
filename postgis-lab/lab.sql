--1. Start PostGIS
SELECT postgis_full_version();

--2. Basic 
SELECT tam_th FROM tambon;

SELECT tam_th FROM tambon
	WHERE amp_th = 'บางระกำ';

SELECT SUM(t_tot) AS population
	FROM pop_59;
  
SELECT SUM(t_tot) AS population
	FROM pop_59
	WHERE amp_th = 'นครไทย';

SELECT
  tam_th, amp_th,
  100 * SUM(m_tot)/SUM(t_tot) AS male_pct,
  100 * SUM(f_tot)/SUM(t_tot) AS female_pct, 
	FROM pop_59
	WHERE prov_th = 'พิษณุโลก'
	GROUP BY tam_th,amp_th;
	
--3. Geometry Objects
-- Create Table Point
CREATE TABLE poi (id integer, p_name varchar(50), geom geometry(POINT, 4326));
INSERT INTO poi(id, p_name, geom) VALUES (1, 'GISTNU', ST_GeomFromText('POINT(100.192222 16.742397)', 4326));
INSERT INTO poi(id, p_name, geom) VALUES (2, 'Phitsanulok Airport', ST_GeomFromText('POINT(100.278178 16.783647)',4326));

-- Create Table Linestring
CREATE TABLE road (id integer, r_name varchar(50), geom geometry(LINESTRING,4326));
INSERT INTO road(id, r_name, geom) VALUES (1, 'road1', ST_GeomFromText('LINESTRING (100.195330 16.768094, 100.182625 16.744542, 100.179696 16.736981)',4326));
INSERT INTO road(id, r_name, geom) VALUES (2, 'road2', ST_GeomFromText('LINESTRING (100.215040 16.760632, 100.263804 16.756872, 100.305111 16.754764, 100.331450 16.795192)',4326));

-- Create Table Polygon
CREATE TABLE polygon (id integer, pl_name varchar(50), geom geometry(POLYGON, 4326));
INSERT INTO polygon(id, pl_name, geom) VALUES (1, 'polygon1', ST_GeomFromText('POLYGON ((100.282702 16.765242, 100.291548 16.770246, 100.274220 16.796035, 100.265901 16.789726, 100.282702 16.765242))', 4326));
INSERT INTO polygon(id, pl_name, geom) VALUES (2, 'polygon2', ST_GeomFromText('POLYGON ((100.191673 16.743723, 100.195280 16.745630, 100.195784 16.744773, 100.194817 16.744228, 100.194817 16.744228, 100.193997 16.743049, 100.192566 16.742340, 100.191673 16.743723))', 4326));


--4. Coordinate Transform
SELECT proj4text FROM spatial_ref_sys WHERE srid = 4326;
SELECT ST_AsText(ST_Transform(ST_GeomFromText('POINT(627041.307 1852064.295)',32647),4326)); 


--5. Geometries
SELECT * FROM geometry_columns;

-- Point
SELECT gid, vill_nam_t, ST_AsText(geom)
  FROM village
  LIMIT 10;

SELECT gid, vill_nam_t, ST_X(geom), ST_Y(geom)
  FROM village
  LIMIT 10; 

SELECT gid, vill_nam_t, ST_AsText(geom), ST_X(geom), ST_Y(geom)
	FROM village
	WHERE vill_nam_t ILIKE '%ห้วย%';
	
-- Line
SELECT gid, ST_AsText(geom)
  FROM ways
  LIMIT 10;

SELECT ST_Length(geom)
  FROM ways
  WHERE gid = 110;

-- CRS EPSG:4326
SELECT SUM(ST_Length(geom)) AS dist
	FROM ways
	WHERE tran_no = '12';
	
-- CRS EPSG:32647
SELECT SUM(ST_Length(ST_Transform(geom,32647)))/1000 AS dist_km
	FROM ways 
	WHERE tran_no = '12';

-- Polygon
SELECT gid, tam_th, ST_AsText(geom)
	FROM tambon
	LIMIT 10;

SELECT ST_Area(geom) AS area
	FROM tambon
	WHERE tam_th = 'ท่าโพธิ์';
	
SELECT ST_Area(ST_Transform(geom,32647)) AS area_sqm
	FROM tambon
	WHERE tam_th = 'ท่าโพธิ์';

SELECT gid, tam_th,
	ST_Area(ST_Transform(geom,32647)) AS area_sqm
	FROM tambon
	ORDER BY area_sqm DESC
	LIMIT 1;

SELECT ST_Perimeter(geom) AS Perimeter
	FROM tambon
	WHERE tam_th = 'ท่าทอง';

--6. Spatial Relationships

-- ST_Distance(geometry A, geometry B);
SELECT a.vill_nam_t, b.name, ST_Distance(a.geom, b.geom) FROM village a, hospital b LIMIT 10;
SELECT a.vill_nam_t, b.name, ST_Distance(ST_Transform(a.geom,32647), ST_Transform(b.geom,32647)) FROM village a, hospital b LIMIT 10;

SELECT vill_nam_t, ST_AsText(ST_Transform(geom,32647))
	FROM village
	WHERE vill_code='65011104';

SELECT name,
ST_Distance(ST_Transform(geom,32647),ST_GeomFromText('POINT(635265.719 1863603.539)',32647)) / 1000 AS dist_km
	FROM hospital
	ORDER BY dist_km ASC 
	LIMIT 5

SELECT maincode, name
	FROM hospital
	WHERE (ST_Distance(ST_Transform(geom,32647),ST_GeomFromText('POINT(635265.719 1863603.539)',32647)) / 1000) < 10

	
-- ST_DWithin(geometry A, geometry B, radius)
SELECT maincode, name
	FROM hospital 
	WHERE ST_DWithin(ST_Transform(geom,32647),ST_GeomFromText('POINT(635265.719 1863603.539)',32647),3000);

-- ST_Within 
SELECT h.name, a.amp_th FROM hospital h, amphoe a WHERE ST_Within(h.geom, a.geom);

SELECT h.name,h.maincode
	FROM hospital h
	WHERE ST_Within(h.geom, (SELECT geom FROM amphoe WHERE amp_code = '6501'));


-- ST_Buffer
SELECT gid, maincode, name, ST_Buffer(geom, 0.1) AS geom 
	FROM hospital
	WHERE maincode = '11517';

-- ST_Buffer + ST_Intersects
SELECT v.gid, v.vill_nam_t
FROM village v
WHERE ST_Intersects(v.geom,(SELECT ST_Buffer(geom, 0.02) FROM hospital WHERE maincode = '11517'));

-- ST_DWithin
SELECT v.gid, v.vill_nam_t
FROM village v 
WHERE ST_DWithin(v.geom, (SELECT geom FROM hospital WHERE maincode = '11517'),0.02);

-- SELECT in WITH
WITH hbuffer AS(
	SELECT gid, maincode, name, ST_Buffer(geom, 0.02) AS geom 
	FROM hospital
	WHERE maincode = '11517'
	)
SELECT v.gid, v.vill_nam_t
FROM village v, hbuffer b
WHERE ST_Intersects(v.geom,b.geom);


-- ST_Intersects( geometry geomA , geometry geomB );

-- DROP TABLE nuhp_b10km;
CREATE TABLE nuhp_b10km AS
SELECT gid, name, ST_Buffer(geom,0.1) AS geom 
FROM hospital WHERE name = 'โรงพยาบาลมหาวิทยาลัยนเรศวร';

SELECT COUNT(r.geom),SUM(ST_Length(r.geom)) as degree, SUM(ST_Length(ST_Transform(r.geom,32647))) as meter
FROM ways r, nuhp_b10km b
WHERE ST_Intersects(r.geom,b.geom);

-- SELECT in WITH
WITH hbuffer AS(
	SELECT gid, name, ST_Buffer(geom,0.1) AS geom 
	FROM hospital WHERE name = 'โรงพยาบาลมหาวิทยาลัยนเรศวร'
	)
SELECT COUNT(r.geom),SUM(ST_Length(r.geom)) as degree, SUM(ST_Length(ST_Transform(r.geom,32647))) as meter
FROM ways r, hbuffer b
WHERE ST_Intersects(r.geom,b.geom);


--7. GeoJSON
SELECT ST_AsGeoJSON(geom) AS json FROM village  LIMIT 1;

SELECT jsonb_build_object(
    'type',       'Feature',
    'id',         gid,
    'geometry',   ST_AsGeoJSON(geom)::jsonb,
    'properties', to_jsonb(row) - 'gid' - 'geom'
	) FROM (SELECT * FROM village ) row;

--7. GeoJSON

CREATE TABLE feature_geometries
(
  gid serial NOT NULL,
  name character varying(50),
  geom geometry(Geometry,4326),
  CONSTRAINT feature_geometries_pkey PRIMARY KEY (gid)
);


--8. Multi Geometry 
-- Point
INSERT INTO feature_geometries (name,geom) 
VALUES ( 'tesco lotus', ST_GeomFromText('POINT(100.215974 16.799381)', 4326)); 

INSERT INTO feature_geometries (name,geom) 
VALUES ( 'macro', ST_SetSRID(ST_GeomFromGeoJson('{"type":"Point","coordinates":[100.232107,16.794337]}'), 4326))

-- Line
INSERT INTO feature_geometries (name,geom) 
VALUES ( 'tesco road', ST_GeomFromText('LINESTRING (100.213213 16.797983, 100.215058 16.801222, 100.220271 16.800789)',4326));


INSERT INTO feature_geometries (name,geom) 
VALUES ( 'macro road', ST_SetSRID(ST_GeomFromGeoJson('{"type":"LineString","coordinates":[[100.230484,16.792244],[100.231604,16.792466],[100.231605,16.793860]]}'), 4326))

-- Polygon
INSERT INTO feature_geometries (name,geom) 
VALUES ( 'tesco building', ST_GeomFromText('POLYGON ((100.214312 16.799573, 100.217239 16.797948, 100.218043 16.799421, 100.215017 16.800604, 100.214312 16.799573))', 4326));

INSERT INTO feature_geometries (name,geom) 
VALUES ( 'macro building', ST_SetSRID(ST_GeomFromGeoJson('{"type":"Polygon","coordinates":[[[100.231697,16.794913],[100.232703,16.794752],[100.232575,16.793889],[100.231553,16.794031],[100.231697,16.794913]]]}'), 4326))


--- Extra 
SELECT gid,tam_th, tam_en
	FROM tambon
	WHERE tam_en ILIKE '%NONG%';

SELECT gid,tam_th, tam_en
	FROM tambon
	WHERE tam_en LIKE '%NONG%';

----
SELECT maincode, name
FROM hospital
WHERE ST_DWithin(ST_Transform(geom,32647),
	(SELECT ST_Transform(geom,32647) 
		FROM village 
		WHERE vill_code='65011104'),
	3000);

----
CREATE OR REPLACE VIEW public.resparcels AS
SELECT * FROM parcels2007
WHERE pc = '210';;
ALTER TABLE public.resparcels
  OWNER TO "Full_Viewer";
GRANT SELECT ON TABLE public.resparcels TO GROUP "Full_Viewer";
GRANT SELECT ON TABLE public.resparcels TO GROUP "Creator";







