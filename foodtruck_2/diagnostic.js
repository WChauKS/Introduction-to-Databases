var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

//added helper to determine default drop down
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

function getLocationTable(res, mysql, context, complete){
  var sql = "SELECT * FROM location foodtruck ORDER BY location_name ASC";
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
  var sql;
  var inserts;

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

app.put('/truckschedule/:schedule_id/:location_id/:time_slot_id', function (req, res){
  var mysql = req.app.get('mysql');
  var sql;
  var inserts;
  
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
