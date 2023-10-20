// Load data
const loadAgents = (page = 1, records = 8) => {
    let limit = records;
    let ordering = $("#ordering").val();

    $.ajax({
        url: BASEURL("api/website/agent/"),
        method: "GET",
        data: {
            page: page,
            records: limit,
            page: page,
            ordering: ordering,
        },
        cache: false,
        headers: {
            "Authorization": 'Bearer ' + access_token
        },
        beforeSend: function () {
            $('#agents').html(`<div class="t-center w-100 font-20"><b>Loading...</b></div>`);
        },
        success: function (data) {

            if (data.count == 0) {
                $('#agents').html(`<h2 class="t-center w-100 font-20"><b>No agents created yet!</b><br><br><br><br></h2>`);
            } else {

                $("#agentscount").html(`Showing ${page} to ${limit} of <span id="trecord">${data.count}</span> </b>`);
                let template = "";
                data.results.forEach(agent => {
                    template += `
                    <article class="agent-card">
                    <a href="/agent-details/${agent.username}/" class="avatar">
                        <img src="${placeholder(agent.avatar)}" alt="${agent.username}" class="image">
                    </a>
                    <h3 class="heading">
                        <a href="/agent-details/${agent.username}/">${agent.first_name} ${agent.last_name}</a>
                    </h3>
                    <p class="username">@${agent.username}</p>
                    <div class="social-panel">
                        <a class="item" href="${agent.facebook}"><span class="bx bxl-facebook-circle"></span></a>
                        <a class="item" href="${agent.twitter}"><span class="bx bxl-twitter"></span></a>
                        <a class="item" href="${agent.mail}"><span class="bx bxs-envelope"></span></a>
                    </div>
                </article>`;
                });
                $('#agents').html(template);
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
                redirect("/logout/");
            } else if (response.status == 403) {
                msgError("Forbidden user [403]");
                redirect("/logout/");
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
}
// Load data

// Sorting 
$(document).on("change", "#ordering", function (e) {
    e.preventDefault();
    loadAgents();
    $("#previous").val(1);
    $("#next").val(2);
});
// Sorting 

// Start
$(document).on("click", "#start", function () {
    loadAgents(1);
    $("#previous").val(1);
    $("#next").val(2);
});
// Start

// Previous
$(document).on("click", "#previous", function () {
    let id = parseInt($(this).val());
    loadAgents(id);
    $("#next").val(id + 1);
    $(this).val(id - 1);
    $("#last").prop("disabled", false);
    // Previous record
});
// Previous

// Next
$(document).on("click", "#next", function () {
    let id = parseInt($(this).val());
    loadAgents(id);
    $("#previous").val(id - 1);
    $(this).val(id + 1);
});
// Next

// End
$(document).on("click", "#last", function () {
    let limit = parseInt($("#limit").val());
    let total = parseInt($("#trecord").text());
    let last = Math.ceil(total / limit);
    loadAgents("last");
    $("#previous").val(last - 1);
    $("#last").prop("disabled", true);
});
// End
