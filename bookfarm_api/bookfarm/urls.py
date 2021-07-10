from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from django.urls import include, path

from .views import BooksViewSet, UsersViewSet, UserBooksViewSet, TagsViewSet, AuthorViewSet

router = DefaultRouter()

router.register('books', BooksViewSet, basename = 'books')
router.register('users', UsersViewSet )
router.register('tags', TagsViewSet, basename='tags')
router.register('authors', AuthorViewSet, basename = 'authors')

books_router = routers.NestedSimpleRouter(router, r'users', lookup = 'user')

books_router.register('books', UserBooksViewSet, basename = 'user-books')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(books_router.urls))
    
]