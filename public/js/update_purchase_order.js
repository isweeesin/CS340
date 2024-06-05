// Citation for the following file: 
// Date: 5/30/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.getElementById('update-po-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let purchaseId = document.getElementById('mySelect').value;
    let newMaterialName = document.getElementById('input-new-name').value;
    let newQuantity = document.getElementById('update-quantity').value;
    let newDate = document.getElementById('update-date').value;

    /* data object, stores values to be used in ajax request */
    let data = {
        purchase_id: purchaseId,
        'input-new-name': newMaterialName,
        'update-quantity': newQuantity,
        'update-date': newDate
    };

    /* async. request, */
    $.ajax({
        url: '/update-po-ajax',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        /* sucess/error messages */
        success: function(result) {
            alert('Purchase Order updated successfully');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseText === 'Material name not found') {
                alert('Error: The material name you entered does not exist - it must match an existing ingredient!');
            } else {
                console.log('Error: ' + textStatus + ' ' + errorThrown);
            }
        }
    });
});