# api/urls.py
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    # OTP endpoints
    path("request-otp/", views.request_otp, name="request_otp"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("set-user-details/", views.set_user_details, name="set_user_details"),

    # Token authentication endpoint
    path("get-token/", obtain_auth_token, name="get_token"),
]