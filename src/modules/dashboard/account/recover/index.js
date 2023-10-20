$(document).on("submit", "#recover", function (e) {
    e.preventDefault();
    const password = $("#password").val();
    const password2 = $("#password2").val();
    const uid = $("#uid").val();
    const tok = $("#tok").val();

    if (password == "") {
        msgError("Please enter new password...")
        return false;
    } else if (password2 == "") {
        msgError("Please enter confirm password...")
        return false;
    } if (password !== password2) {
        msgError("Password not matched...")
        return false;
    } else {
        $.ajax({
            url: BASEURL(`api/dashboard/reset-password/${uid}/${tok}/`),
            type: "POST",
            cache: false,
            data: JSON.stringify({
                password: password,
                password2: password2,
                tok: tok,
                uid: uid
            }),
            headers: {
                'X-CSRFToken': token,
            },
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                $("#btnsubmit").html(`<div class="spinner-border spinner-border-sm text-light"></div>`);
            },
            success: function (data) {
                if (data.message) {
                    msgSuccess(data["message"]);
                    setTimeout(function () { window.open("/dashboard/", '_self'); }, 1000);
                }
            },
            complete: function () {
                $("#btnsubmit").html(`<b>Proceed</b>`);
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
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            },
        });
    }
});