# backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin panel URL
    path('admin/', admin.site.urls),

    # Include your app's URLs with the "api/v1/" prefix
    path('api/v1/', include("api.urls")),
]