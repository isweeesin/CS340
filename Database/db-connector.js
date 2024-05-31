// Citation for the following function: db-connector.js -> connect mySQL & create connection pool 
// Date: 5/22/2024
// Adapted from: Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856




// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 30,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_wooleybr',
    password        : '**********',
    database        : 'cs340_wooleybr'
})

// Check if the database connection is successful
pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to get connection:', err);
    } else {
      console.log('Database connection successful');
      // Release the connection when done
      connection.release();
    }
  });

// Export it for use in our application
module.exports.pool = pool;
