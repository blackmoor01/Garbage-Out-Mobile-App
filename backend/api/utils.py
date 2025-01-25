import random
from datetime import timedelta
from django.utils.timezone import now
from django.core.cache import cache  # For rate limiting
import logging
from twilio.rest import Client  # For SMS integration (example using Twilio)
from decouple import config  # For loading environment variables
from .models import OTP  # Import your OTP model
from twilio.base.exceptions import TwilioRestException

# Set up logging
logger = logging.getLogger(__name__)

# Load Twilio credentials from .env
TWILIO_ACCOUNT_SID = config("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = config("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = config("TWILIO_PHONE_NUMBER")

# Initialize Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def generate_otp(user):
    """
    Generates a 6-digit OTP, sets its expiry time, and saves it to the database.
    """
    try:
        # Generate a random 6-digit OTP code
        code = f"{random.randint(100000, 999999)}"
        
        # Set the expiry time to 5 minutes from now
        expiry_time = now() + timedelta(minutes=5)

        # Update or create an OTP record for the user
        OTP.objects.update_or_create(
            user=user,  # Link the OTP to the user
            defaults={
                "code": code,  # Set the OTP code
                "expires_at": expiry_time,  # Set the expiry time
            },
        )

        logger.info(f"OTP generated for user {user.phone_number}: {code}")
        return code

    except Exception as e:
        logger.error(f"Error generating OTP for user {user.phone_number}: {e}")
        raise

def send_otp_via_sms(phone_number, otp_code):
    try:
        # Check rate limiting (allow max 3 OTP requests per phone number in 10 minutes)
        cache_key = f"otp_rate_limit_{phone_number}"
        request_count = cache.get(cache_key, 0)

        if request_count >= 3:
            logger.warning(f"Rate limit exceeded for phone number: {phone_number}")
            raise Exception("Too many OTP requests. Please try again later.")

        # Send OTP via Twilio
        message = twilio_client.messages.create(
            body=f"Your OTP is {otp_code}. It will expire in 5 minutes.",
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number,
        )

        # Log the SMS sending status
        logger.info(f"OTP sent to {phone_number}. Twilio message SID: {message.sid}")

        # Increment the rate limit counter
        cache.set(cache_key, request_count + 1, timeout=600)  # 10 minutes timeout

    except TwilioRestException as e:
        logger.error(f"Twilio error: {e}")
        raise Exception("Failed to send OTP. Please try again later.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise Exception("An error occurred. Please try again later.")
    


def verify_otp(user, submitted_code):
    """
    Verifies if the submitted OTP code is valid for the user.
    """
    try:
        # Fetch the OTP record for the user
        otp = OTP.objects.get(user=user)

        # Check if the OTP is valid and matches the submitted code
        if otp.is_valid() and otp.code == submitted_code:
            logger.info(f"OTP verified for user {user.phone_number}")
            return True
        else:
            logger.warning(f"Invalid OTP for user {user.phone_number}")
            return False

    except OTP.DoesNotExist:
        logger.warning(f"No OTP found for user {user.phone_number}")
        return False
    except Exception as e:
        logger.error(f"Error verifying OTP for user {user.phone_number}: {e}")
        raise