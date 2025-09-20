from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from datetime import date, timedelta
from .models import Habit, Completion, Category
from .serializers import (
    HabitSerializer, HabitCreateSerializer, CompletionSerializer, 
    CategorySerializer, DashboardSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for habit categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class HabitViewSet(viewsets.ModelViewSet):
    """ViewSet for habits."""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        print(f"Habit request - User: {self.request.user}, Auth header: {self.request.META.get('HTTP_AUTHORIZATION', 'None')}")
        return Habit.objects.filter(user=self.request.user, is_active=True)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return HabitCreateSerializer
        return HabitSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a habit as completed for today."""
        habit = self.get_object()
        
        # Check if already completed today
        if habit.is_completed_today():
            return Response(
                {'error': 'Habit already completed today'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create completion record
        completion = Completion.objects.create(
            habit=habit,
            notes=request.data.get('notes', '')
        )
        
        serializer = CompletionSerializer(completion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard data for the user."""
        user = request.user
        habits = self.get_queryset()
        
        # Calculate stats
        total_habits = habits.count()
        completed_today = sum(1 for habit in habits if habit.is_completed_today())
        
        # Get recent completions (last 7 days)
        week_ago = date.today() - timedelta(days=7)
        recent_completions = Completion.objects.filter(
            habit__user=user,
            completed_at__date__gte=week_ago
        ).order_by('-completed_at')[:10]
        
        dashboard_data = {
            'total_habits': total_habits,
            'completed_today': completed_today,
            'total_points': user.total_points,
            'current_level': user.current_level,
            'level_progress': user.get_level_progress(),
            'habits': habits,
            'recent_completions': recent_completions
        }
        
        serializer = DashboardSerializer(dashboard_data)
        return Response(serializer.data)


class CompletionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for habit completions."""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Completion.objects.filter(habit__user=self.request.user)
    
    serializer_class = CompletionSerializer
