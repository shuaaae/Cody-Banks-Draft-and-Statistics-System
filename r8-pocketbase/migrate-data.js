const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const LARAVEL_DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  database: 'esports',
  user: 'root',
  password: ''
};

const POCKETBASE_URL = 'http://localhost:8090'; // Change this to your Railway URL
const POCKETBASE_ADMIN_EMAIL = 'admin@r8esports.com';
const POCKETBASE_ADMIN_PASSWORD = 'admin123456';

// PocketBase API helper
class PocketBaseAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Failed to login to PocketBase');
    }
    
    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async createCollection(collection) {
    const response = await fetch(`${this.baseUrl}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      },
      body: JSON.stringify(collection)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`Failed to create collection: ${error}`);
      return false;
    }
    
    return true;
  }

  async createRecord(collection, record) {
    const response = await fetch(`${this.baseUrl}/api/collections/${collection}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      },
      body: JSON.stringify(record)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`Failed to create record: ${error}`);
      return false;
    }
    
    return true;
  }
}

// Migration script
async function migrateData() {
  console.log('🚀 Starting migration from Laravel to PocketBase...');
  
  // Initialize PocketBase API
  const pb = new PocketBaseAPI(POCKETBASE_URL);
  
  try {
    // Login to PocketBase
    console.log('📝 Logging into PocketBase...');
    await pb.login(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);
    
    // Create collections
    console.log('🗂️ Creating collections...');
    
    // Heroes collection
    const heroesCollection = {
      name: 'heroes',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'role',
          type: 'text',
          required: true
        },
        {
          name: 'image',
          type: 'file',
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            thumbs: ['100x100']
          }
        }
      ]
    };
    
    await pb.createCollection(heroesCollection);
    
    // Teams collection
    const teamsCollection = {
      name: 'teams',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'logo',
          type: 'file',
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            thumbs: ['100x100']
          }
        },
        {
          name: 'players_data',
          type: 'json'
        }
      ]
    };
    
    await pb.createCollection(teamsCollection);
    
    // Matches collection
    const matchesCollection = {
      name: 'matches',
      type: 'base',
      schema: [
        {
          name: 'match_date',
          type: 'date',
          required: true
        },
        {
          name: 'winner',
          type: 'text',
          required: true
        },
        {
          name: 'team_id',
          type: 'relation',
          options: {
            collectionId: 'teams',
            cascadeDelete: false
          }
        },
        {
          name: 'turtle_taken',
          type: 'text'
        },
        {
          name: 'lord_taken',
          type: 'text'
        },
        {
          name: 'notes',
          type: 'text'
        },
        {
          name: 'playstyle',
          type: 'text'
        }
      ]
    };
    
    await pb.createCollection(matchesCollection);
    
    // Players collection
    const playersCollection = {
      name: 'players',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'role',
          type: 'text'
        },
        {
          name: 'photo',
          type: 'file',
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            thumbs: ['100x100']
          }
        },
        {
          name: 'team_id',
          type: 'relation',
          options: {
            collectionId: 'teams',
            cascadeDelete: false
          }
        }
      ]
    };
    
    await pb.createCollection(playersCollection);
    
    // Player Stats collection
    const playerStatsCollection = {
      name: 'player_stats',
      type: 'base',
      schema: [
        {
          name: 'player_name',
          type: 'text',
          required: true
        },
        {
          name: 'hero_name',
          type: 'text',
          required: true
        },
        {
          name: 'games_played',
          type: 'number',
          required: true
        },
        {
          name: 'wins',
          type: 'number',
          required: true
        },
        {
          name: 'losses',
          type: 'number',
          required: true
        },
        {
          name: 'win_rate',
          type: 'number',
          required: true
        },
        {
          name: 'kills',
          type: 'number',
          required: true
        },
        {
          name: 'deaths',
          type: 'number',
          required: true
        },
        {
          name: 'assists',
          type: 'number',
          required: true
        },
        {
          name: 'kda_ratio',
          type: 'number',
          required: true
        },
        {
          name: 'team_id',
          type: 'relation',
          options: {
            collectionId: 'teams',
            cascadeDelete: false
          }
        }
      ]
    };
    
    await pb.createCollection(playerStatsCollection);
    
    console.log('✅ Collections created successfully!');
    console.log('📝 Next steps:');
    console.log('1. Deploy to Railway');
    console.log('2. Access admin panel at /_/');
    console.log('3. Import your data manually or use the migration script');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateData(); 