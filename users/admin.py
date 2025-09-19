from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'total_points', 'current_level', 'is_active')
    list_filter = ('is_active', 'is_staff', 'current_level')
    search_fields = ('email', 'username')
    ordering = ('-created_at',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Gamification', {'fields': ('total_points', 'current_level')}),
    )
