CREATE TABLE measurements (
    id     bigint not null GENERATED ALWAYS AS IDENTITY,
    device_id      varchar,
	timestamp		timestamp,
    temperature       numeric,
	humidity       numeric,
	pressure       numeric
);

CREATE TABLE measurements2 (
    id     bigint not null GENERATED ALWAYS AS IDENTITY,
    device_id      varchar,
    timestamp       timestamp,
    temperature       numeric,
    humidity       numeric,
    waterleak       numeric
);