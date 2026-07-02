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
    const { title, content, unlockDate } = req.body;
    let moods = req.body.moods;
    if (typeof moods === 'string') {
      try {
        moods = JSON.parse(moods);
      } catch (e) {
        moods = [moods];
      }
    }
    
    let imageUrl = '';
    if ((req as any).file) {
      imageUrl = `/uploads/${(req as any).file.filename}`;
    }

    let aiReflection = '';
    let tags: string[] = [];
    
    if (content && content.length > 20) {
      try {
        const prompt = `You are a supportive AI companion for a journaling app. The user has just written a journal entry with the mood(s): ${moods?.join(', ') || 'neutral'}. Here is their entry: "${content}". 
        1. Write a brief, gentle 1-2 sentence reflection back to them.
        2. Generate 3 highly relevant, single-word tags (starting with #) based on the content.
        Format your response exactly like this:
        Reflection: [your reflection]
        Tags: [#tag1, #tag2, #tag3]`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        const responseText = response.text || '';
        const reflectionMatch = responseText.match(/Reflection:\s*(.*)/);
        const tagsMatch = responseText.match(/Tags:\s*(.*)/);
        
        if (reflectionMatch) aiReflection = reflectionMatch[1].trim();
        if (tagsMatch) {
          tags = tagsMatch[1].split(',').map((t: string) => t.trim());
        }
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
      tags,
      imageUrl,
    });
    const createdEntry = await entry.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ date: -1 });
    
    const moodCounts: Record<string, number> = {};
    entries.forEach(e => {
      e.moods?.forEach((m: string) => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
      });
    });

    const moodData = Object.keys(moodCounts).map(name => ({
      name,
      value: moodCounts[name]
    }));

    let streak = 0;
    if (entries.length > 0) {
      streak = 1;
      for (let i = 0; i < entries.length - 1; i++) {
        const current = new Date(entries[i].date).setHours(0,0,0,0);
        const previous = new Date(entries[i+1].date).setHours(0,0,0,0);
        const diffDays = (current - previous) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          streak++;
        } else if (diffDays > 1) {
          break;
        }
      }
    }

    res.status(200).json({ moodData, streak, totalEntries: entries.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateWeeklySummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const entries = await Entry.find({ userId: req.user.id, date: { $gte: lastWeek } });
    
    if (entries.length === 0) {
      res.status(200).json({ summary: "You haven't logged any thoughts in the past 7 days. Check in with your emotions to see your weekly growth summary!" });
      return;
    }

    const journalContent = entries.map(e => `Moods: ${e.moods?.join(', ')}. Entry: ${e.content}`).join('\n\n');
    const prompt = `You are an empathetic, insightful psychological AI companion for TearBag. Below are the user's journal entries from the past 7 days. Write a short, encouraging 2-paragraph summary of their emotional week. Highlight their strengths, growth, or give gentle advice on how to navigate their recurring feelings. Speak directly to the user warmly.\n\n${journalContent}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.status(200).json({ summary: response.text });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
