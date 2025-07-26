# R8 Esports - Setup Guide

This guide will help you set up the R8 Esports project on a new PC after downloading it from GitHub.

## Project Overview
This is a full-stack web application with:
- **Frontend**: React.js application (r8-esports folder)
- **Backend**: Laravel PHP application (r8-backend folder)

## Prerequisites
Before you begin, make sure you have the following installed on your PC:

### Required Software
1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - This includes npm (Node Package Manager)

2. **PHP** (version 8.2 or higher)
   - Windows: Download from https://windows.php.net/download/
   - macOS: Use Homebrew: `brew install php`
   - Linux: `sudo apt install php8.2` (Ubuntu) or equivalent

3. **Composer** (PHP dependency manager)
   - Download from: https://getcomposer.org/download/

4. **Git** (if not already installed)
   - Download from: https://git-scm.com/

### Optional but Recommended
- **Database**: MySQL, PostgreSQL, or SQLite (Laravel supports all)
- **Code Editor**: VS Code, PHPStorm, or similar

## Step-by-Step Setup

### 1. Download the Project
```bash
# Clone your repository (replace with your actual GitHub URL)
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup (Laravel)

#### Navigate to backend directory
```bash
cd r8-backend
```

#### Install PHP dependencies
```bash
composer install
```

#### Set up environment file
```bash
# Copy the example environment file
cp .env.example .env
```

#### Configure your .env file
Open the `.env` file in a text editor and configure:
```env
APP_NAME="R8 Esports"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration (example for SQLite - easiest option)
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/your/project/r8-backend/database/database.sqlite

# Or for MySQL (if you prefer)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=r8_esports
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

#### Generate application key
```bash
php artisan key:generate
```

#### Set up database
```bash
# If using SQLite (easier option)
touch database/database.sqlite

# Run database migrations
php artisan migrate
```

#### Start the backend server
```bash
php artisan serve
```
The backend will be available at `http://localhost:8000`

### 3. Frontend Setup (React)

#### Open a new terminal and navigate to frontend directory
```bash
cd r8-esports
```

#### Install Node.js dependencies
```bash
npm install
```

#### Start the frontend development server
```bash
npm start
```
The frontend will be available at `http://localhost:3000`

## Running the Application

### Development Mode
1. **Start Backend** (in one terminal):
   ```bash
   cd r8-backend
   php artisan serve
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd r8-esports
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Production Build
To build for production:

1. **Build the React frontend**:
   ```bash
   cd r8-esports
   npm run build
   ```

2. **Configure Laravel for production** (update .env):
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

## Troubleshooting

### Common Issues

#### 1. "php artisan serve" not working
- Make sure PHP is installed and in your system PATH
- Try: `php -v` to check if PHP is accessible

#### 2. "composer install" fails
- Make sure Composer is installed globally
- Try: `composer --version` to verify

#### 3. "npm start" fails
- Make sure Node.js is installed
- Try: `node --version` and `npm --version`
- Delete `node_modules` folder and run `npm install` again

#### 4. Database connection errors
- Check your `.env` file configuration
- For SQLite: ensure the database file exists
- For MySQL: ensure the database exists and credentials are correct

#### 5. CORS errors between frontend and backend
- The React app is configured with proxy: "http://127.0.0.1:8000"
- Make sure the Laravel backend is running on port 8000

### Dependencies Issues
If you encounter dependency conflicts:

#### For React (frontend)
```bash
cd r8-esports
rm -rf node_modules package-lock.json
npm install
```

#### For Laravel (backend)
```bash
cd r8-backend
rm -rf vendor composer.lock
composer install
```

## Environment Variables

### Backend (.env)
Key variables to configure:
- `APP_URL`: Your application URL
- `DB_*`: Database configuration
- `APP_KEY`: Generated automatically with `php artisan key:generate`

### Frontend
The React app uses the proxy configuration in package.json to communicate with the Laravel backend.

## Additional Notes

1. **Port Configuration**: 
   - Backend runs on port 8000 (Laravel default)
   - Frontend runs on port 3000 (React default)

2. **API Communication**: 
   - The React app is configured to proxy API requests to the Laravel backend

3. **File Permissions** (Linux/macOS):
   ```bash
   chmod -R 755 r8-backend/storage
   chmod -R 755 r8-backend/bootstrap/cache
   ```

4. **Database Seeding** (if applicable):
   ```bash
   cd r8-backend
   php artisan db:seed
   ```

## Next Steps

After successful setup:
1. Access the application at http://localhost:3000
2. Check that API calls to the backend are working
3. Review the application features and functionality
4. Configure any additional services or integrations as needed

## Support

If you encounter issues:
1. Check this troubleshooting section
2. Verify all prerequisites are installed correctly
3. Check the Laravel and React documentation for specific errors
4. Review the browser console and server logs for error messages

---

*Last updated: [Current Date]*
*Project: R8 Esports Full-Stack Application*