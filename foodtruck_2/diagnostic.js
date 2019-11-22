var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use(express.static('public'));
// app.use(express.static('foodtruck_2' + '/public'));

//from https://www.freecodecamp.org/forum/t/loading-css-file-on-front-end-solved/25550
app.use(express.static(path.join(__dirname, '/public')));

function transform(x){
  var i;
  for (var i=0; i < x.length; i++){
    switch(x[i].day_of_week){
      case 0: x[i].day_of_week="Monday";break;
      case 1: x[i].day_of_week="Tuesday";break;
      case 2: x[i].day_of_week="Wednesday";break;
      case 3: x[i].day_of_week="Thursday";break;
      case 4: x[i].day_of_week="Friday";break;
      case 5: x[i].day_of_week="Saturday";break;
      case 6: x[i].day_of_week="Sunday";break;

    }
    switch(x[i].time_of_day){
      case 0: x[i].time_of_day="Breakfast";break;
      case 1: x[i].time_of_day="Lunch";break;
      case 2: x[i].time_of_day="Dinner";break;
    }
  }
}

function getAllTrucks(res, mysql, context, complete){
  var sql = "SELECT * FROM foodtruck GROUP BY food_truck_name HAVING COUNT(*)=1";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      context.allTrucks = results;
      complete();
    }
  });
}

function getTruckTable(res, mysql, context, complete){
  var sql = "SELECT * FROM foodtruck ORDER BY food_truck_name ASC";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      context.truck = results;
      complete();
    }
  });
}

function getAllLoctions(res, mysql, context, complete){
  var sql = "SELECT * FROM location GROUP BY location_name HAVING COUNT(*)=1";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      context.allLocations = results;
      complete();
    }
  });
}

function getAllTimeSlots(res, mysql, context, complete){
  var sql = "SELECT * FROM timeslot";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      transform(results);
      context.allTimeSlots = results;
      complete();
    }
  });
}

function getScheduleTable(res, mysql, context, complete){
  var sql = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id=foodtruck.food_truck_id INNER JOIN location ON truckschedule.location_id=location.location_id INNER JOIN timeslot ON truckschedule.time_slot_id=timeslot.time_slot_id ORDER BY food_truck_name ASC";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      transform(results);
      context.schedule = results;
      complete();
    }
  });
}
function getWebsiteTable(res, mysql, context, complete){
  var sql = "SELECT * FROM foodtruck INNER JOIN website ON foodtruck.food_truck_id = website.food_truck_id ORDER BY food_truck_name ASC";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      transform(results);
      context.truck = results;
      complete();
    }
  });
}


app.get('/', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var callbackCount = 0;

  getAllTrucks(res, mysql, context, complete);
  getAllLoctions(res, mysql, context, complete);
  getAllTimeSlots(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 3){
      res.render('home', context);
    }
  }
});

app.get('/addtruck', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var callbackCount = 0;
  
  getTruckTable(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount>=1){
      res.render('addtruck', context);
    }
  }
});

app.post ('/addtruck', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO foodtruck (food_truck_name) VALUES (?)";
  var inserts = [req.body.truckName];
  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      res.redirect('/addtruck');
    }
  });
});

app.get('/filter', function(req,res){
  res.render('filter');
});

app.get('/timeslot', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var sql = "SELECT * FROM timeslot ORDER BY day_of_week ASC";

  mysql.pool.query(sql, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      console.log(results);
      transform(results);
      context.truck = results;
      res.render('timeslot', context);
    }
  });
});

app.post ('/timeslot', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO timeslot (day_of_week, time_of_day) VALUES (?,?)";
  var inserts = [req.body.dayOfWeek, req.body.timeOfDay];
  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      res.redirect('/timeslot');
    }
  });
});

app.get('/location', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var sql = "SELECT * FROM location foodtruck ORDER BY location_name ASC";

  mysql.pool.query(sql, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      context.truck = results;
      res.render('location', context);
    }
  });
});

