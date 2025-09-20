from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, CompletionViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'habits', HabitViewSet, basename='habit')
router.register(r'completions', CompletionViewSet, basename='completion')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('habits/dashboard/', HabitViewSet.as_view({'get': 'dashboard'}), name='habits-dashboard'),
]
