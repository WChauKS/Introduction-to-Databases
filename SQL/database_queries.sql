-- !! Queries for the add food truck page

-- Query for adding a new food truck with ':' being used to denote
-- variables that will have data from the backend

INSERT INTO foodtruck (food_truck_name)
  VALUES(:food_truck_name);

-- !! Queries for the add location page

-- Query for adding a new location

INSERT INTO location (location_name)
  VALUES(:location_name);

-- !! Queries for the add time slots page

-- Query for adding a new time slot

INSERT INTO timeslot (day_of_week, time_of_day)
  VALUES(:day_of_week, :time_of_day);

-- !! Queries for the website page

-- Query for adding a new website

INSERT INTO website (website_name, food_truck_id)
  VALUES(:website_name, food_truck_id)

-- Query for searching for a food truck's website

SELECT website FROM website WHERE food_truck_id = (:food_truck_id)

-- Query for creating drop down menu for food trucks

SELECT * FROM foodtruck

-- !! Queries for the truck schedule page

-- Query for populating drop down menu for truck schedules

SELECT * FROM truckschedule

-- Query for creating drop down menu for food trucks

SELECT * FROM foodtruck

-- Query for creating drop down menu for location

SELECT * FROM location

-- Query for creating drop down menu for time slot

SELECT * FROM timeslot

-- Query for adding a new truck schedule

INSERT INTO truckschedule (food_truck_id, time_slot_id, location_id)
  VALUES(:food_truck_id, :time_slot_id, :location_id);

-- Query for loading schedule data

SELECT * FROM truckschedule WHERE food_truck_ID = (:food_truck_id);

-- Query for updating truck schedule

UPDATE truckschedule SET food_truck_id = :food_truck_id, time_slot_id = :time_slot_id, location_id = :location_id
  WHERE food_truck_id = :food_truck_id2 AND time_slot_id = :time_slot_id2 AND location_id = :location_id2;

-- Query for removing a truck schedule

DELETE FROM truckschedule
  WHERE food_truck_id = :food_truck_id AND time_slot_id = :time_slot_id AND location_id = :location_id;

-- !! Queries for the home page

--Queries for populating drop down menus

SELECT * FROM foodtruck;

SELECT * FROM location;

SELECT * FROM timeslot;


-- Queries for all filtering criteria

SELECT * from truckschedule WHERE food_truck_id = :food_truck_id;

SELECT * from truckschedule WHERE location_id = :location_id;

SELECT * from truckschedule WHERE time_slot_id = :time_slot_id;

SELECT * from truckschedule WHERE food_truck_id = :food_truck_id AND location_id = :location_id;

SELECT * from truckschedule WHERE food_truck_id = :food_truck_id AND time_slot_id = :time_slot_id;

SELECT * from truckschedule WHERE location_id = :location_id AND time_slot_id = :time_slot_id;
