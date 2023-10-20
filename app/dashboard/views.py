from django.shortcuts import render, HttpResponseRedirect
from app.decorators import logout_required, logout, login_required, role_required
from app.helpers import *


@logout_required(logout_url='/dashboard/home/')
def Index(request):
    return render(request, "dashboard/pages/index.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def Home(request):
    return render(request, "dashboard/pages/home.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def UserAdmins(request):
    return render(request, "dashboard/pages/user-admins.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def UserStaff(request):
    return render(request, "dashboard/pages/user-staff.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def UserAgents(request):
    return render(request, "dashboard/pages/user-agents.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def Blogs(request):
    return render(request, "dashboard/pages/blogs.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def BlogCategories(request):
    return render(request, "dashboard/pages/blog-categories.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def Queries(request):
    return render(request, "dashboard/pages/queries.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def Faqs(request):
    return render(request, "dashboard/pages/faqs.html")


@role_required(redirect_url="/dashboard/forbidden/", login_url="/dashboard/", is_superuser=True)
def Listing(request):
    return render(request, "dashboard/pages/listing.html")


@login_required(login_url='/dashboard/')
def Profile(request):
    return render(request, "dashboard/pages/profile.html")


@logout_required(logout_url="/dashboard/")
def Login(request):
    return render(request, "dashboard/pages/logout/login.html")


@logout_required(logout_url="/dashboard/")
def ForgotPassword(request):
    return render(request, "dashboard/pages/password-forgot.html")


@logout_required(logout_url="/dashboard/")
def RecoverPassword(request, uid, token):
    data = {"token": token, "uid": uid}
    return render(request, "dashboard/pages/password-recover.html", data)


def Signout(request):
    logout(request)
    return HttpResponseRedirect('/dashboard/')


def forbidden(request):
    return render(request, "dashboard/pages/403.html")


def notfound(request):
    return render(request, "dashboard/pages/404.html")
