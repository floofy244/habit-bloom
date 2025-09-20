from django.contrib import admin
from .models import Habit, Completion, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'icon')
    search_fields = ('name',)


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'category', 'frequency', 'points_per_completion', 'is_active')
    list_filter = ('frequency', 'is_active', 'category')
    search_fields = ('name', 'user__username', 'user__email')
    ordering = ('-created_at',)


@admin.register(Completion)
class CompletionAdmin(admin.ModelAdmin):
    list_display = ('habit', 'completed_at', 'notes')
    list_filter = ('completed_at', 'habit__frequency')
    search_fields = ('habit__name', 'habit__user__username')
    ordering = ('-completed_at',)
