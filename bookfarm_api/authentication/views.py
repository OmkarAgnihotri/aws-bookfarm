import jwt
import datetime
import uuid

from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .authenticators import TokenAuthentication
from .util import send_verification_email, send_password_reset_email

from .serializers import UserSignUpSerializer, UserLoginSerializer, EmailVerifySerializer, ForgotPasswordSerializer

User = get_user_model()

# No authentication required
class UserSignUpViewSet(ViewSet):
    def create(self, request):
        serializer = UserSignUpSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        user = User.objects.create_user(**serializer.validated_data)
        
        send_verification_email(user.email, user.verification_uuid)
        return Response()
        
# No authentication required
class EmailVerifyViewSet(ViewSet):
    def create(self, request):
        serializer = EmailVerifySerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        try :
            user = User.objects.get(verification_uuid = serializer.validated_data['token'])
            user.is_verified = True
            user.save()
            return Response({'detail' : 'Email Verification succesfull !'})
        except User.DoesNotExist :
            return Response({'detail' : 'Email verification failed !'}, status=403)
        
# No authentication required    
class UserLoginViewSet(ViewSet):
    def create(self, request):
        serializer = UserLoginSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        user = serializer.validated_data['user']
        
        payload = {
            'id' : user.id,
            'email' : user.email,
            'first_name' : user.first_name,
            'last_name' : user.last_name
        }
        
        token = jwt.encode(payload, "SECRET_KEY", algorithm="HS256")
        
        return Response({'token' : token})

# No authentication required
class ForgotPasswordViewSet(ViewSet):
    def create(self, request):
        serializer = ForgotPasswordSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        try:
            user = User.objects.get(email = serializer.validated_data['email'])
            if not user.is_active or not user.is_verified:
                return Response({'detail':'No active User with provided email!'}, status = 400)
            password = str(uuid.uuid4())
            user.set_password(password)
            user.save()
            
            send_password_reset_email(user.email, password)
            
        except User.DoesNotExist:
            pass
        
        return Response({'detail' : 'Instructions will be sent to the provided email, if a registered user with given email exists.'})
    

class DemoViewSet(ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        return Response()
    
    

    
    
