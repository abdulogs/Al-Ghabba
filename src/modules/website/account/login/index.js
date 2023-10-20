$(document).on("submit", "#login", function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    const token = $("#token").val();

    if (email == "" || email == null) {
        msgError("Please enter email...")
        return false;
    } else if (password == "" || password == null) {
        msgError("Please enter password...")
        return false;
    } else {
        $.ajax({
            url: BASEURL("api/website/login/"),
            type: "POST",
            cache: false,
            data: {
                email: email,
                password: password
            },
            headers: {
                'X-CSRFToken': token,
            },
            beforeSend: function () {
                $("#btnsubmit").html(`Loading....`);
                $("#btnsubmit").prop('disabled', true);
            },
            success: function (data) {
                if (data["login"]) {
                    msgSuccess("Login successfully");
                    localStorage.setItem("user_id", data.token.user_id);
                    localStorage.setItem("access_token", data.token.access);
                    localStorage.setItem("refresh_token", data.token.refresh);

                    const params = new Proxy(new URLSearchParams(window.location.search), {
                        get: (searchParams, prop) => searchParams.get(prop),
                    });
                    if (params.next !== null) {
                        path = params.next
                    } else {
                        path = "/"
                    }
                    redirect(path);
                } else {
                    msgError("Invalid credentials");
                }
            },
            complete: function () {
                $("#btnsubmit").html('Login');
                $("#btnsubmit").prop('disabled', false);
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
                } else if (data["email"]) {
                    msgError(data["email"][0]);
                } else if (data["password"]) {
                    msgError(data["password"][0]);
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            },
        });
    }
});