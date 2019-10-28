/*Wesley Chau*/

var express = require('express');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// placeholder
app.set('port', 12345);

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

app.get('/truckschedule', function(req,res){
  res.render('truckschedule');
});

app.get('/website', function(req,res){
  res.render('website');
});

// app.get('/contact', function(req,res){
//   res.render('contact');
// });

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
