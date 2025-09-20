# HabitBloom 🌱

A beautiful habit tracking application built with React and Django, featuring a stunning beige lilac color palette and modern UI design.

## Features

- ✨ Beautiful beige lilac color palette with glass morphism effects
- 🎯 Create and track daily habits
- 📊 Dashboard with progress tracking and statistics
- 🏆 Gamification with points and levels
- 📱 Responsive design for all devices
- 🔐 User authentication and profiles
- 📈 Habit streaks and completion tracking

## Tech Stack

### Frontend
- React 18
- React Router
- Axios for API calls
- Lucide React for icons
- React Toastify for notifications
- Custom CSS with CSS variables

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL database
- Token authentication
- CORS support

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (Supabase recommended)

### Local Development Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables (create a `.env` file):
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_SSL=True
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

5. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

6. Start both servers:
   ```bash
   # Terminal 1 - Backend
   python manage.py runserver
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

7. Open [http://localhost:3000](http://localhost:3000) to view the app

### Deployment to Render

This application is configured for easy deployment to Render with Supabase. See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/logout/` - User logout

### Habits
- `GET /api/habits/` - List user habits
- `POST /api/habits/` - Create new habit
- `PUT /api/habits/{id}/` - Update habit
- `DELETE /api/habits/{id}/` - Delete habit
- `POST /api/habits/{id}/complete/` - Mark habit as completed
- `GET /api/habits/dashboard/` - Get dashboard data

### Categories
- `GET /api/categories/` - List habit categories

## Design System

The application uses a carefully crafted beige lilac color palette:

- **Primary**: Warm beige tones (#b8957a to #5a3f2f)
- **Secondary**: Soft lilac tones (#a67cc7 to #53316a)
- **Accent**: Complementary earth tones
- **Neutral**: Sophisticated grays
- **Success**: Fresh greens
- **Error**: Warm reds

## Features in Detail

### Dashboard
- Overview of all habits and progress
- Level progression with visual indicators
- Recent activity feed
- Quick habit completion

### Habit Management
- Create, edit, and delete habits
- Set frequency (daily/weekly)
- Assign point values
- Category organization
- Streak tracking

### Gamification
- Points system for habit completion
- Level progression
- Visual progress indicators
- Achievement tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

