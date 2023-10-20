from django.urls import path
from app.views import *

urlpatterns = [
    path('', Index, name="Home"),
    path('agents/', Agents, name="WAgents"),
    path('agent-details/<str:name>/', AgentDetails, name="WAgentDetails"),
    path('search/', Search, name="WSearch"),
    path('property-details/<str:name>/', PropertyDetails, name="WPDetails"),
    path('about-us/', AboutUs, name="WAboutUs"),
    path('contact-us/', ContactUs, name="WContactUs"),
    path('terms-and-conditions/', TermsAndConditions, name="WTerms"),
    path('privacy-policy/', PrivacyPolicy, name="WPrivacy"),
    path('faqs/', Faqs, name="WFaq"),
    path('blogs/', Blogs, name="WBlogs"),
    path('blogs/category/<str:name>/', Blogs, name="WBlogs"),
    path('blog-details/<str:name>/', BlogDetails, name="WBlog"),
    path('404/', Error404, name="Error404"),
    path('500/', Error500, name="Error500"),
    path('login/', Login, name="WLogin"),
    path('register/', Register, name="WRegister"),
    path('logout/', Signout, name="WLogout"),
    path('password-forgot/', ForgotPassword, name="WForgot"),
    path('password-recover/<uid>/<token>/', RecoverPassword, name="WRecover"),
]
