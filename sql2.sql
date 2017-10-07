CREATE TABLE public.feature
(
  gid integer NOT NULL DEFAULT nextval('feature_gid_seq'::regclass),
  name_t character varying(50),
  desc_t character varying(50),
  geom geometry(Geometry,4326),
  type_g text,
  CONSTRAINT addfeature_feature_pkey PRIMARY KEY (gid)
)