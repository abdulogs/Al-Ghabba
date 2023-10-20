// Details
$(document).on('click', '.viewBtn', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    $.ajax({
        url: BASEURL("api/dashboard/query/" + id),
        type: 'GET',
        headers: { "Authorization": 'Bearer ' + access_token },
        beforeSend: function () { },
        success: function (item) {
            var template = "";
            template += `<table class="table table-sm table-hover table-striped table-borderless">`;
            template += `<tr class="rounded"><td><b>ID</b></td><td>${item.id}</td></tr>`;
            template += `<tr class="rounded"><td><b>Fullname</b></td><td>${item.fullname}</td></tr>`;
            template += `<tr class="rounded"><td><b>Email</b></td><td>${item.email}</td></tr>`;
            template += `<tr class="rounded"><td><b>Phone</b></td><td>${item.phone}</td></tr>`;
            template += `<tr class="rounded"><td><b>Message</b></td><td>${item.message}</td></tr>`;
            template += `<tr class="rounded"><td><b>Reply</b></td><td>${item.reply}</td></tr>`;
            template += `<tr class="rounded"><td><b>Status</b><td>${setStatus(item.status, "Answered", "Unanswered")}</td></tr>`;
            template += `<tr class="rounded"><td><b>Created At</b><td>${moment(item.created_at).format('MMMM Do YYYY, h:mm a')}</td></tr>`;
            template += `<tr class="rounded"><td><b>Updated At</b><td>${moment(item.created_at).format('MMMM Do YYYY, h:mm a')}</td></tr>`;
            template += `</table>`;
            $("#details").html(template);
            sidebar("detailsnav");
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
// Details