document.getElementById('update-customer-form-ajax').addEventListener('submit', function(event) {
    event.preventDefault();

    let customerId = document.getElementById('mySelect').value;
    let newName = document.getElementById('input-new-name').value;
    let phoneNumber = document.getElementById('input-phone_number').value;
    let email = document.getElementById('input-email').value;

    let data = {
        customer_id: customerId,
        name: newName,
        phone_number: phoneNumber,
        email: email
    };

    $.ajax({
        url: '/update-customer-ajax',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            alert('Customer updated successfully');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });
});
