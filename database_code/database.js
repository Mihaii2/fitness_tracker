const mysql = require('mysql');
const os = require('os');

console.log(os.platform());

let database_data = {};

if(process.env.NODE_ENV === 'production') {
  console.log('Using production database');
  database_data = {
    host: 'database-1.c52s0g6aya8w.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'mafiosu123',
    database: 'database_1',
    port: 3306
  }
} else {
  console.log('Using local database');
  database_data = {
    host: 'localhost',
    user: 'mihai',
    password: 'mafiosu123',
    database: 'database_1'
  }
}

// Database connection configuration
const connection = mysql.createConnection(database_data);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// Export the connection
module.exports = connection;