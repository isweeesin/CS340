// Citation for the following file: 
// Date: 5/30/2024
// Based on:
// Starter code for 'Developing in Node.JS'.
// Source URL: https://canvas.oregonstate.edu/courses/1958399/pages/exploration-developing-in-node-dot-js?module_item_id=24181856

/* form submission -> execute and get vars based on inputs */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('update-recipe-form-ajax');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            let selectFlavor = document.getElementById('selectFlavor').value;
            let selectMaterial = document.getElementById('selectMaterial').value;
            let updateOz = document.getElementById('update-oz').value;

            let data = {
                selectFlavor: selectFlavor,
                selectMaterial: selectMaterial,
                'update-oz': updateOz
            };

            fetch('/update-recipe-ajax', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    alert('Recipe updated successfully');
                    location.reload();
                } else {
                    response.text().then(text => {
                        alert('Error updating recipe: ' + text);
                    });
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
        });
    } else {
        console.log('Form not found');
    }
});
