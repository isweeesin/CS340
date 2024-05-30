// Citation for the following function:  delete_product, deleteRow using ajax
// Date: 5//2024
// Adapted from:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856


/* send delete request using ajax link and input data(id) */
function deleteProduct(product_id) {
    let link = '/delete-product-ajax/';
    let data = {
        id: product_id
    };
    /* async delete */
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(product_id);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
}
/* remove corresponding row */
function deleteRow(product_id) {
    let table = document.getElementById("products-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == product_id) {
            table.deleteRow(i);
            break;
        }
    }
}
