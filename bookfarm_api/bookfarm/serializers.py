from rest_framework import serializers, exceptions
from django.contrib.auth import get_user_model, authenticate
from .models import Author, Tag, Book, WishList


User = get_user_model()


        

class UserSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only = True, required = False)
    new_password = serializers.CharField(write_only = True, required = False)
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email', 'current_password', 'new_password']
        
        extra_kwargs = {
            'password' : {'write_only' : True},
            'email' : {'read_only' : True}
        }
        
    def update(self, instance, validated_data):
        
        instance.first_name = validated_data.pop('first_name', instance.first_name)
        instance.last_name = validated_data.pop('last_name', instance.last_name)
        
        current_password = validated_data.pop('current_password', None)
        
        if current_password is not None:
            credentials = {
                'email' : instance.email,
                'password' : current_password
            }
            
            user = authenticate(**credentials)
            
            if user is None:
                raise exceptions.AuthenticationFailed(detail = 'Password does not match')
            
            new_password = validated_data.pop('new_password', None)
            
            if new_password is not None:
                instance.set_password(new_password)
                
        instance.save()
        
        return instance

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
        print("PUT/PATCH")
        print(validated_data)
        authors = validated_data.pop('authors', instance.authors)
        tags = validated_data.pop('tags', instance.tags)
        
        instance.title = validated_data.get('title', instance.title)
        instance.imageUrl = validated_data.get('imageUrl', instance.imageUrl)
        instance.isAvailable = validated_data.get('isAvailable', instance.isAvailable)
        instance.price = validated_data.get('price', instance.price)
        
        if len(authors) == 0:
            raise serializers.ValidationError({'detail' : 'Atleast one author is required'})
        
        if len(tags) == 0:
            raise serializers.ValidationError({'detail' : 'Atleast one Tag is required'})
        
        instance.authors.all().delete()
        for author in authors:
            try:
                authorInstance = Author.objects.get(pk=author.get('id', None))
                instance.authors.add(authorInstance)
            except Author.DoesNotExist :
                instance.authors.add(Author.objects.create(**author))
                
        instance.tags.all().delete()
        for tag in tags:
            try:
                tagInstance = Tag.objects.get(pk=tag.get('id', None))
                instance.tags.add(tagInstance)
            except Tag.DoesNotExist :
                instance.tags.add(Tag.objects.create(**tag))
            
        instance.save()
        return instance
            
            

            
class WishListWriteOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = WishList
        fields = ['user', 'book']
        
class WishListReadOnlySerializer(serializers.ModelSerializer):
    book = BooksSerializer(read_only = True)
    class Meta :
        model = WishList
        fields = '__all__'