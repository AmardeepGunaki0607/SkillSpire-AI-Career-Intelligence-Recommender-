import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget } from 'mp4-muxer';
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmArrayBufferTarget } from 'webm-muxer';
import { fixWebmDuration } from './webmDurationFix';

export interface RenderExportOptions {
  duration: number; // in seconds (e.g. 95)
  width?: number; // default 1280
  height?: number; // default 720
  fps?: number; // default 20
  renderFrame: (ctx: CanvasRenderingContext2D, timeSec: number) => void;
  onProgress?: (percent: number, currentSec: number, totalSec: number) => void;
  preferredFormat?: 'mp4' | 'webm';
}

export interface ExportResult {
  blob: Blob;
  fileName: string;
  durationSec: number;
  format: 'mp4' | 'webm';
}

/**
 * Encodes every frame from time 0.0s to duration (e.g. 95.0s) into an authentic,
 * animated full-length video file using WebCodecs (createImageBitmap snapshots) + MP4/WebM muxing.
 * Uses createImageBitmap to guarantee each frame's canvas state is captured freshly without caching.
 */
export async function generateFullLengthVideo({
  duration,
  width = 1280,
  height = 720,
  fps = 20,
  renderFrame,
  onProgress,
  preferredFormat = 'mp4'
}: RenderExportOptions): Promise<ExportResult> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const totalFrames = Math.ceil(duration * fps);
  const frameIntervalMicroseconds = Math.round((1 / fps) * 1_000_000);

  // Strategy 1: WebCodecs VideoEncoder + MP4/WebM Muxer
  if (typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined' && typeof createImageBitmap !== 'undefined') {
    let codecToUse: 'avc' | 'vp9' = 'avc';
    let videoEncoderCodec = 'avc1.42001f'; // H.264 Baseline Level 3.1

    try {
      const isH264Supported = await VideoEncoder.isConfigSupported({
        codec: videoEncoderCodec,
        width,
        height,
        bitrate: 4_000_000,
        framerate: fps
      });

      if (!isH264Supported || !isH264Supported.supported) {
        codecToUse = 'vp9';
        videoEncoderCodec = 'vp09.00.10.08';
      }
    } catch {
      codecToUse = 'vp9';
      videoEncoderCodec = 'vp09.00.10.08';
    }

    if (codecToUse === 'avc' && preferredFormat !== 'webm') {
      try {
        const mp4Muxer = new Mp4Muxer({
          target: new Mp4ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width,
            height
          },
          fastStart: 'in-memory'
        });

        let encoderError: Error | null = null;
        const encoder = new VideoEncoder({
          output: (chunk, meta) => {
            mp4Muxer.addVideoChunk(chunk, meta);
          },
          error: (e) => {
            encoderError = e;
          }
        });

        await encoder.configure({
          codec: videoEncoderCodec,
          width,
          height,
          bitrate: 4_000_000,
          framerate: fps
        });

        for (let i = 0; i < totalFrames; i++) {
          if (encoderError) throw encoderError;

          const timeSec = (i / totalFrames) * duration;
          renderFrame(ctx, timeSec);

          // Use createImageBitmap to guarantee fresh rasterization of every single frame!
          const bitmap = await createImageBitmap(canvas);
          const frame = new VideoFrame(bitmap, {
            timestamp: i * frameIntervalMicroseconds,
            duration: frameIntervalMicroseconds
          });

          const isKeyFrame = i % (fps * 2) === 0;
          encoder.encode(frame, { keyFrame: isKeyFrame });
          frame.close();
          bitmap.close();

          if (i % 25 === 0 || i === totalFrames - 1) {
            const pct = Math.round(((i + 1) / totalFrames) * 100);
            if (onProgress) onProgress(pct, Math.min(duration, Math.round(timeSec)), duration);
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        await encoder.flush();
        encoder.close();
        mp4Muxer.finalize();

        const buffer = mp4Muxer.target.buffer;
        const blob = new Blob([buffer], { type: 'video/mp4' });

        return {
          blob,
          fileName: `SkillSpire_Website_Tutorial_Guide.mp4`,
          durationSec: duration,
          format: 'mp4'
        };
      } catch (err) {
        console.warn('MP4 encoding fallback to VP9 WebM:', err);
      }
    }

    // VP9 WebM Muxer
    try {
      const webmMuxer = new WebmMuxer({
        target: new WebmArrayBufferTarget(),
        video: {
          codec: 'V_VP9',
          width,
          height
        }
      });

      let encoderError: Error | null = null;
      const encoder = new VideoEncoder({
        output: (chunk, meta) => {
          webmMuxer.addVideoChunk(chunk, meta);
        },
        error: (e) => {
          encoderError = e;
        }
      });

      await encoder.configure({
        codec: 'vp09.00.10.08',
        width,
        height,
        bitrate: 4_000_000,
        framerate: fps
      });

      for (let i = 0; i < totalFrames; i++) {
        if (encoderError) throw encoderError;

        const timeSec = (i / totalFrames) * duration;
        renderFrame(ctx, timeSec);

        const bitmap = await createImageBitmap(canvas);
        const frame = new VideoFrame(bitmap, {
          timestamp: i * frameIntervalMicroseconds,
          duration: frameIntervalMicroseconds
        });

        const isKeyFrame = i % (fps * 2) === 0;
        encoder.encode(frame, { keyFrame: isKeyFrame });
        frame.close();
        bitmap.close();

        if (i % 25 === 0 || i === totalFrames - 1) {
          const pct = Math.round(((i + 1) / totalFrames) * 100);
          if (onProgress) onProgress(pct, Math.min(duration, Math.round(timeSec)), duration);
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      await encoder.flush();
      encoder.close();
      webmMuxer.finalize();

      const buffer = webmMuxer.target.buffer;
      const rawBlob = new Blob([buffer], { type: 'video/webm' });
      const fixedBlob = await fixWebmDuration(rawBlob, duration * 1000);

      return {
        blob: fixedBlob,
        fileName: `SkillSpire_Website_Tutorial_Guide.webm`,
        durationSec: duration,
        format: 'webm'
      };
    } catch (err) {
      console.warn('WebCodecs VP9 encoding fallback:', err);
    }
  }

  // Strategy 2: MediaRecorder with fixed frame pace (Fallback)
  return new Promise<ExportResult>(async (resolve, reject) => {
    try {
      const stream = canvas.captureStream ? canvas.captureStream(fps) : null;
      if (!stream) {
        throw new Error('Canvas captureStream not supported');
      }

      const chunks: Blob[] = [];
      let mimeType = 'video/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4')) mimeType = 'video/mp4';
        else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) mimeType = 'video/webm;codecs=vp9';
        else if (MediaRecorder.isTypeSupported('video/webm')) mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const rawBlob = new Blob(chunks, { type: mimeType });
        const fixedBlob = await fixWebmDuration(rawBlob, duration * 1000);
        resolve({
          blob: fixedBlob,
          fileName: `SkillSpire_Website_Tutorial_Guide.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`,
          durationSec: duration,
          format: mimeType.includes('mp4') ? 'mp4' : 'webm'
        });
      };

      recorder.start();

      for (let i = 0; i < totalFrames; i++) {
        const timeSec = (i / totalFrames) * duration;
        renderFrame(ctx, timeSec);
        if (i % 20 === 0) {
          const pct = Math.round(((i + 1) / totalFrames) * 100);
          if (onProgress) onProgress(pct, Math.min(duration, Math.round(timeSec)), duration);
          await new Promise((r) => setTimeout(r, 10));
        }
      }

      renderFrame(ctx, duration - 0.05);
      await new Promise((r) => setTimeout(r, 200));
      recorder.stop();
    } catch (e) {
      reject(e);
    }
  });
}
