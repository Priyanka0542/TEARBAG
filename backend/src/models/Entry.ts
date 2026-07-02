import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled' },
    content: { type: String, required: true },
    moods: [{ type: String }],
    aiReflection: { type: String, default: '' },
    unlockDate: { type: Date, default: null },
    tags: [{ type: String }],
    imageUrl: { type: String, default: null },
    isShared: { type: Boolean, default: false },
    hugs: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Entry', entrySchema);
