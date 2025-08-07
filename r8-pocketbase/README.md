# R8 Esports PocketBase Backend

This is the PocketBase backend for the R8 Esports application.

## Features

- User authentication
- Hero management with image uploads
- Team management
- Match tracking
- Player statistics
- Real-time subscriptions

## Collections

1. **users** - User authentication (built-in)
2. **heroes** - Hero data with images
3. **teams** - Team management
4. **matches** - Match data
5. **players** - Player information
6. **player_stats** - Player statistics

## Deployment

This project is configured to deploy on Railway using Docker.

## API Endpoints

- `/api/collections/heroes/records` - Hero management
- `/api/collections/teams/records` - Team management
- `/api/collections/matches/records` - Match data
- `/api/collections/players/records` - Player data
- `/api/collections/player_stats/records` - Player statistics

## Admin Panel

Access the admin panel at `/_/` to manage collections and data. 