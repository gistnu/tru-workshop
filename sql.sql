CREATE TABLE feature
(
  gid serial NOT NULL,
  name_t character varying(50),
  desc_t character varying(50),
  typ_n smallint,
  geom geometry(Geometry,4326),
  CONSTRAINT addfeature_feature_pkey PRIMARY KEY (gid)
)