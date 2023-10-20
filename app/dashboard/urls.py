from django.urls import path
from app.dashboard.views import *

urlpatterns = [
    path('', Index, name="DIndex"),
    path('home/', Home, name="DHome"),
    path('user-admins/', UserAdmins, name="DUAdmins"),
    path('user-staff/', UserStaff, name="DUStaff"),
    path('user-agents/', UserAgents, name="DUAgents"),
    path('blogs/', Blogs, name="DBlogs"),
    path('blog-categories/', BlogCategories, name="DBCategories"),
    path('listing/', Listing, name="DListing"),
    path('queries/', Queries, name="DQueries"),
    path('faqs/', Faqs, name="DFaqs"),
    path('profile/', Profile, name="DProfile"),
    path('login/', Login, name="DashboardLogin"),
    path('logout/', Signout, name="DashboardLogout"),
    path('password-forgot/', ForgotPassword, name="DashboardForgot"),
    path('password-recover/<uid>/<token>/',
         RecoverPassword, name="DashboardRecover"),
    path('forbidden/', forbidden, name="DashboardForbidden"),
]
