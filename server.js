const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', // Default user
  host: 'localhost',
  database: 'campeonato_futebol',
  password: '.Postgresql205',
  port: 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

// Initialize database tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        jersey_number INTEGER,
        position VARCHAR(50),
        team_id VARCHAR(20) REFERENCES teams(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(20) PRIMARY KEY,
        round INTEGER NOT NULL,
        home_team_id VARCHAR(20) REFERENCES teams(id),
        away_team_id VARCHAR(20) REFERENCES teams(id),
        score_home INTEGER,
        score_away INTEGER,
        played BOOLEAN DEFAULT FALSE,
        referee VARCHAR(100),
        field VARCHAR(100),
        match_date DATE,
        match_time TIME
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(20) PRIMARY KEY,
        match_id VARCHAR(20) REFERENCES matches(id) ON DELETE CASCADE,
        player_id VARCHAR(20) REFERENCES players(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        minute INTEGER
      )
    `);

    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// API Routes

// Get all data
app.get('/api/state', async (req, res) => {
  try {
    const teams = await pool.query('SELECT * FROM teams ORDER BY name');
    const players = await pool.query('SELECT * FROM players ORDER BY name');
    const matches = await pool.query('SELECT * FROM matches ORDER BY round, id');
    const events = await pool.query('SELECT * FROM events ORDER BY minute');

    res.json({
      teams: teams.rows,
      players: players.rows,
      matches: matches.rows,
      events: events.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Save all data
app.post('/api/state', async (req, res) => {
  const { teams, players, matches, events } = req.body;

  try {
    // Clear existing data
    await pool.query('DELETE FROM events');
    await pool.query('DELETE FROM matches');
    await pool.query('DELETE FROM players');
    await pool.query('DELETE FROM teams');

    // Insert teams
    for (const team of teams) {
      await pool.query('INSERT INTO teams (id, name) VALUES ($1, $2)', [team.id, team.name]);
    }

    // Insert players
    for (const player of players) {
      await pool.query('INSERT INTO players (id, name, jersey_number, position, team_id) VALUES ($1, $2, $3, $4, $5)',
        [player.id, player.name, player.jerseyNumber, player.position, player.teamId]);
    }

    // Insert matches
    for (const match of matches) {
      await pool.query(`INSERT INTO matches (id, round, home_team_id, away_team_id, score_home, score_away, played, referee, field, match_date, match_time)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [match.id, match.round, match.homeTeamId, match.awayTeamId, match.scoreHome, match.scoreAway, match.played, match.referee, match.field, match.matchDate, match.matchTime]);
    }

    // Insert events
    for (const event of events) {
      await pool.query('INSERT INTO events (id, match_id, player_id, type, minute) VALUES ($1, $2, $3, $4, $5)',
        [event.id, event.matchId, event.playerId, event.type, event.minute]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await initDB();
});
