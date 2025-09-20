from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with additional fields for gamification."""
    email = models.EmailField(unique=True)
    total_points = models.IntegerField(default=0)
    current_level = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    def add_points(self, points):
        """Add points and check for level up."""
        self.total_points += points
        new_level = (self.total_points // 100) + 1
        if new_level > self.current_level:
            self.current_level = new_level
        self.save()
    
    def get_level_progress(self):
        """Get progress towards next level."""
        current_level_points = (self.current_level - 1) * 100
        next_level_points = self.current_level * 100
        progress = self.total_points - current_level_points
        needed = next_level_points - current_level_points
        return {
            'current': progress,
            'needed': needed,
            'percentage': (progress / needed) * 100 if needed > 0 else 100
        }
