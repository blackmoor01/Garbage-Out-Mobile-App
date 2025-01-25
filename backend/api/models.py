# Import necessary Django modules
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils.timezone import now
from datetime import timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings

# Create your models here.
class CustomUserManager(BaseUserManager):
    # Method to create a regular user
    def create_user(self, phone_number, password=None, **extra_fields):
        # Check if phone_number is provided
        if not phone_number:
            raise ValueError("The Phone Number is required.")
        
        # Create a new user instance with the provided phone_number and extra fields
        user = self.model(phone_number=phone_number, **extra_fields)
        
        # Set the user's password (hashes the password)
        user.set_password(password)
        
        # Save the user to the database
        user.save(using=self._db)
        
        # Return the created user
        return user
    
    # Method to create a superuser (admin)
    def create_superuser(self, phone_number, password=None, **extra_fields):
        # Set default values for superuser fields
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        # Ensure the superuser has the required permissions
        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")
        
        # Use the create_user method to create the superuser
        return self.create_user(phone_number, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # Fields for the user model
    phone_number = models.CharField(max_length=15, unique=True)  # Unique phone number
    country = models.CharField(max_length=100)  # User's country
    first_name = models.CharField(max_length=50, blank=True, null=True)  # Optional first name
    last_name = models.CharField(max_length=50, blank=True, null=True)  # Optional last name
    is_active = models.BooleanField(default=True)  # Whether the user is active
    is_staff = models.BooleanField(default=False)  # Whether the user is a staff member
    is_verified = models.BooleanField(default=False)  # Whether the user is verified
    date_joined = models.DateTimeField(auto_now_add=True)  # Timestamp when the user joined

    # Add custom related_name to avoid clashes with auth.User
    groups = models.ManyToManyField(
        Group,
        verbose_name="groups",
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
        related_name="api_user_groups",  # Custom related_name
        related_query_name="api_user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="api_user_permissions",  # Custom related_name
        related_query_name="api_user",
    )

    # Use the custom user manager for this model
    objects = CustomUserManager()

    # Specify that the phone_number field is used as the username field
    USERNAME_FIELD = "phone_number"
    
    # No additional required fields for user creation
    REQUIRED_FIELDS = []

    # String representation of the user (used in Django admin and shell)
    def __str__(self):
        return self.phone_number


class OTP(models.Model):
    # Store the phone number directly
    phone_number = models.CharField(max_length=15, unique=True)
    
    # The OTP code (6 characters)
    code = models.CharField(max_length=6)
    
    # Timestamp when the OTP was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Timestamp when the OTP expires
    expires_at = models.DateTimeField()

    # Method to check if the OTP is still valid
    def is_valid(self):
        return now() < self.expires_at