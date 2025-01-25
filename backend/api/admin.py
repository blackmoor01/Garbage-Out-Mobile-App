# api/admin.py (replace 'api' with your app name)
from django.contrib import admin
from .models import User, OTP  # Import your models

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("phone_number", "country", "is_verified", "date_joined")  # Fields to display in the admin list view
    search_fields = ("phone_number", "country")  # Fields to search by
    list_filter = ("is_verified", "date_joined")  # Filters for the list view


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ("phone_number", "code", "created_at", "expires_at")  # Use phone_number instead of user
    search_fields = ("phone_number", "code")  # Add search functionality
    list_filter = ("created_at", "expires_at")  # Add filters