import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateCompleteAnalysis } from './src/lib/recommendationEngine';
import { CAREER_KNOWLEDGE_BASE } from './src/data/knowledgeBase';
import { enhanceAnalysisWithGemini, handleAssistantChat } from './server/geminiService';
import { startVideoGeneration, checkVideoStatus, downloadVideoBuffer } from './server/videoService';
import { UserProfile, AnalysisResult } from './src/types';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SkillSpire AI API',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
    });
  });

  app.get('/api/careers', (req, res) => {
    res.json({
      careers: CAREER_KNOWLEDGE_BASE
    });
  });

  // Veo 3 Video Generation Endpoints
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { prompt, aspectRatio, resolution } = req.body as {
        prompt: string;
        aspectRatio?: '16:9' | '9:16';
        resolution?: '720p' | '1080p';
      };

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: 'Text prompt is required for video generation.' });
      }

      const validAspect = aspectRatio === '9:16' ? '9:16' : '16:9';
      const validRes = resolution === '1080p' ? '1080p' : '720p';

      const result = await startVideoGeneration({
        prompt: prompt.trim(),
        aspectRatio: validAspect,
        resolution: validRes,
      });

      res.json({
        operationName: result.operationName,
        aspectRatio: validAspect,
        prompt: prompt.trim(),
        startedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error starting video generation:', error);
      res.status(500).json({
        error: (error as Error).message || 'Failed to start video generation',
      });
    }
  });

  app.post('/api/video-status', async (req, res) => {
    try {
      const { operationName } = req.body as { operationName: string };
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const status = await checkVideoStatus(operationName);
      res.json(status);
    } catch (error) {
      console.error('Error checking video status:', error);
      res.status(500).json({
        error: (error as Error).message || 'Failed to check video status',
      });
    }
  });

  app.post('/api/video-download', async (req, res) => {
    try {
      const { operationName } = req.body as { operationName: string };
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const { buffer, mimeType } = await downloadVideoBuffer(operationName);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    } catch (error) {
      console.error('Error downloading video:', error);
      res.status(500).json({
        error: (error as Error).message || 'Failed to download generated video',
      });
    }
  });

  app.post('/api/analyze-profile', async (req, res) => {
    try {
      const userProfile = req.body as UserProfile;
      if (!userProfile || !userProfile.skills) {
        return res.status(400).json({ error: 'Invalid profile data provided' });
      }

      // Step 1: Deterministic scoring and multi-phase roadmap generation
      const baseAnalysis = generateCompleteAnalysis(userProfile);

      // Step 2: Server-side Gemini AI enhancement
      const finalAnalysis = await enhanceAnalysisWithGemini(userProfile, baseAnalysis);

      res.json(finalAnalysis);
    } catch (error) {
      console.error('Error analyzing profile:', error);
      res.status(500).json({ error: 'Failed to complete career analysis', details: (error as Error).message });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, analysisResult, chatHistory } = req.body as {
        message: string;
        analysisResult: AnalysisResult;
        chatHistory: Array<{ role: 'user' | 'assistant'; text: string }>;
      };

      if (!message || !analysisResult) {
        return res.status(400).json({ error: 'Message and active analysis result are required.' });
      }

      const reply = await handleAssistantChat(message, analysisResult, chatHistory || []);
      res.json({ reply });
    } catch (error) {
      console.error('Error in chat assistant:', error);
      res.status(500).json({
        reply: 'I experienced a momentary connection delay. Please review your active roadmap phase or ask another career preparation question!'
      });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSpire AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
