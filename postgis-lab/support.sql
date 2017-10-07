select DISTINCT amp_name from list_home;
SELECT regexp_replace(amp_name, '\s+$', '') FROM list_home WHERE agency ='รพ.สต.วังอิทก';

UPDATE list_home SET amp_name = regexp_replace(amp_name, '\s+$', '') WHERE agency ='รพ.สต.วังอิทก';


DELETE FROM list_home
WHERE agency = 'รพ.สต.บ้านหนองเตาอิฐ'

-------------

CREATE VIEW s_school AS
SELECT s.gid, s.text, s.name, t.prov_code, t.amp_code, t.tam_code, s.geom
FROM school AS s  JOIN
     tam as t ON
     ST_Intersects(s.geom, t.geom)
	 
	 
SELECT p.gid, p.lu_code, l.prov_code,l.amp_code, l.tam_code,
	CASE 
	WHEN ST_CoveredBy(p.geom, l.geom)
	THEN p.geom
	ELSE
	 ST_Multi(
		ST_Intersection(p.geom,l.geom)
		) END AS geom
FROM dwrlu AS p 
  INNER JOIN tam AS l
  ON ST_Intersects(p.geom, l.geom)
  
----------------------------
create table public_health as 
select * from healthcenter where typecode = 1 OR typecode = 2 ;

create table hospital_sub as
select * from healthcenter where typecode = 3 ;

create table hospital as
select * from healthcenter where typecode = 4 OR typecode = 5 OR typecode = 7 OR typecode = 62;

create table hcenter as
select * from healthcenter where typecode = 8 OR typecode = 9 ;

ALTER TABLE public_health
ADD PRIMARY KEY (gid);

ALTER TABLE hospital_sub
ADD PRIMARY KEY (gid);

ALTER TABLE hospital
ADD PRIMARY KEY (gid);

ALTER TABLE hcenter
ADD PRIMARY KEY (gid);

CREATE VIEW elecline AS
SELECT p.gid,p.linecode,p.engname,p.lineabbr,p.startsub,p.endsub,p.distanc,
p.voltage,p.length,l.tam_code,l.tam_nam_t,l.amp_code,l.amp_nam_t,l.prov_code,l.prov_nam_t,
	CASE 
	WHEN ST_CoveredBy(p.geom, l.geom)
	THEN p.geom
	ELSE
	 ST_Multi(
		ST_Intersection(p.geom,l.geom)
		) END AS geom
FROM ln9p_elecline_4326 AS p 
  INNER JOIN ln9p_tam AS l
  ON ST_Intersects(p.geom, l.geom)
  
  -- ALTER TABLE landuse_52
-- ADD mlu_code character varying(3);

UPDATE landuse_52
SET mlu_code = LEFT(des_52,1)

-- select gid, mlu_code from landuse_52 limit 10;

ALTER TABLE landuse_56
ADD mlu_code character varying(3);

UPDATE landuse_56
SET mlu_code = LEFT(lu_code,1)

select gid, mlu_code from landuse_56 limit 10;


UPDATE landuse_48 SET mlu_code = 'A' WHERE gid=119

-- select gid, mlu_code from landuse_48 WHERE gid=83;

------
SELECT re_code1, sum((ST_Area(ST_Transform(geom,32647)))/1600) AS sqm FROM landuse_57
GROUP BY re_code1;

-----
SELECT f.type, SUM(f.area) FROM (
SELECT type1 AS type, area
FROM test
UNION
SELECT type2 AS type, area
FROM test
) AS f
GROUP BY f.type;

------
"SCHDIST" IN (	'',
		'CANDOR CENTRAL SCHOOL DISTRICT',
		'CORTLAND CENTRAL SCHOOL DISTRICT',
		'DRYDEN CENTRAL SCHOOL DISTRICT',
		'GEORGE JR CENTRAL SCHOOL DISTRICT',
		'GROTON CENTRAL SCHOOL DISTRICT',
		'HOMER CENTRAL SCHOOL DISTRICT',
		'ITHACA CITY SCHOOL DISTRICT',
		'LANSING CENTRAL SCHOOL DISTRICT',
		'MORAVIA CENTRAL SCHOOL DISTRICT',
		'NEWARK VALLEY CENTRAL SCHOOL DISTRICT',
		'NEWFIELD CENTRAL SCHOOL DISTRICT',
		'ODESSA-MONTOUR CENTRAL SCHOOL DISTRICT',
		'SOUTHERN CAYUGA CENTRAL SCHOOL DISTRICT',
		'SPENCER-VAN ETTEN CENTRAL SCHOOL DISTRICT',
		'TRUMANSBURG CENTRAL SCHOOL DISTRICT')


"MUNI" IN (	'CITY OF ITHACA',
		'NEWFIELD',
		'TOWN OF CAROLINE',
		'TOWN OF DANBY',
		'TOWN OF DRYDEN',
		'TOWN OF ENFIELD',
		'TOWN OF GROTON',
		'TOWN OF ITHACA',
		'TOWN OF LANSING',
		'TOWN OF NEWFIELD',
		'TOWN OF ULYSSES',
		'VILLAGE OF CAYUGA HEIGHTS',
		'VILLAGE OF DRYDEN',
		'VILLAGE OF FREEVILLE',
		'VILLAGE OF GROTON',
		'VILLAGE OF LANSING',
		'VILLAGE OF TRUMANSBURG'
)


SELECT floodzone.geom, floodzone.zone, flood.desc
FROM floodzone, flood
WHERE floodzone.zone = flood.zone

----------------------------

SELECT parcels2007.*
FROM parcels2007, watersheds
WHERE st_contains(watersheds.geom,parcels2007.geom)
AND watersheds.watershed = 'Fall Creek'


raster2pgsql -s 26918 c:\temp\u27elu.dem public.ithdem > c:\temp\out.sql

psql -U postgres -d postgres -f c:\temp\out.sql

---------------------------

SELECT parcels2007.*
FROM parcels2007, floodzone
WHERE st_intersects(parcels2007.geom,floodzone.geom)
AND floodzone.zone = 'A'

--------------------------

SELECT min(st_distance(parcels2007.geom,floodzone.geom)) as dist
FROM parcels2007, floodzone
WHERE parcels2007.parcelkey = '50308907200000010011090000'
and floodzone.zone = 'AE'

----------------------------

SELECT a.geom, a.loc || ' ' || a.location as addr
FROM parcels2007 AS a, parcels2007 AS b
WHERE st_touches(a.geom,b.geom)
AND b.parcelkey = '50308907200000010011090000'

----------------------------

SELECT st_buffer(geom, 100) as geom, parcels2007.loc || ' ' || a.location as addr
FROM parcels2007
WHERE parcels2007.parcelkey = '50308907200000010011090000'

--------------------------------

SELECT  a.geom, a.loc || ' ' || a.location as addr
FROM parcels2007 AS a, parcels2007 AS b
WHERE b.parcelkey = '50308907200000010011090000'
AND st_dwithin(a.geom,b.geom,200)

--------------------------------

SELECT st_intersection(watersheds .geom, floodzone .geom) as geom, watershed, floodzone.zone
FROM watersheds, floodzone 
WHERE watersheds.watershed = 'Fall Creek'
AND st_intersects(watersheds.geom,floodzone .geom)