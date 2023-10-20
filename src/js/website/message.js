function msgError(value = "", where = "") {
  let path = "";
  let message = `
  <div class="alert" role="alert">
      <span class="alert-icon bg-error bx bx-x"></span>
      <div class="alert-body">
        <h2 class="alert-heading">Oops!</h2>
        <p class="alert-subheading">${value}</p>
      </div>
      <button class="bx bx-x alert-close" onclick="parentNode.parentNode.parentNode.removeChild(parentNode.parentNode);"
        type="button" data-dismiss="alert">
      </button>
    </div>`;
  if (where == "") {
    path = "#response";
  } else {
    path = where;
  }
  $(path).html(message);
}

function msgSuccess(value = "", where = "") {
  let path = "";
  let message = `
    <div class="alert" role="alert">
      <span class="bx bx-check alert-icon bg-success"></span>
      <div class="alert-body">
        <h2 class="alert-heading">Congratulation!</h2>
        <p class="alert-subheading">${value}</p>
      </div>
      <button class="bx bx-x alert-close" type="button" onclick="parentNode.parentNode.removeChild(parentNode);"
      data-dismiss="alert"></button>
    </div>`;
  if (where == "") {
    path = "#response";
  } else {
    path = where;
  }
  $(".success-alert").fadeOut(10000)
  $(path).html(message);
}

function reload() {
  setTimeout(function () {
    location.reload();
  }, 1000);
}
function redirect(location) {
  window.open(location, "_SELF");
}
