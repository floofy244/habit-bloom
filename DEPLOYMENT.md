# HabitBloom Deployment Guide

This guide will help you deploy HabitBloom to Vercel with PostgreSQL database.

## Prerequisites

- Node.js 16+ installed
- Python 3.8+ installed
- PostgreSQL database (local or cloud)
- Vercel account
- Git repository

## Step 1: Set up PostgreSQL Database

### Option A: Local PostgreSQL (Development)

1. **Install PostgreSQL:**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`

2. **Create database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE habitbloom;
   
   # Create user (optional)
   CREATE USER habitbloom_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE habitbloom TO habitbloom_user;
   ```

### Option B: Cloud PostgreSQL (Recommended for Production)

1. **Neon (Free tier available):**
   - Go to [neon.tech](https://neon.tech)
   - Create account and new project
   - Copy connection string

2. **Supabase (Free tier available):**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Go to Settings > Database
   - Copy connection string

3. **Railway (Free tier available):**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Add PostgreSQL service
   - Copy connection details

## Step 2: Configure Environment Variables

1. **Create `.env` file in project root:**
   ```bash
   # Django Settings
   SECRET_KEY=your-super-secret-key-here
   DEBUG=False
   
   # Database Settings (replace with your actual values)
   DB_NAME=habitbloom
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_SSL=True
   ```

2. **Create `frontend/.env` file:**
   ```bash
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```

## Step 3: Deploy Backend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy backend:**
   ```bash
   # From project root
   vercel --prod
   ```

4. **Set environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all variables from your `.env` file

## Step 4: Deploy Frontend to Vercel

1. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Set environment variables:**
   - Go to frontend project in Vercel dashboard
   - Add `REACT_APP_API_URL` with your backend URL

## Step 5: Run Database Migrations

1. **Connect to your Vercel function:**
   ```bash
   vercel env pull .env.production
   ```

2. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Create sample data:**
   ```bash
   python setup.py
   ```

## Step 6: Test Deployment

1. **Visit your frontend URL:**
   - Should load the React app
   - Try registering a new user
   - Test creating and completing habits

2. **Check backend API:**
   - Visit `https://your-backend-url.vercel.app/api/`
   - Should return API endpoints

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Check your database credentials
   - Ensure database is accessible from Vercel
   - Verify SSL settings

2. **CORS Errors:**
   - Update `CORS_ALLOWED_ORIGINS` in settings.py
   - Add your frontend URL to allowed origins

3. **Static Files Not Loading:**
   - Add `whitenoise` to INSTALLED_APPS
   - Configure static files settings

4. **Environment Variables Not Loading:**
   - Check variable names in Vercel dashboard
   - Ensure no typos in variable names
   - Restart deployment after adding variables

### Debug Commands

```bash
# Check Vercel logs
vercel logs

# Test database connection
python manage.py dbshell

# Check environment variables
vercel env ls
```

## Production Checklist

- [ ] Database is properly configured and accessible
- [ ] Environment variables are set in Vercel
- [ ] DEBUG is set to False
- [ ] Secret key is secure and random
- [ ] CORS settings allow your frontend domain
- [ ] Static files are properly served
- [ ] Database migrations are run
- [ ] Superuser account is created
- [ ] Sample data is loaded (optional)

## Monitoring and Maintenance

1. **Monitor Vercel dashboard** for:
   - Function execution time
   - Error rates
   - Usage statistics

2. **Database monitoring:**
   - Check connection limits
   - Monitor query performance
   - Set up backups

3. **Regular updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Test deployments in staging

## Scaling Considerations

- **Database:** Consider upgrading to a paid plan for better performance
- **CDN:** Vercel automatically provides CDN for static assets
- **Caching:** Implement Redis for session storage if needed
- **Monitoring:** Add error tracking (Sentry) for production

## Support

If you encounter issues:

1. Check Vercel logs: `vercel logs`
2. Check Django logs in Vercel dashboard
3. Test database connection locally
4. Verify environment variables
5. Check CORS settings

---

**Your HabitBloom app should now be live! 🌱**

Visit your frontend URL to start using the app.
