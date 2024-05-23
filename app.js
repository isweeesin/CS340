
// Citation for the following function: app.js -> Express setup, CRUD using route handlers
// Date: 5/22/2024
// Adapted from: Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856


// app.js
/*
    SETUP
*/
// Express
var express = require('express');   // library from web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 1102;  

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



// Database
var db = require('./Database/db-connector')


/*
    ROUTES
*/

/* READ */
app.get('/', function(req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.name === undefined) {
        query1 = "SELECT * FROM Customers;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Customers WHERE name LIKE "${req.query.name}%"`;
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Save the customers
        let customers = rows;

        return res.render('index', { data: customers });
    });
});
                                     // will process this file, before sending the finished HTML to the client.
/* CREATE */
app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let phone_number = data['input-phone_number'] ? `'${data['input-phone_number']}'` : 'NULL';
    let email = data['input-email'] ? `'${data['input-email']}'` : 'NULL';
    

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (name, phone_number, email) VALUES ('${data['input-name']}', ${phone_number}, ${email})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM cusomters and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
})
/* DELETE */
app.delete('/delete-customer-ajax/', function(req, res, next) {
    let data = req.body;
    let customer_id = parseInt(data.id);
    let delete_customer = `DELETE FROM Customers WHERE customer_id = ?`;
    /* CASCADE should handle SalesOrder table where customer is FK */
    db.pool.query(delete_customer, [customer_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

/* UPDATE */
app.put('/update-customer-ajax', function(req, res) {
    let data = req.body;
    let query = `UPDATE Customers SET name = ?, phone_number = ?, email = ? WHERE customer_id = ?`;
    /* use params based on data object from update_customer.js */
    let params = [data.name, data.phone_number, data.email, data.customer_id];

    db.pool.query(query, params, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});





/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
