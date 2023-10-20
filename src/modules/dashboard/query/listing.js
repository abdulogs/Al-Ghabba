$(document).ready(function () {

    // Load data
    function loadData(page = 1) {
        let limit = parseInt($("#limit").val());
        let search = $("#search").val();
        let ordering = $("#ordering").val();
        let availability = $("#availability").val();
        const rows = 8;

        $.ajax({
            url: BASEURL("api/dashboard/query/"),
            method: "GET",
            data: {
                page: page,
                records: limit,
                page: page,
                search: search,
                ordering: ordering,
                is_active: availability
            },
            cache: false,
            headers: {
                "Authorization": 'Bearer ' + access_token
            },
            beforeSend: function () {
                $('#data').html(`<tr><td colspan="${rows}" class="text-center"><div class="spinner-border spinner-border-sm align-middle" role="status"></div><span class="ms-2">Loading...</span></td></tr>`);
            },
            success: function (data) {

                let template = "";

                if (data.count != 0) {
                    $("#total").html(`Showing ${page} to ${limit} of <span id="trecord">${data.count}</span> </b>`);
                    data.results.forEach(item => {
                        template += `
                        <tr>
                            <td class="align-middle px-4" data-label="ID">${item.id}</td>
                            <td class="align-middle text-break" data-label="Fullname">${item.fullname}</td>
                            <td class="align-middle text-break" data-label="Email">${item.email}</td>
                            <td class="align-middle text-break" data-label="Phone">${item.phone}</td>
                            <td class="align-middle text-break" data-label="Status">${setStatus(item.is_active, "Answered", "Unanswered")}</td>
                            <td class="align-middle text-break" data-label="Created at">${time(item.created_at)}</td>
                            <td class="align-middle text-break" data-label="Updated at">${time(item.updated_at)}</td>
                            <td class="align-middle px-4" data-label="Actions">
                                <div class="dropdown">
                                    <button class="btn btn-sm bx bx-dots-vertical-rounded shadow-none font-16" data-bs-toggle="dropdown"></button>
                                    <ul class="dropdown-menu shadow border-0">
                                        <li><a class="dropdown-item viewBtn" data-id="${item.id}" href="javascript:void(0)"> <span class="bx bx-show text-success align-middle"></span> View </a></li>
                                        <li><a class="dropdown-item updateBtn" data-id="${item.id}" href="javascript:void(0)"><span class="bx bx-edit text-success align-middle"></span> Edit </a></li>
                                        <li><a class="dropdown-item deleteBtn" data-id="${item.id}" href="javascript:void(0)"><span class="bx bx-trash text-danger align-middle"></span> Delete </a></li>
                                    </ul>
                                </div>
                            </td>
                        </ tr >`;
                    });
                    $('#data').html(template);
                }

                if (data.count == 0) {
                    $('#data').html(`<tr><td colspan="${rows}" class="text-center"><b>No records found!</b></td></tr>`);
                }

                if (page == 1) {
                    $("#start").prop("disabled", true);
                } else {
                    $("#start").prop("disabled", false);
                }

                if (data.next == null) {
                    $("#next").prop("disabled", true);
                    $("#last").prop("disabled", true);

                } else {
                    $("#next").prop("disabled", false);
                    $("#last").prop("disabled", false);
                }

                if (data.previous == null) {
                    $("#previous").prop("disabled", true);
                } else {
                    $("#previous").prop("disabled", false);
                }
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
    }
    loadData();
    // Load data

    // Set data sorting 
    $(document).on("change", ".ordering", function (e) {
        e.preventDefault();
        $("#ordering").val($(this).val());
    });
    // Set data sorting 

    // Set data limit 
    $(document).on("change", ".limit", function (e) {
        e.preventDefault();
        $("#limit").val($(this).val());
    });
    // Set data limit 

    // Set data active 
    $(document).on("change", ".availability", function (e) {
        e.preventDefault();
        $("#availability").val($(this).val());
    });
    // Set data active 


    // Set data active 
    $(document).on("click", ".reset-btn", function (e) {
        e.preventDefault();
        $("#limit").val(30);
        $("#search").val("");
        $("#ordering").val("-id");
        $("#availability").val("");
        $(".availability").prop("checked", false);
        $(".ordering").prop("checked", false);
        $(".limit").prop("checked", false);

        $(".availability").prop("checked", false);
        $("#sort1").prop("checked", true);
        $("#record30").prop("checked", true);

        loadData();
        $("#previous").val(1);
        $("#next").val(2);
    });
    // Set data active 


    // Filter data 
    $(document).on("submit", "#filter", function (e) {
        e.preventDefault();
        loadData();
        $("#previous").val(1);
        $("#next").val(2);
    });
    // Filter data 

    // Start of record
    $(document).on("click", "#start", function () {
        loadData(1);
        $("#previous").val(1);
        $("#next").val(2);
    });
    // Start of record

    // Previous record
    $(document).on("click", "#previous", function () {
        let id = parseInt($(this).val());
        loadData(id);
        $("#next").val(id + 1);
        $(this).val(id - 1);
        $("#last").prop("disabled", false);
        // Previous record
    });
    // Previous record

    // Next record
    $(document).on("click", "#next", function () {
        let id = parseInt($(this).val());
        loadData(id);
        $("#previous").val(id - 1);
        $(this).val(id + 1);
    });
    // Next record

    // End of record
    $(document).on("click", "#last", function () {
        var limit = parseInt($("#limit").val());
        var total = parseInt($("#trecord").text());
        var last = Math.ceil(total / limit);
        loadData("last");
        $("#previous").val(last - 1);
        $("#last").prop("disabled", true);
    });
    // End of record
});