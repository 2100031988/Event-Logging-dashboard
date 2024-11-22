// src/db/eventModel.js
import mongoose from 'mongoose';
import crypto from 'crypto';

// Define the event schema
const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  sourceAppId: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true }, // Payload as JSON
  timestamp: { type: Date, default: Date.now },
  previousHash: { type: String, default: '' }, // Reference to the previous event's hash
  hash: { type: String, required: true } // Current event's hash
});

// Model for the event
const Event = mongoose.model('Event', eventSchema);

// Function to generate the hash of the event
export function generateHash(event) {
  return crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex');
}

export default Event;
