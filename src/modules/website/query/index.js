$(document).ready(function () {

    // Create data 
    $(document).on('submit', '#contactform', function (e) {
        e.preventDefault();
        const formdata = new FormData(this);
        const fullname = $("#fullname").val();
        const email = $("#email").val();
        const phone = $("#phone").val();
        const query = $("#message").val();
        if (fullname == "") {
            msgError("Fullname is required");
        } else if (email == "") {
            msgError("Email is required");
        } else if (query == "") {
            msgError("Message is required");
        } else {
            formdata.append('fullname', fullname);
            formdata.append('email', email);
            formdata.append('phone', phone);
            formdata.append('message', query);
            formdata.append('is_active', false);

            $.ajax({
                url: BASEURL("api/website/query/"),
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
                    $("#btnsubmit").html(`Laoding...`);
                    $("#btnsubmit").attr("disabled", true);
                },
                success: function (response) {
                    if (response) {
                        msgSuccess("Message sent successfully");
                        reload();
                    }
                },
                complete: function () {
                    $("#btnsubmit").html(`SEND MESSAGE`);
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
                        redirect("/logout/");
                    } else if (response.status == 403) {
                        msgError("Forbidden user [403]");
                        redirect("/");
                    } else if (exception === 'parsererror') {
                        msgError('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        msgError('Time out error.');
                    } else if (exception === 'abort') {
                        msgError('Ajax request aborted.');
                    } else if (data["fullname"]) {
                        msgError(data["fullname"][0]);
                    } else if (data["email"]) {
                        msgError(data["email"][0]);
                    } else if (data["phone"]) {
                        msgError(data["phone"][0]);
                    } else if (data["message"]) {
                        msgError(data["message"][0]);
                    } else {
                        msgError('Something went wrong!');
                    }
                },
            });
        }

    });
    // Create data
});