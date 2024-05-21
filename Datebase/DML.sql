-- Front end variables denoted with a ':'


/* SELECT query for Products page table */
SELECT
Products.product_id AS id,
Products.flavor AS flavor,
Products.price_per_bottle AS price
FROM Products;

/* SELECT query for Customers page table */
SELECT
Customers.customer_id AS id,
Customers.name AS cust_name,
Customers.phone_number AS phone,
Customers.email AS email
FROM Customers;

/* SELECT query for Raw Materials page  */
SELECT
RawMaterials.raw_material_id AS id,
RawMaterials.material_name AS material,
RawMaterials.cost_per_oz AS cost,
RawMaterials.quantity_oz AS quantity
FROM RawMaterials;

/* SELECT query for Recipes page */
/* Uses flavor for product_id & material_name for rm_id" */
SELECT 
Products.flavor,
RawMaterials.material_name,
Recipes.required_oz
FROM Recipes
JOIN Products ON Recipes.product_id = Products.product_id
LEFT JOIN RawMaterials ON Recipes.raw_material_id = RawMaterials.raw_material_id;


/* SELECT query for Purchase Orders page */
/* uses RM.material_name for readability */
SELECT
PurchaseOrders.purchase_id,
RawMaterials.material_name,
PurchaseOrders.total_cost,
PurchaseOrders.order_oz,
PurchaseOrders.date_received
FROM PurchaseOrders
JOIN RawMaterials ON PurchaseOrders.raw_material_id = RawMaterials.raw_material_id;

/* SELECT query for Sales Orders page */
SELECT 
SalesOrders.sale_id,
Products.flavor,
Customers.name,
SalesOrders.bottle_quantity,
SalesOrders.date_shipped,
SalesOrders.total_sale,
SalesOrders.total_cost
FROM SalesOrders
JOIN Products ON SalesOrders.product_id = Products.product_id
JOIN Customers ON SalesOrders.customer_id = Customers.customer_id;

/* Add a new flavor on Products page */
INSERT INTO Products (flavor, price_per_bottle)
VALUES (:flavor, :price_per_bottle);

/* Also, add Recipe on Products page */
INSERT INTO Recipes (product_id, raw_material_id, required_oz)
VALUES /* need two ingredients, two inserts */
  (
  (SELECT product_id FROM Products WHERE flavor = :flavor), 
  (SELECT raw_material_id FROM RawMaterials WHERE material_name = :material1_name_dropdown), 
  :required_oz
  ),
  (
  (SELECT product_id FROM Products WHERE flavor = :flavor), 
  (SELECT raw_material_id FROM RawMaterials WHERE material_name = :material2_name_dropdown), 
  :required_oz
  );

/* Add new customer on customers page */
INSERT INTO Customers (name, phone_number, email)
VALUES (:name, :phone_number, :email);

/* Add new ingredient on Raw Materials page */
INSERT INTO RawMaterials (material_name, cost_per_oz, quantity_oz)
VALUES (:material_name, :cost_per_oz, :quantity_oz);

/* Add a new purchase order on Purchase Orders page */ 
INSERT INTO PurchaseOrders (raw_material_id, total_cost, order_oz, date_received)
VALUES /* total_cost is calc. based on Rawmaterials.cost_per_oz * :order_oz */
	(
    (SELECT raw_material_id FROM RawMaterials WHERE material_name = :material_name_dropdown),
    (SELECT cost_per_oz FROM RawMaterials WHERE material_name = :material_name_dropdown) * :order_oz,
    :order_oz,
    :date_received
    )

/* Add order_oz -> quantity_oz in RawMaterials */
UPDATE RawMaterials
SET quantity_oz = quantity_oz + :order_oz
WHERE raw_material_id = :raw_material_id;

