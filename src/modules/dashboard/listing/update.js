// Form 
$(document).on('click', '.updateBtn', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    $("#hiddenFields").html(`<input type="hidden" id="id">`)
    $("#modelTitle").html(`<span class="bx bx-edit me-2 font-20"></span><b>UPDATE</b>`)
    $(".modalForm").attr("id", "update");
    $.ajax({
        url: BASEURL("api/dashboard/listing/" + id),
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + access_token
        },
        beforeSend: function () { },
        success: function (item) {
            $("#id").val(id);
            $("#name").val(item.name);
            $(".note-editable").html(item.description);
            $(".note-placeholder").hide();
            $("#bedroom").val(item.bedroom);
            $("#bathroom").val(item.bathroom);
            $("#price").val(item.price);
            $("#address").val(item.address);
            $("#square_feet").val(item.square_feet);
            purpose(item.purpose);
            $("#is_active").html(selected(item.is_active));
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
    const name = value("#name");
    const description = html(".note-editable");
    const image = file("#image");
    const purpose = value("#purpose");
    const bedroom = value("#bedroom");
    const bathroom = value("#bathroom");
    const price = value("#price");
    const square_feet = value("#square_feet");
    const address = value("#address");
    const is_active = checked("#is_active");
    if (name == "") {
        msgError("Name is required");
    } else if (description == "") {
        msgError("Description is required");
    } else if (purpose == "") {
        msgError("Purpose is required");
    } else if (bedroom == "") {
        msgError("Bedroom is required");
    } else if (bathroom == "") {
        msgError("Bathroom is required");
    } else if (price == "") {
        msgError("Price is required");
    } else if (address == "") {
        msgError("Address is required");
    } else {
        
        formdata.append('name', name);
        formdata.append('description', description);
        formdata.append('purpose', purpose);
        formdata.append('bedroom', bedroom);
        formdata.append('bathroom', bathroom);
        formdata.append('price', price);
        formdata.append('address', address);
        formdata.append('square_feet', square_feet);
        formdata.append('is_active', is_active);

        if (image) {
            formdata.append('image', image);
        }
        $.ajax({
            url: BASEURL("api/dashboard/listing/" + id + "/"),
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
                    msgSuccess("I record updated successfully", "#response");
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