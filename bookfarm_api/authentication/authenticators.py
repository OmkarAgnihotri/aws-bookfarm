import jwt
import datetime

from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework import exceptions
from django.contrib.auth import get_user_model
from rest_framework.response import Response

User = get_user_model()

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        
        '''
            if no Authentication header present
            or invalid format
            
            required format > Authorization : Bearer token
        '''
        if not auth or auth[0].lower() != b'bearer' or len(auth) != 2:
            raise exceptions.AuthenticationFailed({
                'detail' : 'Authorization Header either not present or has invalid format.'
            })
        
        '''
        must return (user, auth) if authentication succeeds
        or  None otherwise
        '''
        return self.authenticate_credentials(auth[1])
    
    def authenticate_credentials(self, token):
        try:
            payload = jwt.decode(token, "SECRET_KEY", algorithms=["HS256"])
            user = User.objects.get(
                email = payload['email'],
                id = payload['id'],
                is_active = True
            )
            
            if not user.is_verified:
                return None
            
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed({'detail':'Invalid Token'})
        except User.DoesNotExist :
            return Response({'detail' : 'Some error occurred.'}, status=500)
        
        return (user, token)