var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

//from https://www.freecodecamp.org/forum/t/loading-css-file-on-front-end-solved/25550
app.use(express.static(path.join(__dirname, '/public')));

app.get('/',function(req,res){
  res.render('home');
});

app.get('/addtruck', function(req,res){
  res.render('addtruck');
});

app.get('/filter', function(req,res){
  res.render('filter');
});

app.get('/timeslot', function(req,res){
  res.render('timeslot');
});

app.get('/location', function(req,res){
  res.render('location');
});

app.get('/truckschedule', function(req,res){
  res.render('truckschedule');
});

app.get('/website', function(req,res){
  res.render('website');
});

// app.get('/contact', function(req,res){
//   res.render('contact');
// });

/*Function to reset the database and add generic data*/

/*url to create & reset database*/

app.get('/reset-database', function (req, res, next) {
    var context = {};

    /*THIS SECTION IS TO DROP ALL TABLES*/
    
    mysql.pool.query("SET FOREIGN_KEY_CHECKS = 0;", function(err) {		//Remove foreign key checks to drop table
        if(err) {
	    next(err);
	    return;
	}
    });
    
    mysql.pool.query("DROP TABLE IF EXISTS foodtruck;", function(err) {
      if(err) {
        next(err);
        return;
      }
    });

    mysql.pool.query("DROP TABLE IF EXISTS timeslot", function(err) {
      if(err) {
        next(err);
        return;
      }
    });

    mysql.pool.query("DROP TABLE IF EXISTS location", function(err) {
      if(err) {
        next(err);
        return;
      }
    });

    mysql.pool.query("DROP TABLE IF EXISTS website", function(err) {
      if(err) {
        next(err);
        return;
      }
    });

    mysql.pool.query("DROP TABLE IF EXISTS truckschedule", function(err) {
      if(err) {
        next(err);
        return;
      }
    });

    mysql.pool.query("SET FOREIGN_KEY_CHECKS = 1;", function(err) {
        if(err) {
	    next(err);
	    return;
	}
    });


    /*This section is to create all tables*/

    const foodTruckCreateTableString = "CREATE TABLE foodtruck (food_truck_id int(5) NOT NULL AUTO_INCREMENT, food_truck_name VARCHAR(50) NOT NULL, PRIMARY KEY (food_truck_id)) ENGINE=InnoDB;";

    mysql.pool.query(foodTruckCreateTableString, function(err) {
      if(err) {
        next(err)
        return;
      }
    });

    const timeSlotCreateTableString = "CREATE TABLE timeslot (time_slot_id int(5) NOT NULL AUTO_INCREMENT, day_of_week int(5) NOT NULL, time_of_day int(5) NOT NULL, PRIMARY KEY (time_slot_id)) ENGINE=InnoDB;";

    mysql.pool.query(timeSlotCreateTableString, function(err) {
      if(err) {
        next(err)
        return;
      }
    });

    const locationCreateTableString = "CREATE TABLE location (location_id int(5) NOT NULL AUTO_INCREMENT, location VARCHAR(50) NOT NULL, PRIMARY KEY (location_id)) ENGINE=InnoDB;";

    mysql.pool.query(locationCreateTableString, function(err) {
      if(err) {
        next(err)
        return;
      }
    });

    const websiteCreateTableString = "CREATE TABLE website (website_id int(5) NOT NULL AUTO_INCREMENT, website VARCHAR(100) NOT NULL, food_truck_id int(5) NOT NULL, PRIMARY KEY (website_id), CONSTRAINT fk_truck_website FOREIGN KEY (food_truck_id) REFERENCES foodtruck (food_truck_id) ON DELETE CASCADE) ENGINE=InnoDB;";

    mysql.pool.query(websiteCreateTableString, function(err) {
      if(err) {
        next(err)
        return;
      }
    });

    const truckScheduleCreateTableString = "CREATE TABLE truckschedule (food_truck_id int(5), time_slot_id int(5), location_id int(5), PRIMARY KEY (food_truck_id, time_slot_id, location_id), CONSTRAINT fk_truck_schedule FOREIGN KEY (food_truck_id) REFERENCES foodtruck (food_truck_id) ON DELETE CASCADE, CONSTRAINT fk_timeslot FOREIGN KEY (time_slot_id) REFERENCES timeslot (time_slot_id) ON DELETE CASCADE, CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES location (location_id) ON DELETE CASCADE) ENGINE=InnoDB;";

    mysql.pool.query(truckScheduleCreateTableString, function(err) {
      if(err) {
        next(err)
        return;
      }
    });

    /*Populating data*/

    mysql.pool.query("INSERT INTO foodtruck VALUES (1, 'Moyzilla'), (2, 'IQ Cooking On Wheels'), (3, 'Say Pão de Queijo');",
      function(err, result){
      if(err){
        next(err);
        return;
      }
      });

      mysql.pool.query("INSERT INTO timeslot VALUES (1, 0, 0), (2, 0, 1), (3, 0, 2), (4, 1, 0), (5, 1, 1), (6, 1, 2), (7, 2, 0), (8, 2, 1), (9, 2, 2), (10, 3, 0), (11, 3, 1), (12, 3, 2), (13, 4, 0), (14, 4, 1), (15, 4, 2), (16, 5, 0), (17, 5, 1), (18, 5, 2), (19, 6, 0), (20, 6, 1), (21, 6, 2);",
        function(err, result){
        if(err){
          next(err);
          return;
	}
        });

        mysql.pool.query("INSERT INTO `location` VALUES(1, 'Belvidere Street'), (2, 'Boston Medical Center'), (3, 'Boston Public Library'), (4, 'Boston University East');",
          function(err, result){
          if(err){
            next(err);
            return;
	  }
          });

        mysql.pool.query("INSERT INTO `website` VALUES (1,'http://www.moyzillaboston.com/', 1), (2, 'https://twitter.com/dragonrollgrill?lang=en', 2), (3,'https://saypao.com/', 3);",
          function(err, result){
          if(err){
            next(err);
            return;
	  }
          });

        mysql.pool.query("INSERT INTO `truckschedule` VALUES (1, 11, 1), (2, 2, 2), (3, 2, 3);",
          function(err, result){
          if(err){
            next(err);
            return;
	  }
          });

          context.statusMsg = "Database successfully reset";

          res.render("home", context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});