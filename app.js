

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
PORT        = 9745;  

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

/* READ HOME PAGE */
// Route for the index page
app.get('/', function(req, res) {
    res.render('index', { message: 'Welcome to the Index Page' });
});

/* READ Customer */
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
/* CREATE Customer */
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
            res.redirect('/Customers');
        }
    })
})

/* DELETE Customer */
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

/* UPDATE Customer */
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

/* CREATE Raw Material */
app.post('/add-raw-material-form', function(req, res){
    console.log('Received POST request to /add-rawMaterial');
    console.log('Form data:', req.body);
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    const query_material_add = `INSERT INTO RawMaterials (material_name, cost_per_oz) VALUES (?, ?)`;
    db.pool.query(query_material_add, [data['input-raw-material-name'], data['input-cost-per-oz']], function(error, result){
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        // Redirect to the /products route with the product_id
        res.redirect('/Rawmaterials');
    });
})

/* DELETE Raw material */
app.delete('/delete-raw-material-ajax', function(req, res) {
    let data = req.body;
    let raw_material_id = parseInt(data.id);
    let delete_raw_material = `DELETE FROM RawMaterials WHERE raw_material_id = ?`;
    
    db.pool.query(delete_raw_material, [raw_material_id], function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
  });

  /* UPDATE Raw material */
app.put('/update-raw-material-ajax', function(req, res) {
    let data = req.body;
    let query_update_rm = `UPDATE RawMaterials SET material_name = ?, cost_per_oz = ?, quantity_oz = ? WHERE raw_material_id = ?`;
    /* use params based on data object from update_customer.js */
    let params = [data.material_name, data.cost_per_oz, data.quantity_oz, data.raw_material_id];

    db.pool.query(query_update_rm, params, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});
/* READ Recipes */
app.get('/recipe', function(req, res) {
    // Declare Queries to get flavor and material_name
    let queryRawMaterials = "SELECT raw_material_id, material_name FROM RawMaterials";
    let queryProducts = "SELECT product_id, flavor FROM Products";
    let queryRecipe;

     // If there is no query string, we just perform a basic SELECT
     if (req.query.flavor === undefined) {
        queryRecipe = `
        SELECT Products.flavor, RawMaterials.material_name, Recipes.required_oz
        FROM Recipes
        JOIN Products ON Recipes.product_id = Products.product_id
        LEFT JOIN RawMaterials ON Recipes.raw_material_id = RawMaterials.raw_material_id
    `;
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        queryRecipe = `
        SELECT Products.flavor, RawMaterials.material_name, Recipes.required_oz
        FROM Recipes
        JOIN Products ON Recipes.product_id = Products.product_id
        LEFT JOIN RawMaterials ON Recipes.raw_material_id = RawMaterials.raw_material_id
        WHERE flavor LIKE "${req.query.flavor}%"
    `;
    }

    // get material_names
    db.pool.query(queryRawMaterials, function(error, ingredients, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }
        // get flavors
        db.pool.query(queryProducts, function(error, flavors, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }
            // get recipes
            db.pool.query(queryRecipe, function(error, recipes, fields) {
                if (error) {
                    console.log(error);
                    return res.sendStatus(500);
                }

                res.render('recipe', { ingredients: ingredients, flavors:flavors, data: recipes });
            });
        });
    });
});

