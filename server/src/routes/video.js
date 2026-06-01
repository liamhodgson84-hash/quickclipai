const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/auth');
const { processVideoJob } = require('../services/videoProcessor');
const Queue = require('bull');
const logger = require('../utils/logger');

const router = express.Router();
const videoQueue = new Queue('video-processing', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// Handle video processing jobs
videoQueue.process(5, async (job) => {
  return processVideoJob(job.data);
});

videoQueue.on('completed', async (job) => {
  logger.info(`Video job completed: ${job.data.jobId}`);
  await db.collection('videos').doc(job.data.jobId).update({
    status: 'completed',
    completedAt: new Date()
  });
});

videoQueue.on('failed', async (job, err) => {
  logger.error(`Video job failed: ${job.data.jobId}`, err);
  await db.collection('videos').doc(job.data.jobId).update({
    status: 'failed',
    error: err.message,
    completedAt: new Date()
  });
});

// Process YouTube video
router.post('/process', verifyToken, async (req, res) => {
  try {
    const { youtubeUrl, format = 'vertical', quality = 'hd', addMusic = true } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ error: 'YouTube URL required' });
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Check user credits
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.credits < 1) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Create video job
    const jobId = uuidv4();
    const now = new Date();

    const videoData = {
      jobId,
      userId: req.user.uid,
      youtubeUrl,
      format,
      quality,
      addMusic,
      status: 'queued',
      createdAt: now,
      updatedAt: now,
      progress: 0
    };

    // Save to database
    await db.collection('videos').doc(jobId).set(videoData);

    // Add to processing queue
    await videoQueue.add(videoData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: false
    });

    // Deduct credit
    await db.collection('users').doc(req.user.uid).update({
      credits: admin.firestore.FieldValue.increment(-1),
      videosProcessed: admin.firestore.FieldValue.increment(1)
    });

    logger.info(`Video processing started: ${jobId}`);
    res.json({ jobId, status: 'queued' });
  } catch (error) {
    logger.error('Video processing error:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

// Get video processing status
router.get('/status/:jobId', verifyToken, async (req, res) => {
  try {
    const videoDoc = await db.collection('videos').doc(req.params.jobId).get();
    const video = videoDoc.data();

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(video);
  } catch (error) {
    logger.error('Error fetching status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// Get user's videos
router.get('/my-videos', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const snapshot = await db.collection('videos')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit + 1)
      .offset(skip)
      .get();

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const hasMore = videos.length > limit;
    if (hasMore) videos.pop();

    res.json({
      videos,
      page,
      hasMore,
      total: snapshot.docs.length
    });
  } catch (error) {
    logger.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Download video
router.get('/download/:jobId', verifyToken, async (req, res) => {
  try {
    const videoDoc = await db.collection('videos').doc(req.params.jobId).get();
    const video = videoDoc.data();

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (video.status !== 'completed') {
      return res.status(400).json({ error: 'Video is not ready' });
    }

    // Generate signed URL
    const bucket = admin.storage().bucket();
    const file = bucket.file(`videos/${req.user.uid}/${req.params.jobId}.mp4`);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ downloadUrl: url });
  } catch (error) {
    logger.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// Delete video
router.delete('/:jobId', verifyToken, async (req, res) => {
  try {
    const videoDoc = await db.collection('videos').doc(req.params.jobId).get();
    const video = videoDoc.data();

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from storage
    const bucket = admin.storage().bucket();
    await bucket.file(`videos/${req.user.uid}/${req.params.jobId}.mp4`).delete().catch(() => {});

    // Delete from database
    await db.collection('videos').doc(req.params.jobId).delete();

    logger.info(`Video deleted: ${req.params.jobId}`);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    logger.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
  return youtubeRegex.test(url);
}

module.exports = router;