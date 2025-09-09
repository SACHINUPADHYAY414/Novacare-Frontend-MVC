import Swal from 'sweetalert2';

export const confirmDialog = async ({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes',
  cancelButtonText = 'Cancel',
  icon = 'warning',
  confirmButtonClass = 'custom-confirm-btn',
  cancelButtonClass = 'custom-cancel-btn',
  width = '450px'
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    width,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: false,
    customClass: {
      confirmButton: confirmButtonClass,
      cancelButton: cancelButtonClass,
    },
    buttonsStyling: false
  });

  return result.isConfirmed;
};
