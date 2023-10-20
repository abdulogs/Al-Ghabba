$(document).ready(function () {
    // Update Basic 
    $(document).on('submit', '#aboutdetails', function (e) {
        e.preventDefault();
        const formdata = new FormData(this);
        const first_name = $("#firstname").val();
        const last_name = $("#lastname").val();
        const username = $("#username").val();
        const email = $("#email").val();
        const facebook = $("#facebook").val();
        const twitter = $("#twitter").val();
        const mail = $("#mail").val();

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
                    $("#btnsubmit2").html(`Update`);
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
                    } else {
                        msgError('Something went wrong!');
                    }
                },
            });
        }

    });
    // Update Basic


    // Update password 
    $(document).on('submit', '#changepassword', function (e) {
        e.preventDefault();
        let formdata = new FormData(this);
        const password = $("#password").val();
        const password2 = $("#password2").val();

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
                    $("#btnsubmit3").html(`<div class="spinner-border  spinner-border-sm text-light"></div>`);
                    $("#btnsubmit3").attr("disabled", true);
                },
                success: function (response) {
                    if (response) {
                        msgSuccess("Password changed successfully");
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    }
                },
                complete: function () {
                    $("#btnsubmit3").html(`Submit`);
                    $("#btnsubmit3").attr("disabled", false);
                },
                error: function (response, exception) {
                    var msg = '';
                    const data = response.responseJSON
                    if (response.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (response.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (response.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (response.status == 401) {
                        msgSuccess("Your session timesout");
                        setTimeout(function () { window.open("/", '_self') }, 1000);
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else if (data["password"]) {
                        msg = data["password"][0];
                    } else if (data["password2"]) {
                        msg = data["password2"][0];
                    }
                    msgError(msg, '#response');
                },
            });
        }

    });
    // Update password 


    // Update avatar 
    $(document).on('submit', '#changeavatar', function (e) {
        e.preventDefault();
        let formdata = new FormData(this);
        const image = $("#image")[0].files[0];
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
                $("#btnsubmit1").html(`<div class="spinner-border  spinner-border-sm text-light"></div>`);
                $("#btnsubmit1").attr("disabled", true);
            },
            success: function (response) {
                if (response) {
                    msgSuccess("Avatar updated successfully");
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            },
            complete: function () {
                $("#btnsubmit1").html(`Submit`);
                $("#btnsubmit1").attr("disabled", false);
            },
            error: function (response, exception) {
                var msg = '';
                const data = response.responseJSON
                if (response.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (response.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (response.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (response.status == 401) {
                    msgSuccess("Your session timesout");
                    setTimeout(function () { window.open("/", '_self') }, 1000);
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else if (data["avatar"]) {
                    msg = data["avatar"][0];
                }
                msgError(msg, '#response');
            },
        });

    });
    // Update avatar 


    $(document).on('change', '#image', function (e) {
        e.preventDefault();
        $("#uploadbtn").html(`<button type="submit" class="btn btn-sm btn-success rounded ml-2" id="btnsubmit1">Change</button>`)
    })
});