/* CREATE Recipe */
app.post('/add-recipe-form', function(req, res) {
    let data = req.body;

    // Log the received form data for debugging
    console.log('Form data received:', data);


    let flavor = data.selectProduct;
    let material_name1 = data.selectMaterial1;
    let required_oz1 = data['selectOz1']
    let material_name2 = data.selectMaterial2;
    let required_oz2 = data['selectOz2'];
    

    if (!flavor || !material_name1 || !required_oz1 || !material_name2 || !required_oz2) {
        console.log('Error: One or more fields are missing');
        return res.status(400).send('All fields are required');
    }

    // Query to fetch raw_material_id & order_oz from RawMaterials
    let query_product_id = `
        SELECT 
            Products.product_id
        FROM 
            Products
        WHERE 
            Products.flavor = ? 
    `;

    // Query to fetch raw_material_id & order_oz from RawMaterials
    let query_material_id1 = `
        SELECT 
            RawMaterials.raw_material_id 
        FROM 
            RawMaterials
        WHERE 
            RawMaterials.material_name = ? 
    `;

    // Query to fetch raw_material_id & order_oz from RawMaterials
    let query_material_id2 = `
        SELECT 
            RawMaterials.raw_material_id 
        FROM 
            RawMaterials
        WHERE 
            RawMaterials.material_name = ? 
    `;

    // Insert the first record into the Recipe table
    let query_insert_recipe1 = `
        INSERT INTO Recipes
        (product_id, raw_material_id, required_oz)
        VALUES (?, ?, ?)
    `;

    // Insert the second record into the Recipe table
    let query_insert_recipe2 = `
        INSERT INTO Recipes
        (product_id, raw_material_id, required_oz)
        VALUES (?, ?, ?)
    `;

    db.pool.query(query_product_id, [flavor], function(error, flavorResults, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        if (flavorResults.length === 0) {
            console.log('Error: No product found with selection');
            return res.status(400).send('No product found!');
        }

        let product_id = flavorResults[0].product_id;

        db.pool.query(query_material_id1, [material_name1], function(error, nameResults1, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }
    
            if (nameResults1.length === 0) {
                console.log('Error: No material found with selection 1');
                return res.status(400).send('No material found!');
            }
    
            let raw_material_id1 = nameResults1[0].raw_material_id;

            db.pool.query(query_material_id2, [material_name2], function(error, nameResults2, fields) {
                if (error) {
                    console.log(error);
                    return res.sendStatus(400);
                }
        
                if (nameResults2.length === 0) {
                    console.log('Error: No material found with selection 2');
                    return res.status(400).send('No material found!');
                }
        
                let raw_material_id2 = nameResults2[0].raw_material_id;
                let params1 = [product_id, raw_material_id1, required_oz1];
                let params2 = [product_id, raw_material_id2, required_oz2];

                db.pool.query(query_insert_recipe1, params1, function(error, rows, fields) {
                    if (error) {
                        console.log('Database error:', error);
                        return res.sendStatus(400);
                    }

                    db.pool.query(query_insert_recipe2, params2, function(error, rows, fields) {
                        if (error) {
                            console.log('Database error:', error);
                            return res.sendStatus(400);
                        }
        
                        return res.redirect('/recipe');
                    });
                });
            });
        });
    });        
});


 /* UPDATE Recipe */
  app.put('/update-recipe-ajax', function(req, res) {
    let data = req.body;

    
    // Log the received data for debugging
    console.log('Received data:', data);

    let flavor = data.selectFlavor;
    let new_material_name = data.selectMaterial;
    let required_oz = data['update-oz'];



    if (!flavor || !new_material_name || !required_oz) {
       console.log('Error: One or more fields are missing');
        return res.status(400).send('All fields are required');
    }

    // Log the query parameters
    console.log('Flavor:', flavor);
    console.log('Material Name:', new_material_name);

    // Fetch selected flavor raw_material_id
    let query_prod_id = `
    SELECT 
        product_id
    FROM 
        Products
    WHERE 
        flavor = ?
    `;

    // Log the query and parameters for debugging
    console.log('Executing query:', query_prod_id);
    console.log('With parameters:', flavor);

    db.pool.query(query_prod_id, [flavor], function(error, flavorResults, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        if (flavorResults.length === 0) {
            console.log('Error: No product or raw material found with the given flavor and material name');
            return res.status(400).send('No product or raw material found');
        }

        let product_id = flavorResults[0].product_id;
        
        // Fetch current raw_material_id based on product_id
        let query_mat_id = `
            SELECT 
                raw_material_id
            FROM 
                Recipes
            WHERE 
                product_id = ?
        `;

        db.pool.query(query_mat_id, [product_id], function(error, recipeResults, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            if (recipeResults.length === 0) {
                console.log('Error: No raw material found with the given name');
                return res.status(400).send('No raw material found');
            }

            let current_mat_id = recipeResults[0].raw_material_id;

            // Fetch new raw_material_id based on new_material_name
            let query_new_mat_id = `
                SELECT 
                    raw_material_id
                FROM 
                    RawMaterials
                WHERE 
                    material_name = ?
            `;

            db.pool.query(query_new_mat_id, [new_material_name], function(error, materialResults, fields) {
                if (error) {
                    console.log(error);
                    return res.sendStatus(400);
                }

                if (materialResults.length === 0) {
                    console.log('Error: No raw material found with the given name');
                    return res.status(400).send('No raw material found');
                }

                let new_mat_id = materialResults[0].raw_material_id;

                // Update the recipe
                let query_update_recipe = `
                UPDATE Recipes
                SET required_oz = ?, raw_material_id = ?
                WHERE product_id = ? AND raw_material_id = ?
                `;

                let params = [required_oz, new_mat_id, product_id, current_mat_id];

                db.pool.query(query_update_recipe, params, function(error, rows, fields) {
                    if (error) {
                        console.log('Database error:', error);
                        return res.sendStatus(400);
                    }

                    return res.sendStatus(200);
                });
            });
        });
    });
});

