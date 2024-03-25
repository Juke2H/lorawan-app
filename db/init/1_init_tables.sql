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

CREATE TABLE measurements3 (
    id     bigint not null GENERATED ALWAYS AS IDENTITY,
    device_id      varchar,
    timestamp       timestamp,
    counter_a       numeric,
    counter_b       numeric,
    total_counter_a       numeric,
    total_counter_b       numeric
);

CREATE INDEX timestamp_3 ON measurements3 (timestamp);
ANALYZE VERBOSE;