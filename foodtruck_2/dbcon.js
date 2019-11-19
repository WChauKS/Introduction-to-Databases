var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_chauw',
  password        : '2070',
  database        : 'cs340_chauw'
});

module.exports.pool = pool;