
// Citation for the following file:  update_customer.js -> eventListener function for submit, ajax request
// Date: 5/22/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.getElementById('update-customer-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let customerId = document.getElementById('mySelect').value;
    let newName = document.getElementById('input-new-name').value;
    let phoneNumber = document.getElementById('update-phone_number').value;
    let email = document.getElementById('update-email').value;

    /* data object, stores values to be used in ajax request */
    let data = {
        customer_id: customerId,
    };

    // Add properties to the data object only if the corresponding input field is not empty
    if (newName) {
        data.name = newName;
    }
    if (phoneNumber) {
        data.phone_number = phoneNumber;
    }
    if (email) {
        data.email = email;
    }


    /* async. request, */
    $.ajax({
        url: '/update-customer-ajax',
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
