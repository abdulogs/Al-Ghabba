from django.urls import path, include

urlpatterns = [
    path('dashboard/', include('api.dashboard.urls')),
    path('website/', include('api.website.urls')),
]
