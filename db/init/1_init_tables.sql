CREATE TABLE measurements (
    id     bigint not null GENERATED ALWAYS AS IDENTITY,
    device_id      bigint not null,
	timestamp		date,
    temperature       numeric,
	humidity       numeric,
	pressure       numeric
);