/* Add a new sales order on SalesOrders page */
INSERT INTO SalesOrders (product_id, customer_id, bottle_quantity, date_shipped, total_sale, total_cost)
VALUES /* The total_sale is a product of Products.price_per_bottle * Bottle Quantity
the total_cost is (RawMaterials.cost_per_oz * Recipes.required_oz where 
Recipes.product_id = Products.product_id) * Bottle Quantity */
	(
    (SELECT product_id FROM Products WHERE flavor = :flavor),
	(SELECT customer_id FROM Customers WHERE name = :name),
	:bottle_quantity,
    :date_shipped,
   (SELECT price_per_bottle FROM Products WHERE flavor = :flavor) * :bottle_quantity,
   (SELECT SUM(RawMaterials.cost_per_oz * Recipes.required_oz)
    FROM Recipes
    JOIN RawMaterials ON Recipe.raw_material_id = RawMaterial.raw_material_id
    WHERE Recipes.product_id = (SELECT product_id FROM Products WHERE flavor = :flavor)
   ) * :bottle_quantity)

/* Update the quantity_oz in the RawMaterials table based on the Recipes table */
UPDATE RawMaterials
JOIN Recipes ON RawMaterials.raw_material_id = Recipes.raw_material_id
SET RawMaterial.quantity_oz = RawMaterial.quantity_oz - (ProductRawMaterial.required_oz * :bottle_quantity)
WHERE Recipes.product_id = :product_id;

/* Edit the product records on Products Page */
UPDATE Products
SET
    flavor = :flavor,
    price_per_bottle = :price_per_bottle
WHERE product_id = :product_id;

/* Edit the customer records on Customers Page */
UPDATE Customers
SET
	name = :name,
    phone_number = :phone_numer,
    email = :email
WHERE customer_id = :customer_id;

/* Edit the records on the Raw materials pagee */
UPDATE RawMaterials
SET
    material_name = :material_name,
    cost_per_oz = :cost_per_oz,
    quantity_oz = :qauntity_oz
WHERE raw_material_id = :raw_material_id;

/* Edit the recipe records on Recipes Page */
UPDATE Recipes
SET
    product_id = (SELECT product_id FROM Products WHERE flavor = :product_flavor),
    raw_material_id = (SELECT raw_material_id FROM RawMaterials WHERE material_name = :material_name_dropdown),
    required_oz = :required_oz
  WHERE product_id = (SELECT product_id FROM Products WHERE flavor = :product_flavor)
  AND raw_material_id = (SELECT raw_material_id FROM RawMaterials WHERE material_name = :raw_material_name);

/* Edit the records on Purchase Orders Page */
UPDATE PurchaseOrders
SET
    raw_material_id = (SELECT raw_material_id FROM RawMaterials WHERE material_name = :material_name_dropdown),
    order_oz = :order_oz,
    total_cost = (SELECT cost_per_oz FROM RawMaterials WHERE material_name = :material_name_dropdown) * :order_oz,
    date_received = :date_received
WHERE purchase_id = :purchase_id;

/* Edit the records on Sales Orders Page */
UPDATE SalesOrders
SET
    product_id = (SELECT product_id FROM Products WHERE flavor = :product_dropdown),
    customer_id = (SELECT customer_id FROM Customers WHERE name = :name_dropdown),
    bottle_quantity = :bottle_quantity,
    date_shipped = :date_shipped,
    total_sale = (SELECT price_per_bottle FROM Products WHERE flavor = :flavor) * :bottle_quantity,
    total_cost = (SELECT SUM(RawMaterials.cost_per_oz * Recipes.required_oz)
    FROM Recipes
    JOIN RawMaterials ON Recipe.raw_material_id = RawMaterial.raw_material_id
    WHERE Recipes.product_id = (SELECT product_id FROM Products WHERE flavor = :flavor)
   ) * :bottle_quantity)
WHERE sale_id = :sale_id;

/* Delete a product record */
DELETE FROM Products WHERE product_id = :product_id;

/* Delete a customer record */
DELETE FROM Customers WHERE customer_id = :customer_id;

/* Delete a raw material record */
DELETE FROM RawMaterials WHERE raw_material_id = :raw_material_id;

/* Delete a PO record */
DELETE FROM PurchaseOrders WHERE purchase_order_id = :purchase_order_id;

/* Delete a sales record */
DELETE FROM SalesOrders WHERE sale_id = :sale_id;