/* send delete request using ajax link and input data(id) */
function deleteProduct(productId) {
    $.ajax({
      url: '/delete-product-ajax',
      type: 'DELETE',
      data: { id: productId },
      success: function() {
        $(`tr[data-value="${productId}"]`).remove();
      },
      error: function(xhr, status, error) {
        console.error('Error deleting product:', error);
      }
    });
  }
