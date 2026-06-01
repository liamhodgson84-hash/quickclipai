const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const { verifyToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const user = userDoc.data();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, bio, preferences } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;

    await db.collection('users').doc(req.user.uid).update(updateData);

    logger.info(`Profile updated: ${req.user.uid}`);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const user = userDoc.data();

    const videosSnapshot = await db.collection('videos')
      .where('userId', '==', req.user.uid)
      .get();

    const transactionsSnapshot = await db.collection('transactions')
      .where('userId', '==', req.user.uid)
      .get();

    const stats = {
      credits: user?.credits || 0,
      videosProcessed: user?.videosProcessed || 0,
      totalSpent: user?.totalSpent || 0,
      totalVideos: videosSnapshot.size,
      completedVideos: videosSnapshot.docs.filter(doc => doc.data().status === 'completed').length,
      failedVideos: videosSnapshot.docs.filter(doc => doc.data().status === 'failed').length,
      totalTransactions: transactionsSnapshot.size
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update user preferences
router.put('/preferences', verifyToken, async (req, res) => {
  try {
    const { defaultFormat, defaultQuality, emailNotifications } = req.body;

    const preferences = {};
    if (defaultFormat) preferences.defaultFormat = defaultFormat;
    if (defaultQuality) preferences.defaultQuality = defaultQuality;
    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;

    await db.collection('users').doc(req.user.uid).update({
      preferences: admin.firestore.FieldValue.arrayUnion(preferences),
      updatedAt: new Date()
    });

    res.json({ success: true, message: 'Preferences updated' });
  } catch (error) {
    logger.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Delete account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    // Delete user from Firebase Auth
    await admin.auth().deleteUser(req.user.uid);

    // Delete user data from Firestore
    await db.collection('users').doc(req.user.uid).delete();

    // Delete user videos
    const videosSnapshot = await db.collection('videos')
      .where('userId', '==', req.user.uid)
      .get();

    const batch = db.batch();
    videosSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    logger.info(`Account deleted: ${req.user.uid}`);
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    logger.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;