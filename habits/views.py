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
        return (Habit.objects.filter(user=self.request.user, is_active=True)
                .select_related('category'))
    
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
        
        # Calculate stats (optimized)
        total_habits = habits.count()

        today = date.today()
        week_start = today - timedelta(days=today.weekday())

        daily_ids = habits.filter(frequency='daily').values_list('id', flat=True)
        weekly_ids = habits.filter(frequency='weekly').values_list('id', flat=True)

        completed_daily_count = Completion.objects.filter(
            habit_id__in=daily_ids,
            completed_at__date=today,
        ).values('habit_id').distinct().count()

        completed_weekly_count = Completion.objects.filter(
            habit_id__in=weekly_ids,
            completed_at__date__gte=week_start,
            completed_at__date__lte=today,
        ).values('habit_id').distinct().count()

        completed_today = completed_daily_count + completed_weekly_count
        
        # Get recent completions (last 7 days)
        week_ago = today - timedelta(days=7)
        recent_completions = Completion.objects.filter(
            habit__user=user,
            completed_at__date__gte=week_ago
        ).select_related('habit').order_by('-completed_at')[:10]
        
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
        return Completion.objects.filter(habit__user=self.request.user).select_related('habit')
    
    serializer_class = CompletionSerializer
