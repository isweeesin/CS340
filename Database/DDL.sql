

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NULL,
  `phone_number` varchar(16) NULL,
  PRIMARY KEY(`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- example data into table `Customers`
--

INSERT INTO `Customers` (`name`,`email`,`phone_number`)
VALUES
  ('Moses Galloway','cras.eget@icloud.com','1-587-322-5586'),
  ('Baker Flowers','quis.lectus@protonmail.couk','1-546-253-6782'),
  ('Eugenia Nichols','risus.a@google.edu','1-627-144-9956'),
  ('Eleanor Nieves','mauris.a.nunc@aol.net','1-663-511-1454'),
  ('Alfonso Holmes','amet@google.ca','1-418-935-2152');


-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `flavor` varchar(50) NOT NULL,
  `price_per_bottle` decimal(11,2) NOT NULL, /* removed cost_per_bottle */
  PRIMARY KEY(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Dumping data into table `Products`
--

INSERT INTO `Products` (`flavor`,`price_per_bottle`)
VALUES
  ('Brent''s Blazin',5.25),
  ('Nadir''s Nectar',5.25),
  ('The Best',5.25);

-- --------------------------------------------------------

--
-- Table structure for table `RawMaterials`
--

CREATE TABLE `RawMaterials` (
  `raw_material_id` int(11) NOT NULL AUTO_INCREMENT,
  `material_name` varchar(25) NOT NULL,
  `cost_per_oz` decimal(11,2) NOT NULL,
  `quantity_oz` int(11) NOT NULL,
   PRIMARY KEY(`raw_material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Dumping data into table `RawMaterials`
--

INSERT INTO `RawMaterials` (`material_name`, `cost_per_oz`, `quantity_oz`)
VALUES
('Vinegar', 0.30, 0),
('Lime Juice', 0.45, 0),
('Jalapeno', 0.30, 0),
('Habanero', 0.50, 0),
('Ghost Pepper', 1.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `PurchaseOrders`
--

CREATE TABLE `PurchaseOrders` (
  `purchase_id` int(11) NOT NULL AUTO_INCREMENT,
  `raw_material_id` int(11) NULL,
  `total_cost` decimal(11,2) NOT NULL,
  `order_oz` int(11) NOT NULL,
  `date_received` date NOT NULL,
   PRIMARY KEY(`purchase_id`),
   FOREIGN KEY (raw_material_id) REFERENCES RawMaterials(raw_material_id) ON DELETE SET NULL /* Cascade operation for deleted raw material, should not delete whole record as we still want the cost data */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Dumping data into table `PurchaseOrders`
--

INSERT INTO `PurchaseOrders` ( `raw_material_id`, `total_cost`, `order_oz`, `date_received`)
VALUES
(1, 125.10, 417, '2024-01-01'),
(3, 64.20, 214, '2024-01-01'),
(2, 70.20, 156, '2024-01-01'),
(5, 64.00, 64, '2024-01-01'),
(4, 52.00, 104, '2024-01-01');



-- --------------------------------------------------------

-- Table structure for table `Recipes`
-- Entity changed to 'Recipes' for Draft 3 final

CREATE TABLE Recipes (
  product_id int(11) NOT NULL,
  raw_material_id int(11) NULL,
  required_oz int(11) NOT NULL,
   FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE, /* Cascade operation for deleted product will remove all records */
   FOREIGN KEY (raw_material_id) REFERENCES RawMaterials(raw_material_id) ON DELETE SET NULL /* if raw material deleted, just null as other products may use it */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- --------------------------------------------------------

--
-- Dumping data into table `Recipes`
--

INSERT INTO `Recipes` (`product_id`, `raw_material_id`, `required_oz`)
VALUES
(1, 1, 3),
(1, 5, 2),
(2, 2, 3),
(2, 4, 2),
(3, 1, 3),
(3, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `SalesOrders`
--

CREATE TABLE `SalesOrders` (
  `sale_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NULL,
  `bottle_quantity` int(11) NOT NULL,
  `date_shipped` date NOT NULL,
  `total_sale` decimal(11,2) NOT NULL,
  `total_cost` decimal(11,2) NOT NULL,
  `customer_id` int(11) NULL,
  PRIMARY KEY(`sale_id`),
   FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE SET NULL, /* Cascade nullify if product is deleted */
   FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL /* nullify if customer deleted */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Dumping data into table `SalesOrders`
--

INSERT INTO `SalesOrders` (`product_id`,`bottle_quantity`,`date_shipped`,`total_sale`,`total_cost`,`customer_id`)
VALUES
  (1,10,'2024-01-11',52.5,29.0,1),
  (1,80,'2023-02-18',420.0,232.0,4),
  (3,82,'2024-03-19',430.5,123.0,3),
  (2,34,'2023-02-08',178.5,79.9,2),
  (2,25,'2024-02-01',131.25,58.75,5);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
