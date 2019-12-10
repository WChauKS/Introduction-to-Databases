var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

// handlebar helper to determine default selected values in the drop down
var handlebars = require('express-handlebars').create({
	defaultLayout:'main',
	helpers: require('./public/helpers.js')
});

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

// converts day_of_week and time_of_day from time_slot_id from int to the proper string for readability
function transform(x){
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

// converts day_of_week and time_of_day from time_slot_id from int to the proper string for readability with NULL options added
function transformNull(x) {
  for (var i = 0; i < x.length; i++) {
    if (x[i].day_of_week == 0) {
      x[i].day_of_week = "Monday";
    }
    else if (x[i].day_of_week == 1) {
      x[i].day_of_week = "Tuesday";
    }
    else if (x[i].day_of_week == 2) {
      x[i].day_of_week = "Wednesday";
    }
    else if (x[i].day_of_week == 3) {
      x[i].day_of_week = "Thursday";
    }
    else if (x[i].day_of_week == 4) {
      x[i].day_of_week = "Friday";
    }
    else if (x[i].day_of_week == 5) {
      x[i].day_of_week = "Saturday";
    }
    else if (x[i].day_of_week == 6) {
      x[i].day_of_week = "Sunday";
    }
    else {
      x[i].day_of_week = "Null";
    }
  
    if (x[i].time_of_day == 0) {
      x[i].time_of_day = "Breakfast";
    }
    else if (x[i].time_of_day == 1) {
      x[i].time_of_day = "Lunch";
    }
    else if (x[i].time_of_day == 2) {
      x[i].time_of_day = "Dinner";
    }
    else {
      x[i].time_of_day = "Null";
    }
  }
}

// gets all the trucks from the foodtruck table in the DB for populating the drop down menus in the 'Home', 'Truck Schedule', and 'Website' pages
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

// gets the trucks from the foodtruck table in the DB for display in the 'Add Food Truck' page
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

// gets all the locations from the location table in the DB for populating the drop down menus in the 'Home', 'Add Locations', and 'Truck Schedule' pages
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

// gets all the locations from the location table in the DB for display in the 'Add Locations' page
function getLocationTable(res, mysql, context, complete){
  var sql = "SELECT * FROM location ORDER BY location_name ASC";
  mysql.pool.query(sql, function(error, results){
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
// gets all the time slots from the timeslot table in the DB for populating the drop down menus in the 'Home', 'Add Time Slots', and 'Truck Schedule' pages
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

// gets all the time slots from the timeslot table in the DB for display in the 'Add Time Slots' page
function getTimeSlotTable(res, mysql, context, complete){
  var sql = "SELECT * FROM timeslot ORDER BY day_of_week ASC";

  mysql.pool.query(sql, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      console.log(results);
      transform(results);
      context.timeslot = results;
      complete();
    }
  });
}

// gets the all schedule data from the truckschedule table in the DB for display in the 'Truck Schedule' page
function getScheduleTable(res, mysql, context, complete){
  var sql = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id=foodtruck.food_truck_id INNER JOIN location ON truckschedule.location_id=location.location_id LEFT JOIN timeslot ON truckschedule.time_slot_id=timeslot.time_slot_id ORDER BY food_truck_name ASC";
  mysql.pool.query(sql, function(error,results){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      transformNull(results);
      context.schedule = results;
      complete();
    }
  });
}

// gets all the food trucks with their websites from the website table in the DB for display in the 'Website' page
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

// renders the 'Home' page with truck, location, time slot dropdowns
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

// renders the 'Add Food Trucks' page with foodtruck table
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

// INSERTS a food truck into the foodtruck table and re-renders 'Add Food Trucks' page
// If duplicate is encountered, error is rendered on the page
app.post ('/addtruck', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO foodtruck (food_truck_name) VALUES (?)";
  var inserts = [req.body.truckName];
  var context = {};
  var callbackCount = 0;

  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      if(error.code == 'ER_DUP_ENTRY'){
        context.error = 'That entry already exists in the database!';
        getTruckTable(res, mysql, context, complete);
        function complete(){
          callbackCount++;
          if(callbackCount>=1){
            res.render('addtruck', context);
          }
        }
      }
    }else{
      res.redirect('/addtruck');
    };
  });
});

app.get('/filter', function(req,res){
  res.render('filter');
});

