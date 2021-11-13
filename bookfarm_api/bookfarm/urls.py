from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from django.urls import include, path

from .views import BooksViewSet, UsersViewSet, UserBooksViewSet, TagsViewSet, AuthorViewSet, WishListViewSet

router = DefaultRouter()

router.register('books', BooksViewSet, basename = 'books')
router.register('users', UsersViewSet, basename = 'users')
router.register('tags', TagsViewSet, basename='tags')
router.register('authors', AuthorViewSet, basename = 'authors')

nested_router = routers.NestedSimpleRouter(router, r'users', lookup = 'user')

nested_router.register('books', UserBooksViewSet, basename = 'user-books')
nested_router.register('wishlisted-books', WishListViewSet, basename = 'user-wishlisted-books')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(nested_router.urls))
    
]