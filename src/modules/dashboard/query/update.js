// Form 
$(document).on('click', '.updateBtn', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    $("#hiddenFields").html(`<input type="hidden" id="id">`)
    $("#modelTitle").html(`<span class="bx bx-edit me-2 font-20"></span><b>UPDATE</b>`)
    $(".modalForm").attr("id", "update");
    $.ajax({
        url: BASEURL("api/dashboard/query/" + id),
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + access_token
        },
        beforeSend: function () {
            $("#fullname").prop("readonly", true);
            $("#email").prop("readonly", true);
            $("#phone").prop("readonly", true);
            $("#query").prop("readonly", true);
        },
        success: function (data) {
            $("#id").val(id);
            $("#fullname").val(data.fullname);
            $("#email").val(data.email);
            $("#phone").val(data.phone);
            $("#query").val(data.message);
            $('#reply').val(data.reply);
            $("#is_active").html(selected(data.is_active));
            sidebar("createupdateform");
        },
        complete: function () { },
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
// Form

// Update 
$(document).on('submit', '#update', function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const id = value("#id");
    const fullname = value("#fullname");
    const email = value("#email");
    const phone = value("#phone");
    const query = value("#query");
    const reply = value('#reply');
    const is_active = checked("#is_active");


    if (reply == "") {
        msgError("Reply is required");
    } else {
        formdata.append('fullname', fullname);
        formdata.append('email', email);
        formdata.append('phone', phone);
        formdata.append('message', query);
        formdata.append('reply', reply);
        formdata.append('is_active', is_active);
        $.ajax({
            url: BASEURL("api/dashboard/query/" + id + "/"),
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
                $("#btnsubmit").html(`<div class="spinner-border spinner-border-sm text-light"></div>`);
                $("#btnsubmit").attr("disabled", true);
            },
            success: function (response) {
                if (response) {
                    msgSuccess("I record updated successfully");
                    reload()
                }
            },
            complete: function () {
                $("#btnsubmit").html(`Submit`);
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
                } else if (data["reply"]) {
                    msgError("Reply: " + data["reply"][0]);
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            }
        });
    }
});
// Update