// renders the 'Add Time Slot' page with timeslot table
app.get('/timeslot', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var callbackCount = 0;

  getTimeSlotTable(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount>=1){
      res.render('timeslot', context);
    }
  }
});

// INSERTS a time slot into the timeslot table and re-renders 'Add Time Slots' page
// If duplicate is encountered, error is rendered on the page
app.post ('/timeslot', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO timeslot (day_of_week, time_of_day) VALUES (?,?)";
  var inserts = [req.body.dayOfWeek, req.body.timeOfDay];
  var context = {};
  var callbackCount = 0;

  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      if(error.code == 'ER_DUP_ENTRY'){
        context.error = 'That entry already exists in the database!';
        getTimeSlotTable(res, mysql, context, complete);
        function complete(){
          callbackCount++;
          if(callbackCount>=1){
            res.render('timeslot', context);
          }
        }
      }
    }else{
      res.redirect('/timeslot');
    }
  });
});

// renders the 'Add Locations' page with location table
app.get('/location', function(req,res){
  var mysql = req.app.get('mysql');
  var context = {};
  var callbackCount = 0;

  getLocationTable(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount>=1){
      res.render('location', context);
    }
  }
});

// INSERTS a location into the location table and re-renders 'Add Locations' page
// If duplicate is encountered, error is rendered on the page
app.post ('/location', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO location (location_name) VALUES (?)";
  var inserts = [req.body.location];
  var context = {};
  var callbackCount = 0;

  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      if(error.code == 'ER_DUP_ENTRY'){
        context.error = 'That entry already exists in the database!';
        getLocationTable(res, mysql, context, complete);
        function complete(){
          callbackCount++;
          if(callbackCount>=1){
            res.render('location', context);
          }
        }
      }
    }else{
      res.redirect('/location');
    }
  });
});

// renders the 'Truck Schedule' page with truck, location, time slot dropdowns, and truckschedule table
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

// INSERTS a schedule into the truckschedule table and re-renders 'Truck Schedule' page
// If duplicate is encountered, error is rendered on the page
app.post ('/truckschedule', function(req, res){
  var mysql = req.app.get('mysql');
  var sql;
  var inserts;

  // NULL option selected
  if (req.body.timeslot == "NULL") {
      var sql = "INSERT INTO truckschedule (food_truck_id, location_id, time_slot_id) VALUES (?, ?, null)";
      var inserts = [req.body.truckName, req.body.location];
  }
  else {
      var sql = "INSERT INTO truckschedule (food_truck_id, location_id, time_slot_id) VALUES (?,?,?)";
      var inserts = [req.body.truckName, req.body.location, req.body.timeslot];
  }
  var context = {};
  var callbackCount = 0;

  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      if(error.code == 'ER_DUP_ENTRY'){
        context.error = 'That entry already exists in the database!';
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
      }
    }else{
      res.redirect('/truckschedule');
    }
  });
});

// UPDATES the schedule in the truckschedule table by taking the schedule_id, location_id, and the time_slot_id selected from the dropdowns
// re-renders the 'Truck Schedule' page with the updated table
app.put('/truckschedule/:schedule_id/:location_id/:time_slot_id', function (req, res){
  var mysql = req.app.get('mysql');
  var sql;
  var inserts;
  
  // NULL option selected
  if (req.params.time_slot_id == "NULL") {
      sql = "UPDATE truckschedule SET location_id=?, time_slot_id=null WHERE schedule_id=?";
      inserts = [req.params.location_id, req.params.schedule_id];
  }
  else{
      sql = "UPDATE truckschedule SET location_id = ?, time_slot_id = ? WHERE schedule_id = ?";
      inserts = [req.params.location_id, req.params.time_slot_id, req.params.schedule_id];
  }
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      console.log(sql);
      res.render('truckschedule');
    }
  })
})

// UPDATES the schedule in the truckschedule table by taking the schedule_id assigned to the delete btn
// re-renders the 'Truck Schedule' page with the updated table
app.delete('/truckschedule/:schedule_id', function (req, res){
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM truckschedule WHERE schedule_id = ?";
  var inserts = req.params.schedule_id;
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      console.log(JSON.stringify(error))
      res.write(JSON.stringify(error));
      res.end();
    }else{
      res.status(200).end();
    }
  })
})

// renders the 'Website' page with foodtruck dropdown and website table
// on page load, website for the first element in dropdown is displayed
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

