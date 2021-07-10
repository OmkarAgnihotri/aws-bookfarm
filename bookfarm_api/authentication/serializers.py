from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework import exceptions

User = get_user_model()

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password' : {'write_only' : True},
            'first_name' : {'required' : True},
            'last_name' : {'required' : True}
        }
        
class EmailVerifySerializer(serializers.Serializer):
    token = serializers.CharField()
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)
        
    def validate(self, attrs):
        credentials = {
            'email' : attrs['email'],
            'password' : attrs['password']
        }
        
        user = authenticate(**credentials)
        
        if user is None or not user.is_active or not user.is_verified:
            raise exceptions.AuthenticationFailed(detail = 'no active account with provided credentials')    
        
        attrs['user'] = user
        return attrs
    
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    

