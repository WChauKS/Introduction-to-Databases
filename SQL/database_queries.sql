-- !! Queries for the add food truck page

-- Query for adding a new food truck with ':' being used to denote
-- variables that will have data from the backend

INSERT INTO foodtruck (food_truck_name)
  VALUES(:food_truck_name);

-- Query for loading truck data
SELECT * FROM foodtruck ORDER BY food_truck_name ASC;

-- !! Queries for the add location page

-- Query for adding a new location

INSERT INTO location (location_name)
  VALUES(:location_name);

-- Query for loading location data
SELECT * FROM location ORDER BY location_name ASC;

-- !! Queries for the add time slots page

-- Query for adding a new time slot

INSERT INTO timeslot (day_of_week, time_of_day)
  VALUES(:day_of_week, :time_of_day);

-- Query for loading time slot data
SELECT * FROM timeslot ORDER BY day_of_week ASC;

-- !! Queries for the website page

-- Query for adding a new website
INSERT INTO website (website_name, food_truck_id)
  VALUES(:website_name, food_truck_id)

-- Query for searching for a food truck's website
SELECT website_name FROM website WHERE food_truck_id = (:food_truck_id)

-- Query for loading website data
SELECT * FROM foodtruck INNER JOIN website ON foodtruck.food_truck_id = website.food_truck_id ORDER BY food_truck_name ASC;

-- !! Queries for the truck schedule page

-- Query for adding a new truck schedule

INSERT INTO truckschedule (food_truck_id, location_id, time_slot_id)
  VALUES(:food_truck_id, :location_id, :time_slot_id);

-- Query for adding a new truck schedule with time slot Null

INSERT INTO truckschedule (food_truck_id, location_id, time_slot_id)
  VALUES(:food_truck_id, :location_id, NULL);

-- Query for loading schedule data

SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id=foodtruck.food_truck_id INNER JOIN location ON truckschedule.location_id=location.location_id LEFT JOIN timeslot ON truckschedule.time_slot_id=timeslot.time_slot_id ORDER BY food_truck_name ASC;

-- Query for updating truck schedule

UPDATE truckschedule SET location_id = :location_id, time_slot_id = :time_slot_id WHERE schedule_id = :schedule_id;

-- Query for updating truck schedule with time slot Null
UPDATE truckschedule SET location_id = :location_id, time_slot_id = NULL WHERE schedule_id = :schedule_id;

-- Query for removing a truck schedule

DELETE FROM truckschedule WHERE schedule_id = :schedule_id;

-- !! Queries for the home page

-- Queries for populating drop down menus

-- Queries for all filtering criteria
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.time_slot_id = :time_slot_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.location_id = :location_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = :food_truck_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.location_id = :location_id AND truckschedule.time_slot_id = :time_slot_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = :food_truck_id AND truckschedule.location_id = :location_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = :food_truck_id AND truckschedule.time_slot_id = :time_slot_id;
SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = :food_truck_id AND truckschedule.time_slot_id = :time_slot_id AND truckschedule.location_id = :location_id;

-- !! Queries for the drop down menus for Home, Truck Schedule, and Website

-- Foodtruck
SELECT * FROM foodtruck GROUP BY food_truck_name HAVING COUNT(*)=1;

-- Location
SELECT * FROM location GROUP BY location_name HAVING COUNT(*)=1;

-- Timeslot
SELECT * FROM timeslot;
