
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("navbar").style.boxShadow = " rgba(0, 0, 0, 0.04) 0px 3px 5px";
        document.getElementById("topnav").style.display = "none";
    } else {
        document.getElementById("navbar").style.boxShadow = "rgba(0, 0, 0, 0) 0px 0px 0px";
        document.getElementById("topnav").style.display = "block";
    }
}

$("#s-menu-list").html($("#menu-list").html());
$("#s-auth-list").html($("#auth-list").html());

function openNav() {
    document.getElementById("sm-sidebar").style.width = "100%";
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sm-sidebar").style.width = "0";
    document.getElementsByTagName("body")[0].style.overflow = "auto";

}