from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Author, Tag, Book

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name']

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required = False)
    class Meta:
        model = Author
        fields = '__all__'
    
class TagsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required = False)
    class Meta:
        model = Tag
        fields = '__all__'

class BooksSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only = True)
    authors = AuthorSerializer(many = True, required = True)
    tags = TagsSerializer(many = True, required = False)
    class Meta:
        model = Book
        fields = '__all__'
        
    
        
class UserBooksSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many = True, required = True)
    tags = TagsSerializer(many = True, required = False)
    class Meta :
        model = Book
        fields = '__all__'
    
    def create(self, validated_data):
        print("POST")
        authors = validated_data.pop('authors')
        tags = validated_data.pop('tags')
        
        book = Book.objects.create(**validated_data)
        
        for author in authors:
            try:
                authorInstance = Author.objects.get(pk=author.get('id', None))
                book.authors.add(authorInstance)
            except Author.DoesNotExist :
                book.authors.add(Author.objects.create(**author))
                
        for tag in tags:
            try:
                tagInstance = Tag.objects.get(pk=tag.get('id', None))
                book.tags.add(tagInstance)
            except Tag.DoesNotExist :
                book.tags.add(Tag.objects.create(**tag))
            
        return book
    
    def update(self, instance, validated_data):
        # print("PUT/PATCH")
        authors = validated_data.pop('authors', instance.authors)
        tags = validated_data.pop('tags', instance.tags)
        
        instance.title = validated_data.get('title', instance.title)
        instance.imageUrl = validated_data.get('imageUrl', instance.imageUrl)
        instance.isAvailabe = validated_data.get('isAvailable', instance.isAvailable)
        instance.price = validated_data.get('price', instance.price)
        
        for author in authors:
            try:
                authorInstance = Author.objects.get(pk=author.get('id', None))
                if authorInstance not in instance.authors.all():
                    instance.authors.add(authorInstance)
            except Author.DoesNotExist :
                instance.authors.add(Author.objects.create(**author))
                
        for tag in tags:
            try:
                tagInstance = Tag.objects.get(pk=tag.get('id', None))
                if tagInstance not in instance.tags.all():
                    instance.tags.add(tagInstance)
            except Tag.DoesNotExist :
                instance.tags.add(Tag.objects.create(**tag))
                
        instance.save()
        return instance
            
            

            
                    
        
        
        