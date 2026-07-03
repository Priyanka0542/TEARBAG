import { Response } from 'express';
import Entry from '../models/Entry';
import { AuthRequest } from '../middleware/authMiddleware';
import { GoogleGenAI } from '@google/genai';
import { format } from 'date-fns';

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
    let detectedEmotion = 'calm';
    let detectedIntensity = 0.5;
    
    if (content && content.length > 20) {
      try {
        const pastEntries = await Entry.find({ userId: req.user.id }).sort({ date: -1 }).limit(3);
        const pastContext = pastEntries.length > 0 
          ? `Past recent context from the user: ${pastEntries.map(e => `Moods: ${e.moods?.join(',')}. Entry: ${e.content}`).join(' | ')}`
          : 'No past context available.';

        const prompt = `You are a supportive AI companion for a journaling app. The user has just written a journal entry with the mood(s): ${moods?.join(', ') || 'neutral'}. Here is their entry: "${content}". 
        ${pastContext}
        1. Write a brief, gentle 1-2 sentence reflection back to them. If appropriate, subtly reference their past context to show you remember them.
        2. Classify the dominant emotion into EXACTLY one of: calm, joy, sadness, anger, anxiety
        3. Rate the emotional intensity from 0.0 (very mild) to 1.0 (extremely intense)
        4. Generate 3 highly relevant, single-word tags (starting with #) based on the current content.
        Format your response EXACTLY like this (each on its own line):
        Reflection: [your reflection]
        Emotion: [one of: calm, joy, sadness, anger, anxiety]
        Intensity: [a number between 0.0 and 1.0]
        Tags: [#tag1, #tag2, #tag3]`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        const responseText = response.text || '';
        const reflectionMatch = responseText.match(/Reflection:\s*(.*)/);
        const tagsMatch = responseText.match(/Tags:\s*(.*)/);
        const emotionMatch = responseText.match(/Emotion:\s*(.*)/);
        const intensityMatch = responseText.match(/Intensity:\s*([\d.]+)/);
        
        if (reflectionMatch && reflectionMatch[1]) aiReflection = reflectionMatch[1].trim();
        if (tagsMatch && tagsMatch[1]) {
          tags = tagsMatch[1].split(',').map((t: string) => t.trim());
        }
        
        const validEmotions = ['calm', 'joy', 'sadness', 'anger', 'anxiety'];
        if (emotionMatch && emotionMatch[1]) {
          const detected = emotionMatch[1].trim().toLowerCase();
          if (validEmotions.includes(detected)) {
            detectedEmotion = detected;
          }
        }
        if (intensityMatch && intensityMatch[1]) {
          const val = parseFloat(intensityMatch[1]);
          if (!isNaN(val) && val >= 0 && val <= 1) {
            detectedIntensity = val;
          }
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
      emotion: detectedEmotion,
      emotionIntensity: detectedIntensity,
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
        const currentEntry = entries[i];
        const previousEntry = entries[i+1];
        if (!currentEntry || !previousEntry || !currentEntry.date || !previousEntry.date) continue;
        
        const current = new Date(currentEntry.date).setHours(0,0,0,0);
        const previous = new Date(previousEntry.date).setHours(0,0,0,0);
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

export const getDailyPrompt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lastEntry = await Entry.findOne({ userId: req.user.id }).sort({ date: -1 });
    
    let promptText = "How are you feeling today?";
    if (lastEntry) {
      const prompt = `You are the AI companion for TearBag. The user's last journal entry had the mood(s): ${lastEntry.moods?.join(', ')} and they wrote: "${lastEntry.content}". Generate a single, short, warm, and engaging question to ask them today as a daily check-in prompt based on their last entry. Do not use quotes. Maximum 1 sentence.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      if (response.text) promptText = response.text.trim();
    }
    
    res.status(200).json({ prompt: promptText });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCompanionLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ date: -1 }).limit(10);
    
    let pastContext = '';
    if (entries.length > 0) {
      pastContext = entries.map(e => `[${format(new Date(e.date), 'MMM d, yyyy')} - Mood: ${e.moods?.join(', ')}] ${e.content}`).join('\n\n');
    }

    const prompt = `You are a deeply empathetic AI emotional companion.
    Below is the user's journal history over their last few entries.
    Read their journey, and write a personalized, supportive, and poetic 3-4 paragraph letter to them.
    Validate their struggles, celebrate their wins, and offer gentle encouragement.
    Do not mention that you are reading from a database or use robotic language. Speak like a wise, caring friend.
    
    Journal History:
    ${pastContext}
    
    Write the letter now:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.status(200).json({ letter: response.text });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommunityEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Exclude userId to maintain anonymity
    const entries = await Entry.find({ isShared: true })
      .select('-userId -aiReflection')
      .sort({ date: -1 })
      .limit(50);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleShare = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    
    entry.isShared = !entry.isShared;
    await entry.save();
    
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendHug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, isShared: true },
      { $inc: { hugs: 1 } },
      { new: true }
    );
    
    if (!entry) {
      res.status(404).json({ message: 'Entry not found or not shared' });
      return;
    }
    
    res.status(200).json({ hugs: entry.hugs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
