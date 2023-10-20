$(document).on("submit", "#recover", function (e) {
    e.preventDefault();
    const password = $("#password").val();
    const password1 = $("#password1").val();
    const uid = $("#uid").val();
    const tok = $("#tok").val();

    if (password == "") {
        msgError("Please enter new password...")
        return false;
    } else if (password1 == "") {
        msgError("Please enter confirm password...")
        return false;
    } if (password !== password1) {
        msgError("Password not matched...")
        return false;
    } else {
        $.ajax({
            url: BASEURL(`api/website/reset-password/${uid}/${tok}/`),
            type: "POST",
            cache: false,
            data: {
                password: password,
                password2: password1,
                token: tok,
                uid: uid
            },
            headers: {
                'X-CSRFToken': token,
            },
            beforeSend: function () {
                $("#btnsubmit").html(`Loading...`);
            },
            success: function (data) {
                if (data.change) {
                    msgSuccess("Password changed successfully");
                    redirect("/login/");
                } else {
                    msgError('Something went wrong!');
                }
            },
            complete: function () {
                $("#btnsubmit").html(`Change`);
            },
            error: function (response, exception) {
                const data = response.responseJSON
                if (response.status === 0) {
                    msgError('Not connect.\n Verify Network.');
                } else if (response.status == 404) {
                    msgError('Requested page not found. [404]');
                } else if (response.status == 500) {
                    msgError('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    msgError('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    msgError('Time out error.');
                } else if (exception === 'abort') {
                    msgError('Ajax request aborted.');
                } else if (data["password"]) {
                    msgError(data["password"][0]);
                } else if (data["password2"]) {
                    msgError(data["password2"][0]);
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            },
        });
    }
});