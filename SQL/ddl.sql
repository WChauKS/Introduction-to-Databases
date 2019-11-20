DROP TABLE IF EXISTS `foodtruck`;
CREATE TABLE `foodtruck` (
  `food_truck_id` int(5) NOT NULL AUTO_INCREMENT,
  `food_truck_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`food_truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `foodtruck` WRITE;
INSERT INTO `foodtruck` VALUES (1, 'Moyzilla'), (2, 'IQ Cooking On Wheels'), (3, 'Say Pão de Queijo');
UNLOCK TABLES;

DROP TABLE IF EXISTS `timeslot`;
CREATE TABLE `timeslot` (
  `time_slot_id` int(5) NOT NULL AUTO_INCREMENT,
  `day_of_week` int(5) NOT NULL,
  `time_of_day` int(5) NOT NULL,
  PRIMARY KEY (`time_slot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 0=Mon, 1=Tues, 2=Wed, 3=Thurs, 4=Fri, 5=Sat, 6=Sun
-- 0=Breakfast, 1=Lunch, 2=Dinner
LOCK TABLES `timeslot` WRITE;
-- INSERT INTO `timeslot` VALUES (1, 0, 0), (2, 0, 1), (3, 0, 2), (4, 1, 0), (5, 1, 1), (6, 1, 2), (7, 2, 0), (8, 2, 1), (9, 2, 2), (10, 3, 0), (11, 3, 1), (12, 3, 2), (13, 4, 0), (14, 4, 1), (15, 4, 2), (16, 5, 0), (17, 5, 1), (18, 5, 2), (19, 6, 0), (20, 6, 1), (21, 6, 2);
INSERT INTO `timeslot` VALUES (1, 3, 1), (2, 0, 1);
UNLOCK TABLES;

DROP TABLE IF EXISTS `location`;
CREATE TABLE `location` (
  `location_id` int(5) NOT NULL AUTO_INCREMENT,
  `location_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `location` WRITE;
INSERT INTO `location` VALUES(1, 'Belvidere Street'), (2, 'Boston Medical Center'), (3, 'Boston Public Library'), (4, 'Boston University East');
UNLOCK TABLES;

DROP TABLE IF EXISTS `website`;
CREATE TABLE `website` (
  `website_id` int(5) NOT NULL AUTO_INCREMENT,
  `website_name` VARCHAR(100) NOT NULL,
  `food_truck_id` int(5) NOT NULL,
  PRIMARY KEY (`website_id`),
  CONSTRAINT `fk_truck_website` FOREIGN KEY (`food_truck_id`) REFERENCES `foodtruck` (`food_truck_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `website` WRITE;
INSERT INTO `website` VALUES (1,'http://www.moyzillaboston.com/', 1), (2, 'https://twitter.com/dragonrollgrill?lang=en', 2), (3,'https://saypao.com/', 3);
UNLOCK TABLES;

DROP TABLE IF EXISTS `truckschedule`;
CREATE TABLE `truckschedule` (
  `food_truck_id` int(5),
  `time_slot_id` int(5),
  `location_id` int(5),
  PRIMARY KEY (`food_truck_id`, `time_slot_id`, `location_id`),
  CONSTRAINT `fk_schedule_truck` FOREIGN KEY (`food_truck_id`) REFERENCES `foodtruck` (`food_truck_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_schedule_timeslot` FOREIGN KEY (`time_slot_id`) REFERENCES `timeslot` (`time_slot_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_schedule_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `truckschedule` WRITE;
INSERT INTO `truckschedule` VALUES (1, 1, 1), (2, 2, 2), (3, 2, 3);
UNLOCK TABLES;

-- SHOW TABLES
-- SELECT * FROM foodtruck;
-- SELECT * FROM timeslot;
-- SELECT * FROM location;
-- SELECT * FROM website;
-- SELECT * FROM truckschedule;