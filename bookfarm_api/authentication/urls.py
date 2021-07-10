from rest_framework import routers
from .views import UserLoginViewSet, UserSignUpViewSet, EmailVerifyViewSet, DemoViewSet, ForgotPasswordViewSet

router = routers.DefaultRouter()

router.register('login', UserLoginViewSet, basename = 'auth')
router.register('signup', UserSignUpViewSet, basename = 'auth')
router.register('test', DemoViewSet, basename = 'auth')
router.register('forgot-password', ForgotPasswordViewSet, basename = 'auth')
router.register('verify-email', EmailVerifyViewSet, basename = 'auth')


urlpatterns = router.urls
