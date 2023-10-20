$(document).on("submit", "#login", function (e) {
    e.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();

    if (email == "" || email == null) {
        msgError("Please enter email...", "#response")
        return false;
    } else if (password == "" || password == null) {
        msgError("Please enter password...", "#response")
        return false;
    } else {
        $.ajax({
            url: BASEURL("api/dashboard/login/"),
            type: "POST",
            cache: false,
            data: JSON.stringify({
                email: email,
                password: password
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
                if (data.login) {
                    msgSuccess(data["message"], "#response");
                    localStorage.setItem("user_id", data.token.user_id);
                    localStorage.setItem("access_token", data.token.access);
                    localStorage.setItem("refresh_token", data.token.refresh);

                    const params = new Proxy(new URLSearchParams(window.location.search), {
                        get: (searchParams, prop) => searchParams.get(prop),
                    });
                    if (params.next !== null) {
                        path = params.next
                    } else {
                        path = "/dashboard/"
                    }

                    setTimeout(function () {
                        window.open(path, '_self');
                    }, 1000);
                } else if (!data.login) {
                    msgError(data["message"], "#response");
                }
            },
            complete: function () {
                $("#btnsubmit").html(`<b>Login</b>`);
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
                } else if (data["password"]) {
                    msgError(data["password"][0]);
                } else if (data["message"]) {
                    msgError(data["message"]);
                } else {
                    msgError('Something went wrong!');
                }
            },
        });
    }
});