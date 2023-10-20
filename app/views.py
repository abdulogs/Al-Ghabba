from django.shortcuts import render, HttpResponseRedirect
from app.models import *
from app.helpers import *
from app.decorators import logout


def Index(request):
    return render(request, "website/pages/index.html")


def Login(request):
    return render(request, "website/pages/login.html")


def Register(request):
    return render(request, "website/pages/register.html")


def ForgotPassword(request):
    return render(request, "website/pages/password-forgot.html")


def RecoverPassword(request, uid, token):
    data = {"token": token, "uid": uid}
    return render(request, "website/pages/password-recover.html", data)


def Signout(request):
    logout(request)
    return HttpResponseRedirect('/login/')


def AboutUs(request):
    return render(request, "website/pages/about-us.html")


def ContactUs(request):
    return render(request, "website/pages/contact-us.html")


def TermsAndConditions(request):
    return render(request, "website/pages/terms-and-conditions.html")


def PrivacyPolicy(request):
    return render(request, "website/pages/privacy-policy.html")


def Faqs(request):
    faqs = Faq.objects.all()
    return render(request, "website/pages/faqs.html", {"faqs": faqs})


def Blogs(request, name=""):
    category = cleanseparator(name, "-")
    return render(request, "website/pages/blogs.html", {"category": category})


def BlogDetails(request, name):
    try:
        name = cleanseparator(name, "-")
        blog = Blog.objects.get(name=name)
        return render(request, "website/pages/blog-details.html", {"blog": blog})
    except:
        return render(request, "website/pages/404.html")


def Agents(request):
    return render(request, "website/pages/agents.html")


def AgentDetails(request, name):
    try:
        agent = User.objects.get(username=name)
        return render(request, "website/pages/agent-details.html", {"agent": agent})
    except:
        return render(request, "website/pages/404.html")


def Search(request):
    purpose = request.GET.get("purpose")
    bathroom = request.GET.get("bathroom")
    bedroom = request.GET.get("bedroom")
    data = {"purpose": purpose, "bathroom": bathroom, "bedroom": bedroom}
    return render(request, "website/pages/search.html", data)


def PropertyDetails(request, name):
    try:
        name = cleanseparator(name, "-")
        property = Listing.objects.get(name=name)
        return render(request, "website/pages/property-details.html", {"property": property})
    except:
        return render(request, "website/pages/404.html")


def Error404(request):
    return render(request, "website/pages/404.html")


def Error500(request):
    return render(request, "website/pages/500.html")


def handler404(request, *args, **argv):
    response = render(request, 'website/pages/404.html')
    response.status_code = 404
    return response


def handler500(request, *args, **argv):
    response = render(request, 'website/pages/500.html')
    response.status_code = 500
    return response
