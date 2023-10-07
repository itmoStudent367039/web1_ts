import Swal from "sweetalert2";

export async function alertError(text: string) {
  await Swal.fire({
    icon: "error",
    title: "Oops...",
    text: text,
  });
}

export async function alertAttention(text: string) {
  await Swal.fire({
    icon: "warning",
    title: text,
  });
}

export async function alertSuccess(text: string) {
  await Swal.fire({
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: 1500,
  });
}
