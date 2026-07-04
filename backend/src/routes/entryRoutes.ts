import express from 'express';
import { getEntries, createEntry, getAnalytics, generateWeeklySummary, getDailyPrompt, getCompanionLetter, getCommunityEntries, toggleShare, sendHug } from '../controllers/entryController';
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

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const router = express.Router();

router.route('/').get(protect, getEntries).post(protect, upload.single('image'), createEntry);
router.route('/analytics').get(protect, getAnalytics);
router.route('/analytics/summary').post(protect, generateWeeklySummary);
router.route('/daily-prompt').get(protect, getDailyPrompt);
router.route('/companion/letter').get(protect, getCompanionLetter);
router.route('/community').get(protect, getCommunityEntries);
router.route('/:id/share').put(protect, toggleShare);
router.route('/:id/hug').post(protect, sendHug);

export default router;
