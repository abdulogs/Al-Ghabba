const BASEURL = (name) => {
    return `${window.location.origin}/${name}`;
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    window.open("/dashboard/", '_self');
}

function sidebar(id) {
    new bootstrap.Offcanvas($("#" + id)).show();
}

const token = $("#token").val();
const access_token = localStorage.getItem('access_token')
const user_id = localStorage.getItem('user_id')

function placeholder(name) {
    if (BASEURL("media/placeholder.png") == name) {
        return BASEURL("src/images/placeholders/placeholder.png");
    } else if (BASEURL("media/avatar.png") == name) {
        return BASEURL("src/images/placeholders/avatar.png");
    } else {
        return name
    }
}

function image(name) {
    return ` <a href="${placeholder(name)}" class="lightbox text-decoration-none">
                <img src="${placeholder(name)}" width="25" height="25" class="rounded"/>
            </a>`;
}

function title(text, val = 20) {
    if (text.length >= val) {
        return text.substring(0, val).concat('...');
    } else {
        return text;
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
            return name.first_name + " " + " " + name.last_name;
        }
    } else {
        return "N/A";
    }
}

function createdby(value) {
    if (value) {
        if (value.first_name == null && value.last_name == null) {
            return "N/A";
        } else {
            return `<img src="${placeholder(value.avatar)}" title="${value.first_name} ${value.last_name}" width="20" height="20" class="rounded-circle" alt="${value.username}">
                    <span class="d-inline-block ms-1" title="${value.first_name} ${value.last_name}">${value.username}</span>`;
        }
    } else {
        return "N/A";
    }
}

function active(value) {
    if (value == 1) {
        return "<span class='badge bg-success'>Active</span>";
    } else {
        return "<span class='badge bg-danger'>Inactive</span>";
    }
}

function exists(key, subkey) {
    if (key) {
        return key[subkey]
    } else {
        return "";
    }
}

function selected(val = null) {
    if (val != null) {
        if (val == 1) {
            return `<option value="1" selected>Yes</option>
            <option value="0">No</option>`;
        } else if (val == 0) {
            return `<option value="1">Yes</option>
            <option value="0" selected>No</option>`;
        }
    } else {
        return `<option value="1">Yes</option><option value="0">No</option>`;
    }
}

function available(check, val) {
    if (check) {
        return check[val];
    } else {
        return `<span class='badge badge-danger'>N/A</span>`;
    }
}

function selectMultiple(id) {
    let values = ''
    $(`#${id} :selected`).each(function (i, value) {
        values += $(value).val() + ", ";
    });
    values = values.replace(/,\s*$/, "");
    return values;
}

function file(id) {
    return $(id)[0].files[0];
}

function value(id) {
    return $(id).val();
}

function html(id) {
    return $(id).html();
}

function checked(id) {
    return ($(id).val() == 0) ? false : true;
}

function isChecked(id, value) {
    if (value) {
        document.getElementById(id).checked = true;
    } else {
        document.getElementById(id).checked = false;
    }
}

function setStatus(val, con1, con2) {
    if (val) {
        return `<span class="badge bg-success">${con1}</span>`;
    } else {
        return `<span class="badge bg-dark">${con2}</span>`;
    }
}


$(document).on("click", ".opensidenav", (e) => {
    e.preventDefault();
    $("#sidebar").show();
});


$(document).on("click", ".closesidenav", (e) => {
    e.preventDefault();
    $("#sidebar").hide();
});
