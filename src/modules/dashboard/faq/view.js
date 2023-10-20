// Details
$(document).on('click', '.viewBtn', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    $.ajax({
        url: BASEURL("api/dashboard/faq/" + id),
        type: 'GET',
        headers: { "Authorization": 'Bearer ' + access_token },
        beforeSend: function () { },
        success: function (item) {
            var template = "";
            template += `<table class="table table-sm table-striped table-borderless">`;
            template += `<tr class="rounded"><td><b>ID</b></td><td>${item.id}</td></tr>`;
            template += `<tr class="rounded"><td><b>Question</b></td><td><b>${title(item.question)}?</b></td></tr>`;
            template += `<tr class="rounded"><td><b>Answer</b></td><td>${title(item.answer)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Status</b><td>${active(item.is_active)}</td></tr>`;
            template += `<tr class="rounded align-middle"><td><b>Created by</b><td>${createdby(item.created_by)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Created at</b><td>${time(item.created_at)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Updated at</b><td>${time(item.created_at)}</td></tr>`;
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