// Open details modal
$(document).on('click', '.viewBtn', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    $.ajax({
        url: BASEURL("api/dashboard/user/" + id),
        type: 'GET',
        headers: { "Authorization": 'Bearer ' + access_token },
        beforeSend: function () { },
        success: function (item) {
            var template = "";
            template += `<table class="table table-sm  table-borderless">`;
            template += `<tr class="rounded"><td><b>ID</b></td><td>${item.id}</td></tr>`;
            template += `<tr class="rounded"><td><b>Firstname</b></td><td>${item.first_name}</td></tr>`;
            template += `<tr class="rounded"><td><b>Lastname</b></td><td>${item.last_name}</td></tr>`;
            template += `<tr class="rounded"><td><b>Username</b></td><td>${item.username}</td></tr>`;
            template += `<tr class="rounded"><td><b>Email</b></td><td>${item.email}</td></tr>`;
            template += `<tr class="rounded"><td><b>Facebook</b></td><td>${item.facebook}</td></tr>`;
            template += `<tr class="rounded"><td><b>Twitter</b></td><td>${item.twitter}</td></tr>`;
            template += `<tr class="rounded"><td><b>Contact email</b></td><td>${item.mail}</td></tr>`;
            template += `<tr class="rounded"><td><b>Avatar</b></td><td>${image(item.avatar)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Staff</b><td>${setStatus(item.is_staff, "Yes", "No")}</td></tr>`;
            template += `<tr class="rounded"><td><b>Superuser</b><td>${setStatus(item.is_superuser, "Yes", "No")}</td></tr>`;
            template += `<tr class="rounded"><td><b>Agent</b><td>${setStatus(item.is_agent, "Yes", "No")}</td></tr>`;
            template += `<tr class="rounded"><td><b>Active</b><td>${active(item.is_active)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Created at</b><td>${time(item.created_at)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Updated at</b><td>${time(item.created_at)}</td></tr>`;
            template += `</table>`;
            $("#details").html(template);
            sidebar("detailsnav");
        },
        complete: function () { },
        error: function (response, exception) {
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
        }
    });
});
// Open details modal