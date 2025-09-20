from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        error_messages={
            'min_length': 'Password must be at least 8 characters long.',
            'blank': 'Password is required.',
        }
    )
    password_confirm = serializers.CharField(
        write_only=True,
        error_messages={
            'blank': 'Password confirmation is required.',
        }
    )
    email = serializers.EmailField(
        error_messages={
            'invalid': 'Please enter a valid email address.',
            'blank': 'Email is required.',
        }
    )
    username = serializers.CharField(
        min_length=3,
        max_length=30,
        error_messages={
            'min_length': 'Username must be at least 3 characters long.',
            'max_length': 'Username cannot be longer than 30 characters.',
            'blank': 'Username is required.',
        }
    )
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField(
        error_messages={
            'invalid': 'Please enter a valid email address.',
            'blank': 'Email is required.',
        }
    )
    password = serializers.CharField(
        error_messages={
            'blank': 'Password is required.',
        }
    )
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('Your account has been disabled. Please contact support.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email and password are required.')
        
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    level_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'total_points', 'current_level', 
                 'level_progress', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def get_level_progress(self, obj):
        return obj.get_level_progress()