/*
    READ Purchase Orders   
*/
app.get('/PurchaseOrders', function(req, res) {
    let queryRawMaterials = "SELECT raw_material_id, material_name FROM RawMaterials";
    let queryPurchaseOrders;

     // If there is no query string, we just perform a basic SELECT
     if (req.query.raw_material_name === undefined) {
        queryPurchaseOrders = `
        SELECT PurchaseOrders.purchase_id, RawMaterials.material_name, PurchaseOrders.total_cost, PurchaseOrders.order_oz, PurchaseOrders.date_received
        FROM PurchaseOrders
        JOIN RawMaterials ON PurchaseOrders.raw_material_id = RawMaterials.raw_material_id
    `;
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        queryPurchaseOrders = `
        SELECT PurchaseOrders.purchase_id, RawMaterials.material_name, PurchaseOrders.total_cost, PurchaseOrders.order_oz, PurchaseOrders.date_received
        FROM PurchaseOrders
        JOIN RawMaterials ON PurchaseOrders.raw_material_id = RawMaterials.raw_material_id
        WHERE material_name LIKE "${req.query.raw_material_name}%"
    `;
    }
    
    db.pool.query(queryRawMaterials, function(error, ingredients, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        db.pool.query(queryPurchaseOrders, function(error, purchaseOrders, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            console.log('RawMaterials:', ingredients);  // Log ingredients(RawMaterials) to ensure they are not empty
            console.log('PurchaseOrders:', purchaseOrders);

            res.render('PurchaseOrders', { ingredients: ingredients, data: purchaseOrders });
        
        });
    });
});


/* CREATE Purchase Orders */
app.post('/add-purchase-form', function(req, res) {
    let data = req.body;

    // Log the received form data for debugging
    console.log('Form data received:', data);

    let material_name = data.selectMaterial;
    let order_oz = data['input-order-oz'];
    let date_received = data['input-date-received'];
    

    if (!material_name || !order_oz || !date_received) {
        console.log('Error: One or more fields are missing');
        return res.status(400).send('All fields are required');
    }

    // Query to fetch raw_material_id & order_oz from RawMaterials
    let query_fetch_ids = `
        SELECT 
            RawMaterials.raw_material_id, 
            RawMaterials.cost_per_oz 
        FROM 
            RawMaterials
        WHERE 
            RawMaterials.material_name = ? 
    `;

    db.pool.query(query_fetch_ids, [material_name], function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        if (results.length === 0) {
            console.log('Error: No ingredient found with selection');
            return res.status(400).send('No ingredient found!');
        }

        let raw_material_id = results[0].raw_material_id;
        let cost_per_oz = results[0].cost_per_oz;
        let total_cost = cost_per_oz * order_oz;
             
        // Update the RawMaterials qty
        let query_update_material_qty = `
            UPDATE RawMaterials
            SET quantity_oz = quantity_oz + ?
            WHERE raw_material_id = ? 
       `;

        // Insert the new sale into the SalesOrders table
        let query_insert_purchase = `
            INSERT INTO PurchaseOrders 
            (raw_material_id, total_cost, order_oz, date_received)
            VALUES (?, ?, ?, ?)
        `;

        let params1 = [order_oz, raw_material_id];

        let params = [raw_material_id, total_cost, order_oz, date_received];

        // Log the query and parameters for debugging
        console.log('Executing query:', query_update_material_qty);
        console.log('With parameters:', params1);

        db.pool.query(query_update_material_qty, params1, function(error, rows, fields) {
            if (error) {
                console.log('Error updating RawMaterial table with PO quantity:', error);
                return res.sendStatus(400);
            }
        });

            // Log the query and parameters for debugging
            console.log('Executing query:', query_insert_purchase);
            console.log('With parameters:', params);

            db.pool.query(query_insert_purchase, params, function(error, rows, fields) {
                if (error) {
                    console.log('Database error:', error);
                    return res.sendStatus(400);
                }

                return res.redirect('/PurchaseOrders');
            });
    });
});


