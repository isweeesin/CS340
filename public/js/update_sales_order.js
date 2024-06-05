// Citation for the following file: 
// Date: 5/30/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.getElementById('update-sale-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let saleId = document.getElementById('mySelect').value;
    let newFlavor = document.getElementById('input-new-flavor').value;
    let newName = document.getElementById('update-customer-name').value;
    let bottles = document.getElementById('update-bottles').value;
    let newDate = document.getElementById('update-date').value;


    let data = {
        sale_id: saleId,
        'input-new-flavor': newFlavor,
        'update-customer-name': newName,
        'update-bottles': bottles,
        'update-date': newDate
    };

    $.ajax({
        url: '/update-sale-ajax',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            alert('Sale Order updated successfully');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseText === 'Flavor or customer not found') {
                alert('Error: The Flavor name or Customer name you entered does not exist!');
            } else {
                console.log('Error: ' + textStatus + ' ' + errorThrown);
            }
        }
    });
});