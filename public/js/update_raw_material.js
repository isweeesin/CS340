// Citation for the following file: update raw material
// Date: 5/30/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.getElementById('update-raw-material-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let rawMaterialId = document.getElementById('mySelect').value;
    let newMaterialName = document.getElementById('input-new-name').value;
    let newMaterialPrice = document.getElementById('update-cost').value;
    let newQuantity = document.getElementById('update-quantity').value;
   

    /* data object, stores values to be used in ajax request */
    let data = {
        raw_material_id: rawMaterialId,
        material_name: newMaterialName,
        cost_per_oz: newMaterialPrice,
        quantity_oz: newQuantity
    };
    /* async. request, */
    $.ajax({
        url: '/update-raw-material-ajax',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        /* sucess/error messages */
        success: function(result) {
            alert('Ingredient updated successfully');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
});
