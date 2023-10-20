$(document).on("change", "#image", (e) => {
  let output = document.getElementById('avatar-show');
  output.src = URL.createObjectURL(e.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src) // free memory
  }
});