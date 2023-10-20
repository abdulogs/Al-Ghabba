// Create form 
$(document).on('click', '.createBtn', function (e) {
    e.preventDefault();
    $("#hiddenFields").html("")
    $("#modelTitle").html(`<span class="bx bx-plus-circle me-2 font-20"></span><b>CREATE</b>`);
    $(".modalForm").attr("id", "create");
    $(".modalForm").trigger("reset");
    $("#is_active").html(selected());
    $(".password-field").removeClass("d-none")
    sidebar("createupdateform");
});
// Create form 

// Create
$(document).on('submit', '#create', function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const first_name = $("#firstname").val();
    const last_name = $("#lastname").val();
    const username = $("#username").val();
    const password = $("#password").val();
    const password2 = $("#password2").val();
    const email = $("#email").val();
    const is_active = checked("#is_active");

    if (first_name == "") {
        msgError("Firstname is required");
    } else if (last_name == "") {
        msgError("Lastname is required");
    } else if (username == "") {
        msgError("Username is required");
    } else if (email == "") {
        msgError("Email is required");
    } else if (password == "") {
        msgError("Password is required");
    } else if (password2 == "") {
        msgError("Confirm password is required");
    }  else {

        formdata.append('first_name', first_name);
        formdata.append('last_name', last_name);
        formdata.append('username', username);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('password2', password2);
        formdata.append('is_active', is_active);
        formdata.append('is_superuser', false);
        formdata.append('is_staff', true);

        $.ajax({
            url: BASEURL("api/dashboard/register/"),
            type: 'POST',
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            headers: {
                'X-CSRFToken': token,
                "Authorization": 'Bearer ' + access_token
            },
            beforeSend: function () {
                $("#btnsubmit").html(`<div class="spinner-border spinner-border-sm text-light"></div>`);
                $("#btnsubmit").attr("disabled", true);
            },
            success: function (response) {
                if (response) {
                    msgSuccess("I record created successfully");
                    reload();
                }
            },
            complete: function () {
                $("#btnsubmit").html(`Proceed`);
                $("#btnsubmit").attr("disabled", false);
            },
            error: function (response, exception) {
                const data = response.responseJSON
                if (response.status === 0) {
                    msgError('Not connect.\n Verify Network.');
                } else if (response.status == 404) {
                    msgError('Requested page not found. [404]');
                } else if (response.status == 500) {
                    msgError('Internal Server Error [500].');
                } else if (response.status == 401) {
                    msgError("Your session timesout");
                    redirect("/dashboard/logout/");
                } else if (response.status == 403) {
                    msgError("Forbidden user [403]");
                    redirect("/dashboard/logout/");
                } else if (exception === 'parsererror') {
                    msgError('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    msgError('Time out error.');
                } else if (exception === 'abort') {
                    msgError('Ajax request aborted.');
                } else if (data["first_name"]) {
                    msgError(data["first_name"][0]);
                } else if (data["last_name"]) {
                    msgError(data["last_name"][0]);
                } else if (data["username"]) {
                    msgError(data["username"][0]);
                } else if (data["email"]) {
                    msgError(data["email"][0]);
                } else if (data["is_active"]) {
                    msgError(data["is_active"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            }
        });
    }
});
// Create