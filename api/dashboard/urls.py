from django.urls import path, include
from api.dashboard.views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()


router.register("blog", BlogApi, basename="DABlog")
router.register("blog-category", BlogCategoryApi, basename="DABlogCategory")
router.register("user", UserApi, basename="DAUser")
router.register("faq", FaqApi, basename="DAFaq")
router.register("query", QueryApi, basename="DAQuery")
router.register("subscriber", SubscriberApi, basename="DASubscriber")
router.register("newsletter", NewsletterApi, basename="DANewsletter")
router.register("query", QueryApi, basename="DAQuery")
router.register("blog", BlogApi, basename="DABlog")
router.register("blog-category", BlogApi, basename="DABlogCategory")
router.register("listing", ListingApi, basename="DAListing")


urlpatterns = [
    path('', include(router.urls), name="DA"),
    path('login/', LoginApi.as_view(), name='DALogin'),
    path('register/', RegistrationApi.as_view(), name='DARegister'),
    path('change-password/', ChangePasswordApi.as_view(), name='DAChangePassword'),
    path('forgot-email/', PasswordResetEmailApi.as_view(), name='DAsendResetEmail'),
    path('reset-password/<uid>/<token>/',
         PasswordResetApi.as_view(), name='DAResetPassword'),
]
