// Load data
const loadListing = (page = 1, records = 8) => {
    let limit = records;
    let agent_id = $("#agent_id").val();
    let ordering = $("#ordering").val();
    let bedroom = $("#bedroom").val();
    let bathroom = $("#bathroom").val();
    let purpose = $("#purpose").val();
    let data = {
        page: page,
        records: limit,
        page: page,
        bedroom: bedroom,
        bathroom: bathroom,
        purpose: purpose,
        ordering: ordering,
    }

    if (agent_id != "") {
        data.created_by_id = agent_id
    }


    $.ajax({
        url: BASEURL("api/website/listing/"),
        method: "GET",
        data: data,
        cache: false,
        headers: {
            "Authorization": 'Bearer ' + access_token
        },
        beforeSend: function () {
            $('#listing').html(`<div class="t-center w-100 font-20"><b>Loading...</b></div>`);
        },
        success: function (data) {

            if (data.count == 0) {
                $('#listing').html(`<h2 class="t-center w-100 font-20"><b>No listing posted yet!</b><br><br><br><br></h2>`);
            } else {

                $("#listingcount").html(`Showing ${page} to ${limit} of <span id="trecord">${data.count}</span> </b>`);
                let template = "";
                data.results.forEach(property => {
                    template += `
                    <article class="property-card">
                    <a class="card-header" href="/property-details/${separator(property.name, '-')}/">
                        <span class="badge">${property.purpose}</span>
                        <img src="${property.image}" class="image" alt="${property.name}">
                    </a>
                    <div class="card-body">
                        <p class="price">${property.price}</p>
                        <h3 class="heading">
                            <a href="/property-details/${separator(property.name, '-')}/">${property.name}</a>
                        </h3>
                        <p class="description"><span class="icon bx bx-map"></span> ${property.address}</p>
                        <div class="property-details">
                            <span class="badge"><i class="icon bx bxs-bath blue"></i> ${property.bathroom}</span>
                            <span class="badge"><i class="icon bx bxs-bed orange "></i> ${property.bedroom}</span>
                            <span class="badge"><i class="icon bx bxs-ruler green"></i> ${property.square_feet} sqft</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="author-details">
                            <div class="avatar-image">
                                <img src="${placeholder(property.created_by.avatar)}" class="image" />
                            </div>
                            <a class="author-body" href="/agent-details/${property.created_by.id}/">
                                <h3 class="fullname">${property.created_by.first_name} ${property.created_by.last_name}</h3>
                                <p class="username">${property.created_by.username}</p>
                            </a>
                        </div>
                    </div>
                </article>

                    `;
                });
                $('#listing').html(template);
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
    loadListing();
    $("#previous").val(1);
    $("#next").val(2);
});
// Sorting 

// Start
$(document).on("click", "#start", function () {
    loadListing(1);
    $("#previous").val(1);
    $("#next").val(2);
});
// Start

// Previous
$(document).on("click", "#previous", function () {
    let id = parseInt($(this).val());
    loadListing(id);
    $("#next").val(id + 1);
    $(this).val(id - 1);
    $("#last").prop("disabled", false);
    // Previous record
});
// Previous

// Next
$(document).on("click", "#next", function () {
    let id = parseInt($(this).val());
    loadListing(id);
    $("#previous").val(id - 1);
    $(this).val(id + 1);
});
// Next

// End
$(document).on("click", "#last", function () {
    var limit = parseInt($("#limit").val());
    var total = parseInt($("#trecord").text());
    var last = Math.ceil(total / limit);
    loadListing("last");
    $("#previous").val(last - 1);
    $("#last").prop("disabled", true);
});
// End



// bedroom
$(document).on("change", "#bedroom", function (e) {
    e.preventDefault();
    loadListing();
    $("#previous").val(1);
    $("#next").val(2);
});
// bedroom


// bathroom
$(document).on("change", "#bathroom", function (e) {
    e.preventDefault();
    loadListing();
    $("#previous").val(1);
    $("#next").val(2);
});
// bathroom


// purpose
$(document).on("change", "#purpose", function (e) {
    e.preventDefault();
    loadListing();
    $("#previous").val(1);
    $("#next").val(2);
});
// purpose



// purpose
$(document).on("click", "#search-btn", function (e) {
    e.preventDefault();
    loadListing();
    $("#previous").val(1);
    $("#next").val(2);
});
// purpose
