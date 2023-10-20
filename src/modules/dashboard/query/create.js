// Form 
$(document).on('click', '.createBtn', function (e) {
    e.preventDefault();
    $("#hiddenFields").html("")
    $("#modelTitle").html(`<span class="bx bx-plus-circle me-2 font-20"></span><b>CREATE</b>`);
    $(".modalForm").attr("id", "create");
    $(".modalForm").trigger("reset");
    $("#fullname").prop("readonly", false);
    $("#email").prop("readonly", false);
    $("#phone").prop("readonly", false);
    $("#query").prop("readonly", false);
    $("#reply").prop("readonly", false);

    $("#is_active").html(selected());
    sidebar("createupdateform");
});
// Form 

// Create
$(document).on('submit', '#create', function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    const fullname = value("#fullname");
    const email = value("#email");
    const phone = value("#phone");
    const query = value("#query");
    const reply = value('#reply');
    const is_active = checked("#is_active");

    if (fullname == "") {
        msgError("Question is required");
    } else if (email == "") {
        msgError("Email is required");
    } else if (phone == "") {
        msgError("Phone is required");
    } else if (query == "") {
        msgError("Query is required");
    } else if (reply == "") {
        msgError("Reply is required");
    } else {
        
        formdata.append('fullname', fullname);
        formdata.append('email', email);
        formdata.append('phone', phone);
        formdata.append('message', query);
        formdata.append('reply', reply);
        formdata.append('is_active', is_active);

        $.ajax({
            url: BASEURL("api/dashboard/query/"),
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
                $("#btnsubmit").html(`<div class="spinner-border spinner-border-sm text-light"></div>`);
                $("#btnsubmit").attr("disabled", true);
            },
            success: function (response) {
                if (response) {
                    msgSuccess("I record created successfully");
                    reload();
                }
            },
            complete: function () {
                $("#btnsubmit").html(`Proceed`);
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
                } else if (data["question"]) {
                    msgError("Question: " + data["question"][0]);
                } else if (data["answer"]) {
                    msgError("Answer: " + data["answer"][0]);
                } else if (data["non_field_errors"]) {
                    msgError(data["non_field_errors"][0]);
                } else {
                    msgError('Something went wrong!');
                }
            }
        });
    }

});
// Create