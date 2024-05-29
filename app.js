
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
// Route for the index page
app.get('/', function(req, res) {
    res.render('index', { message: 'Welcome to the Index Page' });
});

/* READ Customer*/
app.get('/Customers', function(req, res) {
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

        return res.render('Customers', { data: customers });
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

    READ Raw Material   

*/
app.get('/RawMaterials', function(req, res) {
    // Declare Query 2
    let query2;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.material_name === undefined) {
        query2 = "SELECT * FROM RawMaterials;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query2 = `SELECT * FROM RawMaterials WHERE material_name LIKE "${req.query.material_name}%"`;
    }

    // Run the 1st query
    db.pool.query(query2, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Save the customers
        let raw_materials = rows;

        return res.render('RawMaterials', { data: raw_materials });
    });
});

/*

    READ Recipes   

*/
app.get('/recipe', function(req, res) {
    // Declare Query 3
    let query3;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.flavor === undefined) {
        query3 = "SELECT Products.flavor, RawMaterials.material_name, Recipes.required_oz FROM Recipes JOIN Products ON Recipes.product_id = Products.product_id LEFT JOIN RawMaterials ON Recipes.raw_material_id = RawMaterials.raw_material_id;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query3 = `SELECT Products.flavor, RawMaterials.material_name, Recipes.required_oz FROM Recipes JOIN Products ON Recipes.product_id = Products.product_id LEFT JOIN RawMaterials ON Recipes.raw_material_id = RawMaterials.raw_material_id WHERE flavor LIKE "${req.query.flavor}%"`;
    }

    // Run the 1st query
    db.pool.query(query3, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Save the customers
        let recipes = rows;

        return res.render('recipe', { data: recipes });
    });
});

/*

    READ Purchase Orders   

*/
app.get('/PurchaseOrders', function(req, res) {
    // Declare Query 4
    let query4;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.raw_material_name === undefined) {
        query4 = "SELECT PurchaseOrders.purchase_id, RawMaterials.material_name, PurchaseOrders.total_cost, PurchaseOrders.order_oz, PurchaseOrders.date_received FROM PurchaseOrders JOIN RawMaterials ON PurchaseOrders.raw_material_id = RawMaterials.raw_material_id;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query4 = `SELECT PurchaseOrders.purchase_id, RawMaterials.material_name, PurchaseOrders.total_cost, PurchaseOrders.order_oz, PurchaseOrders.date_received FROM PurchaseOrders JOIN RawMaterials ON PurchaseOrders.raw_material_id = RawMaterials.raw_material_id WHERE RawMaterials.material_name LIKE "${req.query.raw_material_name}%"`;
    }

    // Run the 1st query
    db.pool.query(query4, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Save the customers
        let PurchaseOrder = rows;

        return res.render('PurchaseOrders', { data: PurchaseOrder });
    });
});

/*

    READ Sales Orders   

*/
app.get('/SalesOrders', function(req, res) {
    // Declare Query 5
    let query5;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.flavor === undefined) {
        query5 = "SELECT SalesOrders.sale_id, Products.flavor, Customers.name, SalesOrders.bottle_quantity, SalesOrders.date_shipped, SalesOrders.total_sale, SalesOrders.total_cost FROM SalesOrders JOIN Products ON SalesOrders.product_id = Products.product_id JOIN Customers ON SalesOrders.customer_id = Customers.customer_id;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query5 = `SELECT SalesOrders.sale_id, Products.flavor, Customers.name, SalesOrders.bottle_quantity, SalesOrders.date_shipped, SalesOrders.total_sale, SalesOrders.total_cost FROM SalesOrders JOIN Products ON SalesOrders.product_id = Products.product_id JOIN Customers ON SalesOrders.customer_id = Customers.customer_id WHERE Products.flavor LIKE "${req.query.flavor}%"`;
    }

    // Run the 1st query
    db.pool.query(query5, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Save the customers
        let SalesOrder = rows;

        return res.render('SalesOrders', { data: SalesOrder });
    });
});

/*

    READ Products   

*/
app.get('/Products', function(req, res) {
    // Declare Query 6
    let query6;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.flavor === undefined) {
        query6 = "SELECT * FROM Products;";
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        query6 = `SELECT * FROM Products WHERE flavor LIKE "${req.query.flavor}%"`;
    }

    // Run the 1st query
    db.pool.query(query6, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Save the customers
        let Product = rows;

        return res.render('Products', { data: Product });
    });
});




/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
