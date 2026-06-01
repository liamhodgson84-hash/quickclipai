const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const { verifyToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create user in Firebase Auth
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      name,
      email,
      credits: 3, // Free trial credits
      tier: 'free',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalSpent: 0,
      videosProcessed: 0,
      preferences: {
        emailNotifications: true,
        defaultFormat: 'vertical',
        defaultQuality: 'hd'
      }
    });

    logger.info(`New user created: ${email}`);
    res.status(201).json({ uid: user.uid, message: 'Account created successfully' });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);

    // Get user data
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    logger.info(`User signed in: ${email}`);
    res.json({
      uid: user.uid,
      token,
      user: userData
    });
  } catch (error) {
    logger.error('Signin error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userData);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout (client-side primarily, but we can invalidate tokens if needed)
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // In production, you might add token to a blacklist
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;