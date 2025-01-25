import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache  # For rate limiting
from .models import User, OTP
from .utils import generate_otp, send_otp_via_sms
import random
from datetime import datetime, timedelta

# Set up logging
logger = logging.getLogger(__name__)


@csrf_exempt
def request_otp(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            phone_number = data.get("phone_number")

            # Validate required fields
            if not phone_number:
                return JsonResponse({"error": "Phone number is required."}, status=400)

            # Generate OTP
            otp_code = f"{random.randint(100000, 999999)}"
            expiry_time = datetime.now() + timedelta(minutes=5)

            # Save the OTP to the database
            OTP.objects.update_or_create(
                phone_number=phone_number,  # Use phone_number as the identifier
                defaults={
                    "code": otp_code,
                    "expires_at": expiry_time,
                },
            )

            # Send OTP via SMS
            send_otp_via_sms(phone_number, otp_code)

            return JsonResponse({"message": "OTP sent successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            logger.error(f"Error processing OTP request: {e}", exc_info=True)
            return JsonResponse({"error": "An error occurred. Please try again later."}, status=500)

    # Handle invalid request methods
    return JsonResponse({"error": "Invalid request method."}, status=405)




@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            phone_number = data.get("phone_number")
            otp_code = data.get("otp")

            # Validate required fields
            if not phone_number or not otp_code:
                return JsonResponse({"error": "Phone number and OTP code are required."}, status=400)

            # Fetch the OTP record
            try:
                otp = OTP.objects.get(phone_number=phone_number)
            except OTP.DoesNotExist:
                return JsonResponse({"error": "OTP not found."}, status=404)

            # Verify the OTP
            if otp.code == otp_code and otp.is_valid():
                return JsonResponse({"message": "OTP verified successfully."}, status=200)
            else:
                return JsonResponse({"error": "Invalid or expired OTP."}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            logger.error(f"Error verifying OTP: {e}", exc_info=True)
            return JsonResponse({"error": "An error occurred. Please try again later."}, status=500)

    # Handle invalid request methods
    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def set_user_details(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            phone_number = data.get("phone_number")
            first_name = data.get("first_name")
            last_name = data.get("last_name")

            # Validate required fields
            if not phone_number or not first_name or not last_name:
                return JsonResponse({"error": "Phone number, first name, and last name are required."}, status=400)

            # Create or update the user
            user, created = User.objects.get_or_create(
                phone_number=phone_number,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "is_verified": True,  # Mark the user as verified
                },
            )

            # If the user already exists, update their details
            if not created:
                user.first_name = first_name
                user.last_name = last_name
                user.is_verified = True
                user.save()

            return JsonResponse({"message": "User details updated successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            logger.error(f"Error updating user details: {e}", exc_info=True)
            return JsonResponse({"error": "An error occurred. Please try again later."}, status=500)

    # Handle invalid request methods
    return JsonResponse({"error": "Invalid request method."}, status=405)