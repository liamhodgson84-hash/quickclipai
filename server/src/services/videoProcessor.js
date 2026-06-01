const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
const logger = require('../utils/logger');

const execAsync = promisify(exec);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const TEMP_DIR = path.join(__dirname, '../../temp');

class VideoProcessor {
  async downloadVideo(youtubeUrl, jobId) {
    try {
      logger.info(`Downloading video: ${youtubeUrl}`);
      const outputPath = path.join(TEMP_DIR, `${jobId}_original.mp4`);
      
      await execAsync(
        `yt-dlp -f best -o "${outputPath}" "${youtubeUrl}"`,
        { maxBuffer: 1024 * 1024 * 50 }
      );

      logger.info(`Video downloaded: ${outputPath}`);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }

  async extractFrames(videoPath, jobId) {
    try {
      logger.info(`Extracting frames from: ${videoPath}`);
      const framesDir = path.join(TEMP_DIR, `${jobId}_frames`);
      
      await execAsync(`mkdir -p "${framesDir}"`);
      await execAsync(
        `ffmpeg -i "${videoPath}" -vf fps=1 -q:v 2 "${framesDir}/frame_%04d.jpg"`,
        { maxBuffer: 1024 * 1024 * 50 }
      );

      const files = await fs.readdir(framesDir);
      logger.info(`Extracted ${files.length} frames`);
      return framesDir;
    } catch (error) {
      throw new Error(`Failed to extract frames: ${error.message}`);
    }
  }

  async generateTitles(framesDir, jobId) {
    try {
      logger.info(`Generating titles for: ${jobId}`);
      const files = await fs.readdir(framesDir);
      const titles = [];

      for (const file of files.slice(0, 5)) {
        const framePath = path.join(framesDir, file);
        const imageData = await fs.readFile(framePath, { encoding: 'base64' });

        const response = await openai.chat.completions.create({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageData}`
                  }
                },
                {
                  type: 'text',
                  text: 'Create an engaging, trendy YouTube short title (max 60 characters) for this scene. Only return the title, nothing else.'
                }
              ]
            }
          ],
          max_tokens: 50
        });

        const title = response.choices[0].message.content.trim();
        titles.push(title);
      }

      logger.info(`Generated ${titles.length} titles`);
      return titles;
    } catch (error) {
      throw new Error(`Failed to generate titles: ${error.message}`);
    }
  }

  async generateCaptions(videoPath, jobId) {
    try {
      logger.info(`Generating captions for: ${jobId}`);
      
      // Extract audio
      const audioPath = path.join(TEMP_DIR, `${jobId}_audio.mp3`);
      await execAsync(
        `ffmpeg -i "${videoPath}" -q:a 9 -n "${audioPath}"`,
        { maxBuffer: 1024 * 1024 * 50 }
      );

      // Transcribe with Whisper
      const audioData = await fs.readFile(audioPath);
      const transcript = await openai.audio.transcriptions.create({
        file: new File([audioData], 'audio.mp3', { type: 'audio/mp3' }),
        model: 'whisper-1'
      });

      logger.info(`Captions generated for: ${jobId}`);
      return transcript.text;
    } catch (error) {
      throw new Error(`Failed to generate captions: ${error.message}`);
    }
  }

  async addEffects(videoPath, titles, captions, format, quality, jobId) {
    try {
      logger.info(`Adding effects to: ${jobId}`);
      const outputPath = path.join(TEMP_DIR, `${jobId}_edited.mp4`);

      let filterComplex = '';
      const fontSize = quality === '4k' ? 60 : quality === 'hd' ? 40 : 30;

      // Add title overlay
      filterComplex += `drawtext=text='${titles[0]}':fontsize=${fontSize}:fontcolor=white:x=(w-text_w)/2:y=50:enable='between(t,0,3)'`;

      // Add captions
      const lines = captions.split('\n').slice(0, 5);
      let captionText = lines.join(' | ');
      captionText = captionText.replace(/'/g, "\'")
      
      filterComplex += `,drawtext=text='${captionText}':fontsize=${fontSize * 0.6}:fontcolor=white:x=(w-text_w)/2:y=h-100:enable='between(t,0,duration)'`;

      // Resize based on format
      if (format === 'vertical') {
        filterComplex += ',scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2';
      } else if (format === 'square') {
        filterComplex += ',scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2';
      }

      const crf = quality === '4k' ? 18 : quality === 'hd' ? 22 : 28;

      await execAsync(
        `ffmpeg -i "${videoPath}" -vf "${filterComplex}" -crf ${crf} -preset fast "${outputPath}"`,
        { maxBuffer: 1024 * 1024 * 50 }
      );

      logger.info(`Effects added: ${outputPath}`);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to add effects: ${error.message}`);
    }
  }

  async addMusic(videoPath, jobId) {
    try {
      logger.info(`Adding music to: ${jobId}`);
      const outputPath = path.join(TEMP_DIR, `${jobId}_final.mp4`);
      const musicPath = process.env.MUSIC_LIBRARY_PATH || path.join(TEMP_DIR, 'background_music.mp3');

      // Check if music file exists
      try {
        await fs.access(musicPath);
      } catch {
        logger.warn(`Music file not found: ${musicPath}, skipping music`);
        return videoPath;
      }

      await execAsync(
        `ffmpeg -i "${videoPath}" -i "${musicPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest "${outputPath}"`,
        { maxBuffer: 1024 * 1024 * 50 }
      );

      logger.info(`Music added: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.warn(`Failed to add music: ${error.message}`);
      return videoPath;
    }
  }

  async uploadToStorage(videoPath, userId, jobId) {
    try {
      logger.info(`Uploading to storage: ${videoPath}`);
      const bucket = admin.storage().bucket();
      const destination = `videos/${userId}/${jobId}.mp4`;

      await bucket.upload(videoPath, {
        destination,
        metadata: {
          contentType: 'video/mp4',
          metadata: {
            jobId,
            userId,
            uploadedAt: new Date().toISOString()
          }
        }
      });

      const [url] = await bucket.file(destination).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000
      });

      logger.info(`Video uploaded to storage: ${destination}`);
      return url;
    } catch (error) {
      throw new Error(`Failed to upload to storage: ${error.message}`);
    }
  }

  async cleanup(jobId) {
    try {
      const patterns = [
        path.join(TEMP_DIR, `${jobId}*`),
        path.join(TEMP_DIR, `${jobId}_frames`)
      ];

      for (const pattern of patterns) {
        await execAsync(`rm -rf "${pattern}"`);
      }

      logger.info(`Cleaned up temp files for: ${jobId}`);
    } catch (error) {
      logger.warn(`Cleanup warning: ${error.message}`);
    }
  }
}

const processor = new VideoProcessor();

const processVideoJob = async (jobData) => {
  const { jobId, userId, youtubeUrl, format, quality, addMusic } = jobData;
  
  try {
    logger.info(`Processing video job: ${jobId}`);
    const db = admin.firestore();

    // Update status
    await db.collection('videos').doc(jobId).update({
      status: 'processing',
      progress: 10
    });

    // Download video
    const videoPath = await processor.downloadVideo(youtubeUrl, jobId);
    await db.collection('videos').doc(jobId).update({ progress: 30 });

    // Extract frames
    const framesDir = await processor.extractFrames(videoPath, jobId);
    await db.collection('videos').doc(jobId).update({ progress: 40 });

    // Generate titles
    const titles = await processor.generateTitles(framesDir, jobId);
    await db.collection('videos').doc(jobId).update({ progress: 50 });

    // Generate captions
    const captions = await processor.generateCaptions(videoPath, jobId);
    await db.collection('videos').doc(jobId).update({ progress: 60 });

    // Add effects
    let editedPath = await processor.addEffects(videoPath, titles, captions, format, quality, jobId);
    await db.collection('videos').doc(jobId).update({ progress: 80 });

    // Add music
    if (addMusic) {
      editedPath = await processor.addMusic(editedPath, jobId);
    }
    await db.collection('videos').doc(jobId).update({ progress: 90 });

    // Upload to storage
    const downloadUrl = await processor.uploadToStorage(editedPath, userId, jobId);
    await db.collection('videos').doc(jobId).update({ progress: 95 });

    // Update database
    await db.collection('videos').doc(jobId).update({
      status: 'completed',
      downloadUrl,
      progress: 100,
      completedAt: new Date()
    });

    // Cleanup
    await processor.cleanup(jobId);

    logger.info(`Video processing completed: ${jobId}`);
    return { success: true, jobId };
  } catch (error) {
    logger.error(`Video processing failed for ${jobId}:`, error);
    
    try {
      const db = admin.firestore();
      await db.collection('videos').doc(jobId).update({
        status: 'failed',
        error: error.message,
        failedAt: new Date()
      });

      await processor.cleanup(jobId);
    } catch (cleanupError) {
      logger.error(`Cleanup failed: ${cleanupError.message}`);
    }

    throw error;
  }
};

module.exports = { processVideoJob };