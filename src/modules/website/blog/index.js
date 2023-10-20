// Load data
const loadBlogs = (page = 1, records = 8) => {
    let limit = records;
    let category = $("#blogcategory").val();
    let ordering = $("#ordering").val();

    $.ajax({
        url: BASEURL("api/website/blog/"),
        method: "GET",
        data: {
            page: page,
            records: limit,
            page: page,
            ordering: ordering,
            "category__name": category,
        },
        cache: false,
        headers: {
            "Authorization": 'Bearer ' + access_token
        },
        beforeSend: function () {
            $('#blogs').html(`<div class="t-center w-100 font-20"><b>Loading...</b></div>`);
        },
        success: function (data) {
            if (data.count == 0) {
                $('#blogs').html(`<h2 class="t-center w-100 font-20"><b>No blogs posted yet!</b><br><br><br><br></h2>`);
            } else {

                $("#blogscount").html(`Showing ${page} to ${limit} of <span id="trecord">${data.count}</span> </b>`);
                let template = "";
                data.results.forEach(blog => {
                    template += `
                    <article class="blog-card">
                        <a class="blog-header" href="/blog-details/${separator(blog.name, '-')}/">
                            <img src="${placeholder(blog.image)}" class="image" alt="${blog.alt}">
                        </a>
                        <div class="blog-body">
                            <a class="category" href="/blogs/category/${available(blog.category, 'name')}">${available(blog.category, 'name')}</a>
                            <h3 class="heading"><a href="/blog-details/${separator(blog.name, '-')}">${shortname(blog.name, 40)}</a>
                            </h3>
                        </div>
                        <div class="blog-footer">
                            <div class="author-details">
                                <div class="avatar-image"><img src="${placeholder(blog.created_by.avatar)}" class="image" /></div>
                                <div class="author-body">
                                    <h3 class="fullname">${fullname(blog.created_by)}</h3>
                                    <p class="username">${time(blog.created_at)}</p>
                                </div>
                            </div>
                            <a href="/blog-details/${separator(blog.name, '-')}/" class="read-more">
                                Get details <span class="bx bx-right-arrow-alt icon"></span>
                            </a>
                        </div>
                    </article>`;
                });
                $('#blogs').html(template);
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
    loadBlogs();
    $("#previous").val(1);
    $("#next").val(2);
});
// Sorting 

// Start
$(document).on("click", "#start", function () {
    loadBlogs(1);
    $("#previous").val(1);
    $("#next").val(2);
});
// Start

// Previous
$(document).on("click", "#previous", function () {
    let id = parseInt($(this).val());
    loadBlogs(id);
    $("#next").val(id + 1);
    $(this).val(id - 1);
    $("#last").prop("disabled", false);
    // Previous record
});
// Previous

// Next
$(document).on("click", "#next", function () {
    let id = parseInt($(this).val());
    loadBlogs(id);
    $("#previous").val(id - 1);
    $(this).val(id + 1);
});
// Next

// End
$(document).on("click", "#last", function () {
    var limit = parseInt($("#limit").val());
    var total = parseInt($("#trecord").text());
    var last = Math.ceil(total / limit);
    loadBlogs("last");
    $("#previous").val(last - 1);
    $("#last").prop("disabled", true);
});
// End

// Category
$(document).on("change", "#category", function (e) {
    e.preventDefault();
    loadBlogs();
    $("#previous").val(1);
    $("#next").val(2);
});
// Category
