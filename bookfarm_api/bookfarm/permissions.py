from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    
    def has_object_permission(self, request, view, instance):
        if request.method in SAFE_METHODS or instance.owner == request.user:
            return True
        
        return False
        
        
class IsUserOwnerOfWishlist(BasePermission):
    def has_object_permission(self, request, view, instance):
        if request.method in SAFE_METHODS or instance.user == request.user:
            return True
        
        return False