/* DELETE Purchase Orders */
app.delete('/delete-po-ajax', function(req, res) {
    let data = req.body;
    let purchase_id= parseInt(data.id);
    let delete_po = `DELETE FROM PurchaseOrders WHERE purchase_id = ?`;
    
    db.pool.query(delete_po, [purchase_id], function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
  });

  /* UPDATE Purchase Orders */
app.put('/update-po-ajax', function(req, res) {
    let data = req.body;
    let purchase_id = data.purchase_id;
    let material_name_dropdown = data['input-new-name'];
    let order_oz = data['update-quantity'];
    let date_received = data['update-date'];

    // Fetch the raw_material_id and cost_per_oz from the RawMaterials table
    let query_fetch_raw_material = `
        SELECT raw_material_id, cost_per_oz
        FROM RawMaterials
        WHERE material_name = ?
    `;

    db.pool.query(query_fetch_raw_material, [material_name_dropdown], function(error, raw_material_result, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        if (raw_material_result.length === 0) {
            // Handle the case where the material_name is not found in the RawMaterials table
            return res.status(400).send('Material name not found');
        }

        let raw_material_id = raw_material_result[0].raw_material_id;
        let cost_per_oz = raw_material_result[0].cost_per_oz;
        let total_cost = cost_per_oz * order_oz;

        // Update the PurchaseOrders table
        let query_update_po = `
            UPDATE PurchaseOrders
            SET raw_material_id = ?, order_oz = ?, total_cost = ?, date_received = ?
            WHERE purchase_id = ?
        `;
        let params = [raw_material_id, order_oz, total_cost, date_received, purchase_id];

        db.pool.query(query_update_po, params, function(error, rows, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            return res.sendStatus(200);
        });
    });
});


/*
    READ Sales Orders   
*/
app.get('/SalesOrders', function(req, res) {
    let queryProducts = "SELECT product_id, flavor FROM Products";
    let queryCustomers = "SELECT customer_id, name FROM Customers";
    let querySalesOrders;

     // If there is no query string, we just perform a basic SELECT
     if (req.query.flavor === undefined) {
        querySalesOrders = `
        SELECT SalesOrders.sale_id, Products.flavor, Customers.name, SalesOrders.bottle_quantity, SalesOrders.date_shipped, SalesOrders.total_sale, SalesOrders.total_cost
        FROM SalesOrders
        JOIN Products ON SalesOrders.product_id = Products.product_id
        JOIN Customers ON SalesOrders.customer_id = Customers.customer_id
    `;
    }
    // If there is a query string, we assume this is a search, and return desired results
    else {
        querySalesOrders = `
        SELECT SalesOrders.sale_id, Products.flavor, Customers.name, SalesOrders.bottle_quantity, SalesOrders.date_shipped, SalesOrders.total_sale, SalesOrders.total_cost
        FROM SalesOrders
        JOIN Products ON SalesOrders.product_id = Products.product_id
        JOIN Customers ON SalesOrders.customer_id = Customers.customer_id
        WHERE flavor LIKE "${req.query.flavor}%"
    `;
    }
    
    db.pool.query(queryProducts, function(error, products, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        db.pool.query(queryCustomers, function(error, customers, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            db.pool.query(querySalesOrders, function(error, salesOrders, fields) {
                if (error) {
                    console.log(error);
                    return res.sendStatus(500);
                }

                res.render('SalesOrders', { flavors: products, customers: customers, data: salesOrders });
            });
        });
    });
});

// CREATE sale

app.post('/add-sale-form', function(req, res) {
    let data = req.body;

    // Log the received form data for debugging
    console.log('Form data received:', data);

    let flavor = data.selectFlavor;
    let name = data.selectCustomer;
    let bottle_quantity = data['input-bottle-quantity'];
    let date_shipped = data['input-date-shipped'];

    if (!flavor || !name || !bottle_quantity || !date_shipped) {
        console.log('Error: One or more fields are missing');
        return res.status(400).send('All fields are required');
    }

    // Query to fetch product_id, price_per_bottle, and customer_id
    let query_fetch_ids = `
        SELECT 
            Products.product_id, 
            Products.price_per_bottle, 
            Customers.customer_id
        FROM 
            Products, 
            Customers
        WHERE 
            Products.flavor = ? 
            AND Customers.name = ?
    `;

    db.pool.query(query_fetch_ids, [flavor, name], function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        if (results.length === 0) {
            console.log('Error: No product or customer found with the given flavor and name');
            return res.status(400).send('No product or customer found');
        }

        let product_id = results[0].product_id;
        let price_per_bottle = results[0].price_per_bottle;
        let customer_id = results[0].customer_id;
        let total_sale = price_per_bottle * bottle_quantity;

        // Query to fetch the total cost
        let query_fetch_cost = `
            SELECT 
                SUM(RawMaterials.cost_per_oz * Recipes.required_oz) AS total_cost
            FROM 
                Recipes
            JOIN 
                RawMaterials 
            ON 
                Recipes.raw_material_id = RawMaterials.raw_material_id
            WHERE 
                Recipes.product_id = ?
        `;

        db.pool.query(query_fetch_cost, [product_id], function(error, cost_results, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            let total_cost = cost_results[0].total_cost * bottle_quantity;

            // Insert the new sale into the SalesOrders table
            let query_insert_sale = `
                INSERT INTO SalesOrders 
                (product_id, customer_id, bottle_quantity, date_shipped, total_sale, total_cost)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            let params = [product_id, customer_id, bottle_quantity, date_shipped, total_sale, total_cost];

            db.pool.query(query_insert_sale, params, function(error, rows, fields) {
                if (error) {
                    console.log('Database error:', error);
                    return res.sendStatus(400);
                }
                    // Update the quantity of each raw material used in the order
                    let query_fetch_recipe = `
                    SELECT raw_material_id, required_oz
                    FROM Recipes
                    WHERE product_id = ?
                `;
                db.pool.query(query_fetch_recipe, [product_id], function(error, recipe_results, fields) {
                    if (error) {
                        console.log(error);
                        return res.sendStatus(400);
                    }
                        // Deduct the required quantity from each raw material
                        recipe_results.forEach(function(recipe) {
                            let total_oz_used = recipe.required_oz * bottle_quantity;
    
                            let query_update_material_qty = `
                                UPDATE RawMaterials
                                SET quantity_oz = quantity_oz - ?
                                WHERE raw_material_id = ?
                            `;
    
                            db.pool.query(query_update_material_qty, [total_oz_used, recipe.raw_material_id], function(error, update_results, fields) {
                                if (error) {
                                    console.log(error);
                                    return res.sendStatus(400);
                                }
    
                                console.log(`Updated RawMaterial ${recipe.raw_material_id} by deducting ${total_oz_used} oz`);
                            });
                        });
                
                return res.redirect('/SalesOrders');
                });
            });
        });
    });
});





/* UPDATE Sales Orders */
app.put('/update-sale-ajax', function(req, res) {
    let data = req.body;
    let sale_id = data.sale_id;
    let flavor_name = data['input-new-flavor'];
    let customer_name = data['update-customer-name'];
    let new_bottle_quantity = parseInt(data['update-bottles']);
    let date_shipped = data['update-date'];

    // Fetch the old bottle 
    let query_fetch_old = `
        SELECT SalesOrders.bottle_quantity, Products.product_id
        FROM SalesOrders
        JOIN Products ON SalesOrders.product_id = Products.product_id
        WHERE SalesOrders.sale_id = ?
    `;

    db.pool.query(query_fetch_old, [sale_id], function(error, old_results, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        if (old_results.length === 0) {
            return res.status(400).send('Sale order not found');
        }

        let old_bottle_quantity = old_results[0].bottle_quantity;
        let product_id = old_results[0].product_id;

        // Fetch the product_id, price_per_bottle and customer_id from the respective tables
        let query_fetch_ids = `
            SELECT Products.product_id, Products.price_per_bottle, Customers.customer_id
            FROM Products, Customers
            WHERE Products.flavor = ? AND Customers.name = ?
        `;

        db.pool.query(query_fetch_ids, [flavor_name, customer_name], function(error, result, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            if (result.length === 0) {
                return res.status(400).send('Flavor or customer not found');
            }

            let product_id = result[0].product_id;
            let price_per_bottle = result[0].price_per_bottle;
            let customer_id = result[0].customer_id;

            let total_sale = price_per_bottle * new_bottle_quantity;

            // Fetch the raw material costs 
            let query_fetch_costs = `
                SELECT SUM(RawMaterials.cost_per_oz * Recipes.required_oz) AS total_cost
                FROM Recipes
                JOIN RawMaterials ON Recipes.raw_material_id = RawMaterials.raw_material_id
                WHERE Recipes.product_id = ?
            `;

            db.pool.query(query_fetch_costs, [product_id], function(error, cost_result, fields) {
                if (error) {
                    console.log(error);
                    return res.sendStatus(400);
                }

                let total_cost = cost_result[0].total_cost * new_bottle_quantity;

                // Update the SalesOrders table
                let query_update_sale = `
                    UPDATE SalesOrders
                    SET product_id = ?, customer_id = ?, bottle_quantity = ?, date_shipped = ?, total_sale = ?, total_cost = ?
                    WHERE sale_id = ?
                `;
                let params = [product_id, customer_id, new_bottle_quantity, date_shipped, total_sale, total_cost, sale_id];

                db.pool.query(query_update_sale, params, function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return res.sendStatus(400);
                    }

                    // Calculate the difference in bottle quantity
                    let bottle_difference = new_bottle_quantity - old_bottle_quantity;

                    // Fetch the raw material usage for the product
                    let query_fetch_recipe = `
                        SELECT raw_material_id, required_oz
                        FROM Recipes
                        WHERE product_id = ?
                    `;

                    db.pool.query(query_fetch_recipe, [product_id], function(error, recipe_results, fields) {
                        if (error) {
                            console.log(error);
                            return res.sendStatus(400);
                        }

                        // Adjust the quantity of each raw material based on the difference
                        recipe_results.forEach(function(recipe) {
                            let total_oz_used = recipe.required_oz * bottle_difference;

                            let query_update_material_qty = `
                                UPDATE RawMaterials
                                SET quantity_oz = quantity_oz - ?
                                WHERE raw_material_id = ?
                            `;

                            db.pool.query(query_update_material_qty, [total_oz_used, recipe.raw_material_id], function(error, update_results, fields) {
                                if (error) {
                                    console.log(error);
                                    return res.sendStatus(400);
                                }

                                console.log(`Updated RawMaterial ${recipe.raw_material_id} by adjusting ${total_oz_used} oz`);
                            });
                        });

                        res.sendStatus(200);
                    });
                });
            });
        });
    });
});


/* DELETE Sales Order */
app.delete('/delete-sales-order-ajax/', function(req, res, next) {
    let data = req.body;
    let sale_id = parseInt(data.id);
    let delete_sale_order = `DELETE FROM SalesOrders WHERE sale_id = ?`;
    db.pool.query(delete_sale_order, [sale_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
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

        // Save the product
        let Product = rows;
        const product_id = req.query.product_id;
        return res.render('Products', { data: Product, product_id: product_id});
    });
    
});

/* CREATE Product */
app.post('/add-product-form', function(req, res){
    console.log('Received POST request to /add-product');
    console.log('Form data:', req.body);
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    const query_product_add = `INSERT INTO Products (flavor, price_per_bottle) VALUES (?, ?)`;
    db.pool.query(query_product_add, [data['input-flavor'], data['input-price']], function(error, result){
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        // Get the newly inserted product_id
        const product_id = result.insertId;

        // Redirect to the /products route with the product_id
        res.redirect('/Products');
    });
})

  
/* CREATE Recipe
app.post('/add-recipe-form', function(req, res){
    console.log('Received POST request to /add-recipe');
    console.log('Form data:', req.body);
    
    let data = req.body;

    const query_ingredient1_add = `INSERT INTO Recipes (product_id, raw_material_id, required_oz) VALUES (?, ?, ?)`;
    const query_ingredient2_add = `INSERT INTO Recipes (product_id, raw_material_id, required_oz) VALUES (?, ?, ?)`;
  
    db.pool.query(query_ingredient1_add, [data['product-id'], data['input-ingredient-1'], data['required-oz-1']], function(error, result){
      if (error) {
        console.log(error);
        return res.sendStatus(400);
      }
  
      db.pool.query(query_ingredient2_add, [data['product-id'], data['input-ingredient-2'], data['required-oz-2']], function(error, result){
        if (error) {
          console.log(error);
          return res.sendStatus(400);
        }

        res.redirect('/Products');
      });
    });
}); */

/* DELETE Product */

app.delete('/delete-product-ajax', function(req, res) {
    let data = req.body;
    let product_id = parseInt(data.id);
    let delete_product = `DELETE FROM Products WHERE product_id = ?`;
    
    db.pool.query(delete_product, [product_id], function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
  });

  /* UPDATE Product */
app.put('/update-product-ajax', function(req, res) {
    let data = req.body;
    let query = `UPDATE Products SET flavor = ?, price_per_bottle = ? WHERE product_id = ?`;
    /* use params based on data object from update_customer.js */
    let params = [data.flavor, data.price_per_bottle, data.product_id];

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
