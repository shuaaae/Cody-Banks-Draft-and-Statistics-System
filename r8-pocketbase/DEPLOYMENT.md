# 🚀 Deploying PocketBase to Render

## Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

## Step 2: Deploy from GitHub

1. Click "New +" in your dashboard
2. Select "Web Service"
3. Connect your GitHub account
4. Select the `r8-pocketbase` repository
5. Configure the service:
   - **Name**: `r8-pocketbase`
   - **Environment**: `Docker`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: Leave empty (uses Dockerfile)
   - **Start Command**: Leave empty (uses Dockerfile)

## Step 3: Environment Variables

Add these environment variables:
- `PORT`: `8080`

## Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Build the Docker image
   - Deploy to a live URL
   - Set up HTTPS

## Step 5: Access PocketBase

1. Once deployed, Render provides a URL like: `https://r8-pocketbase.onrender.com`
2. Access admin panel at: `https://r8-pocketbase.onrender.com/_/`
3. Create your first admin account

## Step 6: Set Up Collections

### Option A: Manual Setup (Recommended)

1. Go to the admin panel
2. Create these collections:
   - **heroes** (name, role, image)
   - **teams** (name, logo, players_data)
   - **matches** (match_date, winner, team_id, etc.)
   - **players** (name, role, photo, team_id)
   - **player_stats** (player_name, hero_name, stats)

### Option B: Use Migration Script

1. Update the URL in `migrate-data.js`
2. Run: `npm install && npm run migrate`

## Step 7: Import Your Data

1. Export data from your Laravel database
2. Import into PocketBase collections
3. Upload hero images to the heroes collection

## Step 8: Update Frontend

Update your frontend to use PocketBase API:

```javascript
// Example API calls
const pb = new PocketBase('https://r8-pocketbase.onrender.com');

// Get heroes
const heroes = await pb.collection('heroes').getList();

// Get teams
const teams = await pb.collection('teams').getList();

// Create a match
const match = await pb.collection('matches').create({
  match_date: '2025-01-15',
  winner: 'Team Blue',
  team_id: 'team_id_here'
});
```

## API Endpoints

- `GET /api/collections/heroes/records` - Get all heroes
- `POST /api/collections/heroes/records` - Create hero
- `GET /api/collections/teams/records` - Get all teams
- `POST /api/collections/teams/records` - Create team
- `GET /api/collections/matches/records` - Get all matches
- `POST /api/collections/matches/records` - Create match

## File Uploads

PocketBase handles file uploads automatically:
- Hero images: `/api/files/heroes/{record_id}/{filename}`
- Team logos: `/api/files/teams/{record_id}/{filename}`
- Player photos: `/api/files/players/{record_id}/{filename}`

## Render Benefits

✅ **750 free hours/month** (enough for 24/7)  
✅ **PostgreSQL database included**  
✅ **File storage included**  
✅ **Automatic HTTPS**  
✅ **Easy deployment**  
✅ **No credit card required** 