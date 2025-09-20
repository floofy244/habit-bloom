from rest_framework import serializers
from .models import Habit, Completion, Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for habit categories."""
    class Meta:
        model = Category
        fields = ('id', 'name', 'color', 'icon')


class HabitSerializer(serializers.ModelSerializer):
    """Serializer for habits."""
    streak = serializers.SerializerMethodField()
    is_completed_today = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Habit
        fields = ('id', 'name', 'description', 'category', 'category_name', 
                 'frequency', 'points_per_completion', 'is_active', 'streak', 
                 'is_completed_today', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def get_streak(self, obj):
        return obj.get_streak()
    
    def get_is_completed_today(self, obj):
        return obj.is_completed_today()


class HabitCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating habits."""
    class Meta:
        model = Habit
        fields = ('name', 'description', 'category', 'frequency', 'points_per_completion')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CompletionSerializer(serializers.ModelSerializer):
    """Serializer for habit completions."""
    habit_name = serializers.CharField(source='habit.name', read_only=True)
    
    class Meta:
        model = Completion
        fields = ('id', 'habit', 'habit_name', 'completed_at', 'notes')
        read_only_fields = ('id', 'completed_at')
    
    def create(self, validated_data):
        validated_data['habit'] = validated_data['habit']
        return super().create(validated_data)


class DashboardSerializer(serializers.Serializer):
    """Serializer for dashboard data."""
    total_habits = serializers.IntegerField()
    completed_today = serializers.IntegerField()
    total_points = serializers.IntegerField()
    current_level = serializers.IntegerField()
    level_progress = serializers.DictField()
    habits = HabitSerializer(many=True)
    recent_completions = CompletionSerializer(many=True)
