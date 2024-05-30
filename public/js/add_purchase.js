// Get the objects we need to modify
let addPurchaseForm = document.getElementById('add-purchase-form-ajax');

// Modify the objects we need
addPurchaseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRawMaterial = document.getElementById("input-raw-material-id");
    let inputOrderOz = document.getElementById("input-order-oz");
    let inputDateReceived = document.getElementById("input-date-received");

    // Get the values from the form fields
    let rawMaterialIdValue = inputRawMaterial.value;
    let orderOzValue = inputOrderOz.value;
    let dateReceivedValue = inputDateReceived.value;
    
    // Get the cost per oz from the selected raw material
    let costPerOzValue = inputRawMaterial.options[inputRawMaterial.selectedIndex].getAttribute('data-cost-per-oz');
    
    // Calculate the total cost
    let totalCostValue = parseFloat(costPerOzValue) * parseFloat(orderOzValue);

    // Put our data we want to send in a javascript object
    let data = {
        raw_material_id: rawMaterialIdValue,
        total_cost: totalCostValue,
        order_oz: orderOzValue,
        date_received: dateReceivedValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-purchase-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRawMaterial.value = '';
            inputOrderOz.value = '';
            inputDateReceived.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

// Creates a single row from an Object representing a single record from purchase_orders
function addRowToTable(data) {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("purchase_orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let materialNameCell = document.createElement("TD");
    let totalCostCell = document.createElement("TD");
    let orderOzCell = document.createElement("TD");
    let dateReceivedCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.purchase_id;
    materialNameCell.innerText = newRow.material_name;
    totalCostCell.innerText = newRow.total_cost;
    orderOzCell.innerText = newRow.order_oz;
    dateReceivedCell.innerText = newRow.date_received;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(materialNameCell);
    row.appendChild(totalCostCell);
    row.appendChild(orderOzCell);
    row.appendChild(dateReceivedCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
