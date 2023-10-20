// Delete
$(document).on('click', '.deleteBtn', function (e) {
    if (confirm("Do you really want to delete this!")) {
        var id = $(this).data('id');
        $.ajax({
            url: BASEURL("api/dashboard/faq/" + id),
            type: 'DELETE',
            contentType: "application/json",
            dataType: 'json',
            headers: {
                'X-CSRFToken': token,
                "Authorization": 'Bearer ' + access_token
            },
            beforeSend: function () {

            },
            success: function () {
                msgSuccess("I record deleted successfully", "#response")
                reload();
            },
            complete: function () {

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
// Delete