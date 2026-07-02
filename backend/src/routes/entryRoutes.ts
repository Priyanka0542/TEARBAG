import express from 'express';
import { getEntries, createEntry, getAnalytics, generateWeeklySummary } from '../controllers/entryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getEntries).post(protect, createEntry);
router.route('/analytics').get(protect, getAnalytics);
router.route('/analytics/summary').post(protect, generateWeeklySummary);

export default router;
