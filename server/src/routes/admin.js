const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const { verifyAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get platform statistics
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const videosSnapshot = await db.collection('videos').get();
    const transactionsSnapshot = await db.collection('transactions').get();

    const stats = {
      totalUsers: usersSnapshot.size,
      totalVideos: videosSnapshot.size,
      completedVideos: videosSnapshot.docs.filter(doc => doc.data().status === 'completed').length,
      failedVideos: videosSnapshot.docs.filter(doc => doc.data().status === 'failed').length,
      totalTransactions: transactionsSnapshot.size,
      totalRevenue: transactionsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0) / 100
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const snapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit + 1)
      .offset(skip)
      .get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const hasMore = users.length > limit;
    if (hasMore) users.pop();

    res.json({ users, page, hasMore });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all videos
router.get('/videos', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const snapshot = await db.collection('videos')
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

    res.json({ videos, page, hasMore });
  } catch (error) {
    logger.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Give user credits (admin action)
router.post('/users/:userId/credits', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await db.collection('users').doc(userId).update({
      credits: admin.firestore.FieldValue.increment(amount),
      updatedAt: new Date()
    });

    // Log admin action
    await db.collection('admin_logs').add({
      action: 'add_credits',
      adminId: req.user.uid,
      userId,
      amount,
      reason,
      timestamp: new Date()
    });

    logger.info(`Credits added to ${userId}: ${amount}`);
    res.json({ success: true, message: 'Credits added' });
  } catch (error) {
    logger.error('Error adding credits:', error);
    res.status(500).json({ error: 'Failed to add credits' });
  }
});

// Suspend user
router.post('/users/:userId/suspend', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    await db.collection('users').doc(userId).update({
      suspended: true,
      suspensionReason: reason,
      suspendedAt: new Date()
    });

    logger.info(`User suspended: ${userId}`);
    res.json({ success: true, message: 'User suspended' });
  } catch (error) {
    logger.error('Error suspending user:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

module.exports = router;