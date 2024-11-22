// src/controllers/eventController.js

import Event from '../db/eventModel.js';

// Function to verify the event chain
export async function verifyEventChain(req, res) {
  try {
    // Fetch all events from the database, sorted by timestamp
    const events = await Event.find().sort({ timestamp: 1 });

    // If there are no events, return success
    if (events.length === 0) {
      return res.status(200).json({ message: 'No events found. Chain is valid.' });
    }

    // Verify each event's previousHash matches the hash of the preceding event
    for (let i = 1; i < events.length; i++) {
      const previousEvent = events[i - 1];
      const currentEvent = events[i];

      // Check if the current event's previousHash matches the hash of the previous event
      if (currentEvent.previousHash !== previousEvent.hash) {
        return res.status(400).json({
          message: 'Chain is broken',
          errorAtEventId: currentEvent._id,
          details: {
            expectedPreviousHash: previousEvent.hash,
            actualPreviousHash: currentEvent.previousHash
          }
        });
      }
    }

    // If all checks pass, the chain is valid
    res.status(200).json({ message: 'Event chain is valid.' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying event chain', error: err.message });
  }
}
