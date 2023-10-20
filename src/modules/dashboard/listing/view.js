// Details
$(document).on('click', '.viewBtn', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    $.ajax({
        url: BASEURL("api/dashboard/listing/" + id),
        type: 'GET',
        headers: { "Authorization": 'Bearer ' + access_token },
        beforeSend: function () { },
        success: function (item) {
            let template = "";
            template += `<table class="table table-sm  table-borderless">`;
            template += `<tr class="rounded"><td><b>ID</b></td><td>${item.id}</td></tr>`;
            template += `<tr class="rounded"><td><b>Image</b></td><td>${image(item.image)}`;
            template += `<tr class="rounded"><td><b>Name</b></td><td>${title(item.name)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Description</b></td><td>${title(item.description)}</td></tr>`;
            template += `<tr class="rounded"><td><b>Address</b></td><td>${item.address}</td></tr>`;
            template += `<tr class="rounded"><td><b>Square ft</b></td><td>${item.square_feet}</td></tr>`;
            template += `<tr class="rounded"><td><b>Purpose</b></td><td>${item.purpose}</td></tr>`;
            template += `<tr class="rounded"><td><b>Bedrooms</b></td><td>${item.bathroom}</td></tr>`;
            template += `<tr class="rounded"><td><b>Bathrooms</b></td><td>${item.bedroom}</td></tr>`;
            template += `<tr class="rounded"><td><b>Price</b></td><td>${item.price}</td></tr>`;
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