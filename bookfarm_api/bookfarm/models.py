from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Author(models.Model):
    name = models.CharField(max_length=50, blank = False)
    
    def __str__(self):
        return self.name
    
class Tag(models.Model):
    name = models.CharField(max_length = 50, blank = False)
    
    def __str__(self):
        return self.name

class Book(models.Model):
    owner = models.ForeignKey(User, on_delete = models.CASCADE)
    title = models.CharField(max_length=50, blank = False)
    imageUrl = models.CharField(max_length=500)
    isAvailable = models.BooleanField(default = True)
    price = models.IntegerField(blank = False)
    
    authors = models.ManyToManyField(Author)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.title

class WishList(models.Model):
    book = models.ForeignKey(Book, on_delete = models.CASCADE)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    
    def __str__(self):
        return self.book.title
    