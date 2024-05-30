// Citation for the following function:  delete_raw_material, deleteRow using ajax
// Date: 5/22/2024
// Adapted from:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856


/* send delete request using ajax link and input data(id) */
function deleteRawMaterial(raw_material_id) {
    let link = '/delete-raw-material-ajax/';
    let data = {
        id: raw_material_id
    };
    /* async delete */
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(raw_material_id);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
}
/* remove corresponding row */
function deleteRow(raw_material_id) {
    let table = document.getElementById("raw-material-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == raw_material_id) {
            table.deleteRow(i);
            break;
        }
    }
}
