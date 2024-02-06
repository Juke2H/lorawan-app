CREATE TABLE measurements (
    id     bigint not null GENERATED ALWAYS AS IDENTITY,
    device_id      varchar,
	timestamp		timestamp,
    temperature       numeric,
	humidity       numeric,
	pressure       numeric
);

CREATE INDEX timestamp_1 ON measurements (timestamp);
ANALYZE VERBOSE;

CREATE TABLE measurements2 (
    id     bigint not null GENERATED ALWAYS AS IDENTITY,
    device_id      varchar,
    timestamp       timestamp,
    temperature       numeric,
    humidity       numeric,
    waterleak       numeric
);

CREATE INDEX timestamp_2 ON measurements2 (timestamp);
ANALYZE VERBOSE;