app.post ('/location', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO location (location_name) VALUES (?)";
  var inserts = [req.body.location];
  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      res.redirect('/location');
    }
  });
});

app.get('/truckschedule', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var callbackCount = 0;

  getAllTrucks(res, mysql, context, complete);
  getAllLoctions(res, mysql, context, complete);
  getAllTimeSlots(res, mysql, context, complete);
  getScheduleTable(res, mysql, context, complete)
  function complete(){
    callbackCount++;
    if(callbackCount >= 4){
      res.render('truckschedule', context);
    }
  }
});

app.post ('/truckschedule', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO truckschedule (food_truck_id, location_id, time_slot_id) VALUES (?,?,?)";
  var inserts = [req.body.truckName, req.body.location, req.body.timeslot];
  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      res.redirect('/truckschedule');
    }
  });
});

// app.use('/website', require('./truck.js'));

app.get('/website', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var callbackCount = 0;

  getAllTrucks(res, mysql, context, complete);
  getWebsiteTable(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 2){
      res.render('website', context);
    }
  }
});

app.get('/search/:s', function(req,res){
  var context = {};
  // context.jsscripts = "tools.js";
  var mysql = req.app.get('mysql');
  var sql = "SELECT website_name FROM website WHERE website.food_truck_id=" + req.params.s;
  console.log(sql);

  mysql.pool.query(sql, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      console.log(results);
      console.log(results[0].website_name);
      return res.send(results[0].website_name);
    }
  });
});

app.post ('/website', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO website (website_name, food_truck_id) VALUES (?, ?)";
  var inserts = [req.body.website, req.body.foodtrucks];
  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      res.redirect('/website');
    }
  });
});

/*Function to reset the database and add generic data*/
/*url to create & reset database*/
// app.get('/reset-database', function (req, res, next) {
//     var context = {};
//     /*THIS SECTION IS TO DROP ALL TABLES*/
//     mysql.pool.query("SET FOREIGN_KEY_CHECKS = 0;", function(err) {   //Remove foreign key checks to drop table
//       if(err) {
//         next(err);
//         return;
//       }
//     });

//     mysql.pool.query("DROP TABLE IF EXISTS website", function(err) {
//       if(err) {
//         next(err);
//         return;
//       }
//     });

//     mysql.pool.query("DROP TABLE IF EXISTS truckschedule", function(err) {
//       if(err) {
//         next(err);
//         return;
//       }
//     });

//     mysql.pool.query("DROP TABLE IF EXISTS foodtruck;", function(err) {
//       if(err) {
//         next(err);
//         return;
//       }
//     });

//     mysql.pool.query("DROP TABLE IF EXISTS timeslot", function(err) {
//       if(err) {
//         next(err);
//         return;
//       }
//     });

//     mysql.pool.query("DROP TABLE IF EXISTS location", function(err) {
//       if(err) {
//         next(err);
//         return;
//       }
//     });

//     mysql.pool.query("SET FOREIGN_KEY_CHECKS = 1;", function(err) {
//       if(err) {
//         next(err);
//         return;
//       }
//     });
//     /*This section is to create all tables*/
//     const foodTruckCreateTableString = "CREATE TABLE foodtruck (food_truck_id int(5) NOT NULL AUTO_INCREMENT, food_truck_name VARCHAR(50) NOT NULL, PRIMARY KEY (food_truck_id)) ENGINE=InnoDB;";

//     mysql.pool.query(foodTruckCreateTableString, function(err) {
//       if(err) {
//         next(err)
//         return;
//       }
//     });

//     console.log("food truck table successfully created");

//     const timeSlotCreateTableString = "CREATE TABLE timeslot (time_slot_id int(5) NOT NULL AUTO_INCREMENT, day_of_week int(5) NOT NULL, time_of_day int(5) NOT NULL, PRIMARY KEY (time_slot_id)) ENGINE=InnoDB;";

//     mysql.pool.query(timeSlotCreateTableString, function(err) {
//       if(err) {
//         next(err)
//         return;
//       }
//     });

