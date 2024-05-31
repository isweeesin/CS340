// Citation for the following function:  delete_customer, deleteRow using ajax
// Date: 5/30/2024
// Adapted from:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856


/* send delete request using ajax link and input data(id) */
function deleteCustomer(customer_id) {
    let link = '/delete-customer-ajax/';
    let data = {
        id: customer_id
    };
    /* async delete */
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(customer_id);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
}
/* remove corresponding row */
function deleteRow(customer_id) {
    let table = document.getElementById("customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == customer_id) {
            table.deleteRow(i);
            break;
        }
    }
}
