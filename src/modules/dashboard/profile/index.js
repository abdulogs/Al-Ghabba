$(document).ready(function () {

    // Basic 
    $(document).on('submit', '#aboutdetails', function (e) {
        e.preventDefault();
        const formdata = new FormData(this);
        const first_name = value("#firstname");
        const last_name = value("#lastname");
        const username = value("#username");
        const facebook = value("#facebook");
        const twitter = value("#twitter");
        const mail = value("#mail");
        const email = value("#email");

        if (first_name == "") {
            msgError("Firstname is required");
        } else if (last_name == "") {
            msgError("Lastname is required");
        } else if (username == "") {
            msgError("Username is required");
        } else if (email == "") {
            msgError("Email is required");
        } else {
            formdata.append('first_name', first_name);
            formdata.append('last_name', last_name);
            formdata.append('username', username);
            formdata.append('email', email);
            formdata.append('mail', mail);
            formdata.append('twitter', twitter);
            formdata.append('facebook', facebook);
            $.ajax({
                url: BASEURL("api/dashboard/user/" + user_id + "/"),
                type: 'PATCH',
                data: formdata,
                contentType: false,
                processData: false,
                cache: false,
                headers: {
                    'X-CSRFToken': token,
                    "Authorization": 'Bearer ' + access_token
                },

                beforeSend: function () {
                    $("#btnsubmit2").html(`<div class="spinner-border  spinner-border-sm text-light"></div>`);
                    $("#btnsubmit2").attr("disabled", true);
                },
                success: function (response) {
                    if (response) {
                        msgSuccess("Profile updated successfully");
                        reload();
                    }
                },
                complete: function () {
                    $("#btnsubmit2").html(`<span class="bx bx-pencil me-2"></span> Update`);
                    $("#btnsubmit2").attr("disabled", false);
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
                }
            });
        }

    });
    // Basic

    // Avatar 
    $(document).on('submit', '#changeavatar', function (e) {
        e.preventDefault();
        const formdata = new FormData(this);
        const image = file("#image");
        formdata.append('avatar', image);
        $.ajax({
            url: BASEURL("api/dashboard/user/" + user_id + "/"),
            type: 'PATCH',
            data: formdata,
            contentType: false,
            processData: false,
            cache: false,
            headers: {
                'X-CSRFToken': token,
                "Authorization": 'Bearer ' + access_token
            },
            beforeSend: function () {
                $("#btnsubmit1").attr("disabled", true);
            },
            success: function (response) {
                if (response) {
                    msgSuccess("Avatar updated successfully");
                    reload();
                }
            },
            complete: function () {
                $("#btnsubmit1").attr("disabled", false);
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
            }
        });
    });


    $(document).on('change', '#image', function (e) {
        e.preventDefault();
        $("#uploadbtn").html(`<button type="submit" class="btn btn-light border ps-3 pe-3 ms-3 bx bx-check-circle font-20" id="btnsubmit1"></button>`)
    });
    // Avatar 


    // Password 
    $(document).on('submit', '#changepassword', function (e) {
        e.preventDefault();
        const formdata = new FormData(this);
        const password = value("#password");
        const password2 = value("#password2");

        if (password == "") {
            msgError("New password is required");
        } else if (password2 == "") {
            msgError("Confirm password is required");
        } else if (password2 !== password) {
            msgError("Passwords not matched");
        } else {
            formdata.append('password', password);
            formdata.append('password2', password2);
            formdata.append('userid', user_id);

            $.ajax({
                url: BASEURL("api/dashboard/change-password/"),
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
                    $("#btnsubmit3").html(`<div class="spinner-border  spinner-border-sm text-light"></div>`);
                    $("#btnsubmit3").attr("disabled", true);
                },
                success: function (response) {
                    if (response) {
                        msgSuccess("Password changed successfully");
                        reload();
                    }
                },
                complete: function () {
                    $("#btnsubmit3").html(`<span class="bx bx-lock me-2"></span> Change`);
                    $("#btnsubmit3").attr("disabled", false);
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
                }
            });
        }
    });
    // Password 
});