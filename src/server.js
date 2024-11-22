import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import eventRoutes from './routes/eventRoutes.js';
import { setupWebSocket } from './websocket/wsHandler.js';
import './db/database.js'; // Assuming database setup is handled here

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/events', eventRoutes);

// Serve the dashboard at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Initialize WebSocket server
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

// Ensure that events are linked with hashes (previous event hash)
const { createEvent } = require('./controllers/eventController.js');

// Function to generate a hash for the event data (using SHA256)
import crypto from 'crypto';

const generateHash = (data) => {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// Modify the createEvent function to include the previous event's hash
const originalCreateEvent = createEvent;

createEvent = (req, res) => {
    // Generate the previous event hash
    const lastEvent = mockEvents[mockEvents.length - 1];
    const previousHash = lastEvent ? generateHash(lastEvent) : null;

    // Call the original createEvent logic and add the previous hash to the event
    req.body.previousHash = previousHash;

    originalCreateEvent(req, res);
};
