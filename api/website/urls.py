from django.urls import path, include
from api.website.views import *
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register("query", QueryApi, basename="WAQuery")
router.register("blog", BlogApi, basename="WABlog")
router.register("blog-category", BlogApi, basename="WABlogCategory")
router.register("agent", AgentApi, basename="WAAgent")
router.register("listing", ListingApi, basename="WAListing")



urlpatterns = [
    path('', include(router.urls), name="WA"),
    path('login/', LoginApi.as_view(), name='WALogin'),
    path('register/', RegistrationApi.as_view(), name='WARegister'),
    path('change-password/', ChangePasswordApi.as_view(), name='WAChangePassword'),
    path('forgot-email/', PasswordResetEmailApi.as_view(), name='WAForgotEmail'),
    path('reset-password/<uid>/<token>/',
         PasswordResetApi.as_view(), name='WAResetPassword'),
]
