const token = $("#token").val();
const access_token = localStorage.getItem('access_token')
const user_id = localStorage.getItem('user_id')


function BASEURL(name) {
    return `${window.location.origin}/${name}`;
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    window.open("/", '_self');
}

function placeholder(name) {
    if (BASEURL("media/placeholder.png") == name) {
        return BASEURL("src/images/placeholders/placeholder.png");
    } else if (BASEURL("media/avatar.png") == name) {
        return BASEURL("src/images/placeholders/avatar.png");
    } else {
        return name
    }
}

function time(text) {
    return `<span title="${moment(text).format('MMMM Do YYYY, h:mm a')}">
                ${moment(text).format('MMMM Do YYYY')}
            </span>`;
}

function fullname(name) {
    if (name) {
        if (name.first_name == null && name.last_name == null) {
            return "N/A";
        } else {
            return name.first_name + " " + name.last_name;
        }
    } else {
        return "N/A";
    }
}

function available(check, val) {
    if (check) {
        return check[val];
    } else {
        return `<span class='badge badge-danger'>N/A</span>`;
    }
}

function shortname(text, val = 30) {
    if (text.length >= val) {
        return text.substring(0, val).concat('...');
    } else {
        return text;
    }
}

function separator(str, val) {
    return str.replace(/\s+/g, val);
}


// Go to top
$(document).on("click", "#last, #next, #previous, #start", function () {
    $("html, body").animate({ scrollTop: 0 }, 10);
});
