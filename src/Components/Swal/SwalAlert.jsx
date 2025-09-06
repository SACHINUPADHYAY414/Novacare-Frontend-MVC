import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * Custom SweetAlert wrapper using withReactContent
 */
const SwalAlert = ({
  title,
  text,
  icon = "info",
  customClass = "",
  showConfirmButton = true,
  confirmButtonText = "Ok",
  showCancelButton = false,
  cancelButtonText = "Cancel",
  timer,
  allowOutsideClick = false,
  allowEscapeKey = false,
  html,
  didOpen,
  didClose,
  preConfirm,
}) => {
  return MySwal.fire({
    title,
    text,
    icon,
    customClass,
    showConfirmButton,
    confirmButtonText,
    confirmButtonColor: "#f27474",
    showCancelButton,
    cancelButtonText,
    timer,
    allowOutsideClick,
    allowEscapeKey,
    html,
    didOpen,
    didClose,
    preConfirm,
  });
};

export default SwalAlert;
