// Configurations
$(document).on("submit", "#register", function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const firstname = $("#firstname").val();
    const lastname = $("#lastname").val();
    const username = $("#username").val();
    const email = $("#email").val();
    const password1 = $("#password1").val();
    const password2 = $("#password2").val();

    if (username == "") {
        msgError("Username is required");
    } else if (firstname == "") {
        msgError("Please enter firstname...")
        return false;
    } else if (lastname == "") {
        msgError("Please enter lastname...")
        return false;
    } else if (lastname == "") {
        msgError("Please enter lastname...")
        return false;
    } else if (email == "") {
        msgError("Please enter email...")
        return false;
    } else if (password1 == "") {
        msgError("Please enter password...")
        return false;
    } else if (password2 == "") {
        msgError("Please enter confirm password...")
        return false;
    } else if (password2 !== password2) {
        msgError("Both passwords not matched...")
        return false;
    } else {
        formdata.append('first_name', firstname);
        formdata.append('last_name', lastname);
        formdata.append('username', username);
        formdata.append('email', email);
        formdata.append('password', password1);
        formdata.append('password2', password2);

        $.ajax({
            url: BASEURL("api/website/register/"),
            type: "POST",
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            headers: {
                'X-CSRFToken': token,
            },
            beforeSend: function () {
                $("#btnsubmit").html(`Loading...`);
            },
            success: function (data) {
                if (data["register"]) {
                    msgSuccess("Account created successfully!");
                    redirect("/login/", 1000);
                } else if (!data["register"]) {
                    msgError("Something went wrong");
                }
            },
            complete: function () {
                $("#btnsubmit").html(`Create account`);
            },
            error: function (response, exception) {
                const data = response.responseJSON;
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
                } else if (data["firstname"]) {
                    msgError(data["firstname"][0]);
                } else if (data["lastname"]) {
                    msgError(data["lastname"][0]);
                } else if (data["email"]) {
                    msgError(data["email"][0]);
                } else if (data["password"]) {
                    msgError(data["password"][0]);
                } else if (data["password2"]) {
                    msgError(data["password2"][0]);
                } else if (data["message"]) {
                    msgError(data["message"][0]);
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            },
        });
    }
});
