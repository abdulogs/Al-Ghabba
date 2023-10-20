$(document).on("submit", "#forgot", function (e) {
    e.preventDefault();
    const email = $("#email").val();
    if (email == "") {
        msgError("Please enter email...")
        return false;
    } else {
        $.ajax({
            url: BASEURL("api/dashboard/forgot-email/"),
            type: "POST",
            cache: false,
            data: { email: email },
            headers: {
                'X-CSRFToken': token,
            },
            beforeSend: function () {
                $("#btnsubmit").html(`<div class="spinner-border spinner-border-sm text-light"></div>`);
            },
            success: function (data) {
                if (data.message) {
                    msgSuccess(data["message"]);
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
                } else if (data["email"]) {
                    msgError(data["email"][0]);
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            },
        });
    }
});