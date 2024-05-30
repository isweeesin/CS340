
// Citation for the following function:  update_raw_material.js
// Date: 5/22/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.getElementById('update-material-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let materialID = document.getElementById('mySelect').value;
    let newName = document.getElementById('update-material-name').value;
    let priceOz = document.getElementById('update-cost-per-oz').value;
    let quantityOz = document.getElementById('update-quantity-oz').value;

    /* data object, stores values to be used in ajax request */
    let data = {
        raw_material_id: materialID,
        material_name: newName,
        cost_per_oz: priceOz,
        quantity_oz: quantityOz
    };
    /* async. request, */
    $.ajax({
        url: '/update-raw-material-ajax',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        /* sucess/error messages */
        success: function(result) {
            alert('Material updated successfully');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
});
