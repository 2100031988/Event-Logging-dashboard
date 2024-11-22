// src/routes/eventRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { createEvent, verifyEventChain } from '../controllers/eventController.js';

const router = express.Router();

// Route for verifying the event chain
router.get('/verify', verifyEventChain);

export default router;
