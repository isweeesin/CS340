/* send delete request using ajax link and input data(id) */
function deleteRawMaterial(rawMaterialId) {
    $.ajax({
      url: '/delete-raw-material-ajax',
      type: 'DELETE',
      data: { id: rawMaterialId },
      success: function() {
        $(`tr[data-value="${rawMaterialId}"]`).remove();
      },
      error: function(xhr, status, error) {
        console.error('Error deleting product:', error);
      }
    });
  }
