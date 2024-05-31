/* send delete request using ajax link and input data(id) */
function deletePurchaseOrder(purchaseId) {
    $.ajax({
      url: '/delete-po-ajax',
      type: 'DELETE',
      data: { id: purchaseId },
      success: function() {
        $(`tr[data-value="${purchaseId}"]`).remove();
      },
      error: function(xhr, status, error) {
        console.error('Error deleting product:', error);
      }
    });
  }
