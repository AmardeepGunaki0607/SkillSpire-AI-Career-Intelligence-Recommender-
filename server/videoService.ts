import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export interface GenerateVideoParams {
  prompt: string;
  aspectRatio?: '16:9' | '9:16';
  resolution?: '720p' | '1080p';
}

export async function startVideoGeneration({
  prompt,
  aspectRatio = '16:9',
  resolution = '720p',
}: GenerateVideoParams): Promise<{ operationName: string }> {
  const ai = getGenAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is required for Veo 3 video generation');
  }

  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution,
      aspectRatio,
    },
  });

  if (!operation || !operation.name) {
    throw new Error('Failed to initiate video generation operation');
  }

  return { operationName: operation.name };
}

export async function checkVideoStatus(operationName: string): Promise<{ done: boolean; error?: any }> {
  const ai = getGenAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is required for Veo 3 video generation');
  }

  const op = new GenerateVideosOperation();
  op.name = operationName;
  const updated = await ai.operations.getVideosOperation({ operation: op });

  return {
    done: Boolean(updated.done),
    error: updated.error || null,
  };
}

export async function downloadVideoBuffer(operationName: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const ai = getGenAI();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!ai || !apiKey) {
    throw new Error('GEMINI_API_KEY is required for Veo 3 video generation');
  }

  const op = new GenerateVideosOperation();
  op.name = operationName;
  const updated = await ai.operations.getVideosOperation({ operation: op });

  const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) {
    throw new Error('No video download URI found in completed operation');
  }

  const response = await fetch(uri, {
    headers: {
      'x-goog-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch generated video from storage (${response.status}: ${response.statusText})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get('content-type') || 'video/mp4';

  return { buffer, mimeType };
}
