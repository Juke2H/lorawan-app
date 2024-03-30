-- Create table 'measurements' to store outdoor sensor data
CREATE TABLE
    measurements (
        id bigint not null GENERATED ALWAYS AS IDENTITY,
        device_id varchar,
        timestamp timestamp,
        temperature numeric,
        humidity numeric,
        pressure numeric
    );

-- Create index on timestamp column for faster retrieval of data based on time
CREATE INDEX timestamp_1 ON measurements (timestamp);

-- Analyze table to gather statistics for query optimization
ANALYZE VERBOSE measurements;

-- Create table 'measurements2' to store indoor sensor data
CREATE TABLE
    measurements2 (
        id bigint not null GENERATED ALWAYS AS IDENTITY,
        device_id varchar,
        timestamp timestamp,
        temperature numeric,
        humidity numeric,
        waterleak numeric
    );

CREATE INDEX timestamp_2 ON measurements2 (timestamp);

ANALYZE VERBOSE measurements2;

-- Create table 'measurements3' to store people counter data
CREATE TABLE
    measurements3 (
        id bigint not null GENERATED ALWAYS AS IDENTITY,
        device_id varchar,
        timestamp timestamp,
        counter_a numeric,
        counter_b numeric,
        total_counter_a numeric,
        total_counter_b numeric
    );

CREATE INDEX timestamp_3 ON measurements3 (timestamp);

ANALYZE VERBOSE measurements3;