//     console.log("time slot table successfully created")

//     const locationCreateTableString = "CREATE TABLE location (location_id int(5) NOT NULL AUTO_INCREMENT, location VARCHAR(50) NOT NULL, PRIMARY KEY (location_id)) ENGINE=InnoDB;";

//     mysql.pool.query(locationCreateTableString, function(err) {
//       if(err) {
//         next(err)
//         return;
//       }
//     });

//     console.log("location table successfully created");

//     const websiteCreateTableString = "CREATE TABLE website (website_id int(5) NOT NULL AUTO_INCREMENT, website VARCHAR(100) NOT NULL, food_truck_id int(5) NOT NULL, PRIMARY KEY (website_id), CONSTRAINT fk_truck_website FOREIGN KEY (food_truck_id) REFERENCES foodtruck (food_truck_id) ON DELETE CASCADE) ENGINE=InnoDB;";

//     mysql.pool.query(websiteCreateTableString, function(err) {
//       if(err) {
//         next(err)
//         return;
//       }
//     });

//     console.log("website table successfully created");

//     const truckScheduleCreateTableString = "CREATE TABLE truckschedule (food_truck_id int(5), time_slot_id int(5), location_id int(5), PRIMARY KEY (food_truck_id, time_slot_id, location_id), CONSTRAINT fk_truck_schedule FOREIGN KEY (food_truck_id) REFERENCES foodtruck (food_truck_id) ON DELETE CASCADE, CONSTRAINT fk_timeslot FOREIGN KEY (time_slot_id) REFERENCES timeslot (time_slot_id) ON DELETE CASCADE, CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES location (location_id) ON DELETE CASCADE) ENGINE=InnoDB;";

//     mysql.pool.query(truckScheduleCreateTableString, function(err) {
//       if(err) {
//         next(err)
//         return;
//       }
//     });

//     console.log("truck schedule table successfully created");
//     /*Populating data*/
//     mysql.pool.query("INSERT INTO foodtruck VALUES (1, 'Moyzilla'), (2, 'IQ Cooking On Wheels'), (3, 'Say Pão de Queijo');",
//       function(err, result){
//       if(err){
//         next(err);
//         return;
//       }
//       });

//       console.log("food truck table populated");

//       mysql.pool.query("INSERT INTO timeslot VALUES (1, 0, 0), (2, 0, 1), (3, 0, 2), (4, 1, 0), (5, 1, 1), (6, 1, 2), (7, 2, 0), (8, 2, 1), (9, 2, 2), (10, 3, 0), (11, 3, 1), (12, 3, 2), (13, 4, 0), (14, 4, 1), (15, 4, 2), (16, 5, 0), (17, 5, 1), (18, 5, 2), (19, 6, 0), (20, 6, 1), (21, 6, 2);",
//         function(err, result){
//         if(err){
//           next(err);
//           return;
//          }
//         });

//         console.log("time slot table populated");

//         mysql.pool.query("INSERT INTO location VALUES(1, 'Belvidere Street'), (2, 'Boston Medical Center'), (3, 'Boston Public Library'), (4, 'Boston University East');",
//           function(err, result){
//           if(err){
//             next(err);
//             return;
//            }
//           });

//         console.log("location table populated");

//         mysql.pool.query("INSERT INTO website VALUES (1,'http://www.moyzillaboston.com/', 1), (2, 'https://twitter.com/dragonrollgrill?lang=en', 2), (3,'https://saypao.com/', 3);",
//           function(err, result){
//           if(err){
//             next(err);
//             return;
//            }
//           });

//         console.log("website table populated");

//         mysql.pool.query("INSERT INTO truckschedule VALUES (1, 11, 1), (2, 2, 2), (3, 2, 3);",
//           function(err, result){
//             if(err){
//               next(err);
//               return;
//             }
//           });

//           console.log("truck schedule table populated")

//           context.statusMsg = "Database successfully reset";

//           res.render("home", context);
// });

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