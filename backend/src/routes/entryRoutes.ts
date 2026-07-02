import express from 'express';
import { getEntries, createEntry, getAnalytics, generateWeeklySummary, getDailyPrompt, getCompanionLetter } from '../controllers/entryController';
import { protect } from '../middleware/authMiddleware';

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.route('/').get(protect, getEntries).post(protect, upload.single('image'), createEntry);
router.route('/analytics').get(protect, getAnalytics);
router.route('/analytics/summary').post(protect, generateWeeklySummary);
router.route('/daily-prompt').get(protect, getDailyPrompt);
router.route('/companion/letter').get(protect, getCompanionLetter);

export default router;
