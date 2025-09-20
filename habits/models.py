from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta

User = get_user_model()


class Category(models.Model):
    """Habit categories for organization."""
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    icon = models.CharField(max_length=50, default='star')  # Icon name
    
    def __str__(self):
        return self.name


class Habit(models.Model):
    """User habits to track."""
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default='daily')
    points_per_completion = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}: {self.name}"
    
    def get_streak(self):
        """Calculate current streak for this habit."""
        completions = self.completions.filter(completed_at__date__lte=date.today()).order_by('-completed_at')
        if not completions.exists():
            return 0
        
        streak = 0
        current_date = date.today()
        
        for completion in completions:
            completion_date = completion.completed_at.date()
            
            if self.frequency == 'daily':
                if completion_date == current_date:
                    streak += 1
                    current_date -= timedelta(days=1)
                else:
                    break
            elif self.frequency == 'weekly':
                # For weekly habits, check if completion is within the current week
                week_start = current_date - timedelta(days=current_date.weekday())
                if completion_date >= week_start:
                    streak += 1
                    current_date = week_start - timedelta(days=1)
                else:
                    break
        
        return streak
    
    def is_completed_today(self):
        """Check if habit is completed today."""
        if self.frequency == 'daily':
            return self.completions.filter(completed_at__date=date.today()).exists()
        elif self.frequency == 'weekly':
            week_start = date.today() - timedelta(days=date.today().weekday())
            return self.completions.filter(
                completed_at__date__gte=week_start,
                completed_at__date__lte=date.today()
            ).exists()
        return False


class Completion(models.Model):
    """Record of habit completions."""
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='completions')
    completed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.habit.name} - {self.completed_at.date()}"
    
    def save(self, *args, **kwargs):
        """Override save to add points to user."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            # Add points to user
            self.habit.user.add_points(self.habit.points_per_completion)
