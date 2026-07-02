import { Response } from 'express';
import Entry from '../models/Entry';
import { AuthRequest } from '../middleware/authMiddleware';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const getEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ date: -1 });
    const now = new Date();
    const processedEntries = entries.map(entry => {
      if (entry.unlockDate && entry.unlockDate > now) {
        return {
          ...entry.toObject(),
          content: 'This memory is locked in a time capsule.',
          aiReflection: '',
          isLocked: true
        };
      }
      return { ...entry.toObject(), isLocked: false };
    });
    res.status(200).json(processedEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, moods, unlockDate } = req.body;
    
    let aiReflection = '';
    if (content && content.length > 20) {
      try {
        const prompt = `You are a supportive, empathetic, and calming AI companion for a journaling app called TearBag. The user has just written a journal entry with the mood(s): ${moods?.join(', ') || 'neutral'}. Here is their entry: "${content}". Write a brief, gentle 1-2 sentence reflection or encouraging thought back to them. Do not include quotes around your response.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        aiReflection = response.text || '';
      } catch (err) {
        console.error('AI Reflection Error:', err);
      }
    }

    const entry = new Entry({
      userId: req.user.id,
      title,
      content,
      moods,
      aiReflection,
      unlockDate,
    });
    const createdEntry = await entry.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