// SEARCH function occurs onchange in the food truck dropdown
// result is displayed underneath the dropdown
app.get('/search/:s', function(req,res){
  var context = {};
  // context.jsscripts = "tools.js";
  var mysql = req.app.get('mysql');
  var sql = "SELECT website_name FROM website WHERE website.food_truck_id=?";
  var s = req.params.s;
  console.log(sql);

  mysql.pool.query(sql, s, function(error, results){
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

// INSERTS a website into the website table and re-renders 'Website' page
// If duplicate is encountered, error is rendered on the page
app.post ('/website', function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO website (website_name, food_truck_id) VALUES (?, ?)";
  var inserts = [req.body.website, req.body.foodtrucks];
  var context = {};
  var callbackCount = 0;

  sql = mysql.pool.query(sql, inserts, function(error, results){
    if(error){
      console.log(JSON.stringify(error))
      if(error.code == 'ER_DUP_ENTRY'){
        context.error = 'That entry already exists in the database!';
        getAllTrucks(res, mysql, context, complete);
        getWebsiteTable(res, mysql, context, complete);
        function complete(){
          callbackCount++;
          if(callbackCount>=2){
            res.render('website', context);
          }
        }
      }
    }else{
      res.redirect('/website');
    }
  });
});

// FILTER by food truck, location, or time slot from the truckschedule table
// query is determined by option selected from the dropdowns (All, food_truck_id, location_id, and time_slot_id)
// results are rendered on the 'Home' page
app.get("/filter-foodtrucks", function(req,res){
  var context = {};

  var foodTruckID = Number(req.query.foodtrucks);
  var locationID = Number(req.query.location);
  var timeSlotID = Number(req.query.timeslot);

  var sqlQueryString;
  var paramsExist = false;
  var sqlParams;

  //Choosing the correct query
  if (foodTruckID == -1 && locationID == -1 && timeSlotID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id";
  }
  else if (foodTruckID == -1 && locationID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.time_slot_id = ?";
    paramsExist = true;
    sqlParams = [timeSlotID];
  }
  else if (foodTruckID == -1 && timeSlotID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.location_id = ?";
    paramsExist = true;
    sqlParams = [locationID];
  }
  else if (locationID == -1 && timeSlotID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = ?";
    paramsExist = true;
    sqlParams = [foodTruckID];
  }
  else if (foodTruckID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.location_id = ? AND truckschedule.time_slot_id = ?";
    paramsExist = true;
    sqlParams = [locationID, timeSlotID];
  }
  else if (timeSlotID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = ? AND truckschedule.location_id = ?";
    paramsExist = true;
    sqlParams = [foodTruckID, locationID];
  }
  else if (locationID == -1) {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = ? AND truckschedule.time_slot_id = ?";
    paramsExist = true;
    sqlParams = [foodTruckID, timeSlotID];
  }
  else {
    sqlQueryString = "SELECT * FROM truckschedule INNER JOIN foodtruck ON truckschedule.food_truck_id = foodtruck.food_truck_id INNER JOIN timeslot ON truckschedule.time_slot_id = timeslot.time_slot_id INNER JOIN location ON truckschedule.location_id = location.location_id WHERE truckschedule.food_truck_id = ? AND truckschedule.time_slot_id = ? AND truckschedule.location_id = ?";
    paramsExist = true;
    sqlParams = [foodTruckID, timeSlotID, locationID];
  }

  //Sql params have None case
  if (paramsExist) {
    mysql.pool.query(sqlQueryString, sqlParams, function(error, results){
      console.log(sqlQueryString);
      console.log(sqlParams);
      if(error){
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error));
        res.end();

      }else{
        transform(results);
        context.filteredResult = results;
        console.log(context.filteredResult);

        if (context.filteredResult.length == 0) {
          context.statusMsg = "No Schedules Found";
        }
        else {
          context.statusMsg = "Search Successful";
        }

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
      }
    });
  }
  else {
    mysql.pool.query(sqlQueryString, function(error, results){
      if(error){
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error));
        res.end();
      }else{
        transform(results);
        context.filteredResult = results;
        console.log(context.filteredResult);

        if (context.filteredResult.length == 0) {
          context.statusMsg = "No Schedules Found";
        }
        else {
          context.statusMsg = "Search Successful";
        }

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
      }
    });
  }

});

// Other Error
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// Server Side Error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

// prints server start message to server console
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});