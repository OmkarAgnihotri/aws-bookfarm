from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import BooksSerializer, AuthorSerializer, TagsSerializer, UserBooksSerializer, UserSerializer
from .models import Book, Author, Tag

from django.contrib.auth import get_user_model

User = get_user_model()

class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BooksViewSet(viewsets.ViewSet):
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
    def list(self, request):
        serializer = AuthorSerializer(instance = Author.objects.all(), many = True)
        return Response(serializer.data)
    
class TagsViewSet(viewsets.ViewSet):
    def list(self, request):
        serializer = TagsSerializer(instance = Tag.objects.all(), many = True)
        return Response(serializer.data)
    
class UserBooksViewSet(viewsets.ViewSet):
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
            serializer.is_valid()
            serializer.save()
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({'detail' : 'Invalid Book !'}, status = 400)
            


