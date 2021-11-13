from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import exceptions

from .serializers import BooksSerializer, AuthorSerializer, TagsSerializer, UserBooksSerializer, UserSerializer, WishListReadOnlySerializer, WishListWriteOnlySerializer
from .models import Book, Author, Tag, WishList
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.contrib.auth import get_user_model

from authentication.authenticators import TokenAuthentication

from .permissions import IsOwnerOrReadOnly, IsUserOwnerOfWishlist

User = get_user_model()

class UsersViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    # def list(self,request):
    #     users = User.objects.all()
    #     serializer = UserSerializer(instance = users, many = True)
    #     return Response(serializer.data)
    
    def retrieve(self, request, pk = None):
        if str(request.user.id) != pk:
            raise exceptions.PermissionDenied(detail = 'You are not the owner of the resource.')
        try :
            user = User.objects.get(pk = pk)
            serializer = UserSerializer(instance = user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'detail' : 'invalid User'}, status = 404)
        
    def update(self, request, pk = None):
        if str(request.user.id) != pk:
            raise exceptions.PermissionDenied(detail = 'You are not the owner of the resource.')
        
        try :
            user = User.objects.get(pk = pk)
            serializer = UserSerializer(instance = user,data = request.data, partial = True)
            serializer.is_valid(raise_exception = True)
            serializer.save()
            return Response()
        except User.DoesNotExist:
            return Response({'detail' : 'invalid User'}, status = 404)
        

class BooksViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        books = Book.objects.all()
        serializer = BooksSerializer(instance = books, many = True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk):
        try :
            book = Book.objects.get(pk = pk)
            serializer = BooksSerializer(instance = book)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({'detail':'Not found'}, status = 404)
    
class AuthorViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request):
        serializer = AuthorSerializer(instance = Author.objects.all(), many = True)
        return Response(serializer.data)
    
class TagsViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request):
        serializer = TagsSerializer(instance = Tag.objects.all(), many = True)
        return Response(serializer.data)
    
class UserBooksViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def create(self, request, user_pk):
        serializer = UserBooksSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response()
    
    def list(self, request, user_pk):
        user_books = Book.objects.all().filter(owner = user_pk)
        serializer = BooksSerializer(instance = user_books, many = True)
        return Response(serializer.data)
    
    def retrieve(self, request,pk, user_pk):
        try:
            book = Book.objects.get(pk = pk)
            serializer = BooksSerializer(instance = book)
            return Response(serializer.data)
        except Book.DoesNotExist:
            pass
        return Response({})
    
    def update(self, request, pk, user_pk):
        try:
            book = Book.objects.get(pk = pk)
            serializer = UserBooksSerializer(instance = book, data = request.data, partial = True)
            serializer.is_valid(raise_exception = True)
            self.check_object_permissions(request, book)
            serializer.save()
            
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({'detail' : 'Invalid Book !'}, status = 400)
            
            
class WishListViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsUserOwnerOfWishlist]
    
    def create(self, request, user_pk):
        serializer = WishListWriteOnlySerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        if serializer.validated_data.get('user', None) != request.user :
            raise exceptions.PermissionDenied(detail = 'You are not the owner of the resource.')
        
        try:
            instance = WishList.objects.get(user = user_pk, book = serializer.validated_data['book'].id)
        except WishList.DoesNotExist:
            serializer.save()
            
        return Response()
    
    def list(self, request, user_pk):
        
        if str(request.user.id) != user_pk :
            raise exceptions.PermissionDenied(detail = 'You are not the owner of the resource.')
        
        wishlisted_books = WishList.objects.all().filter(user = user_pk)
        serializer = WishListReadOnlySerializer(instance = wishlisted_books, many = True)
        return Response(serializer.data)
    
    def destroy(self, request, pk, user_pk):
        try:
            instance = WishList.objects.get(pk = pk)
            self.check_object_permissions(request, instance)
            instance.delete()
            return Response({
                'detail' : 'Book removed from wishlist'
            })
        except WishList.DoesNotExist :
            return Response({'detail' : 'Invalid Request'}, status = 400)


