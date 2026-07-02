import express from 'express';
import { getEntries, createEntry } from '../controllers/entryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getEntries).post(protect, createEntry);

export default router;
