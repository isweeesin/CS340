
// Citation for the following function:  update_customer.js
// Date: 5/22/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.getElementById('update-product-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let productID = document.getElementById('mySelect').value;
    let newFlavor = document.getElementById('update-flavor').value;
    let newPricePerBottle = document.getElementById('update-price-per-bottle').value;

    /* data object, stores values to be used in ajax request */
    let data = {
        product_id: productID,
        flavor: newFlavor,
        price_per_bottle: newPricePerBottle
    };
    /* async. request, */
    $.ajax({
        url: '/update-product-ajax',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        /* sucess/error messages */
        success: function(result) {
            alert('Customer updated successfully');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
});
