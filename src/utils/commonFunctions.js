import Swal from "sweetalert2";
// import SweetAlert from "sweetalert2-react";
import "sweetalert2/dist/sweetalert2.css";

export const MessageResults = (status, error) => {
  Swal.fire({
    type: status === 200 || status === 201 ? "success" : "error",
    title:
      status === 200 || status === 201
        ? "zz realizado!"
        : "Proceso Fallido," + (error ?? "intente mas tarde!"),
    showConfirmButton: false,
    timer: 2000,
  });
};
export const ShowAlertMessage = (textMessage, htmlBody, typeMessage) => {
  Swal.fire({
    type: typeMessage ?? "info",
    title: textMessage,
    html: htmlBody,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
   
  });
};

