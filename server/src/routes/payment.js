const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const router = express.Router();

const PRICING_TIERS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 500, // $5
    credits: 5,
    features: ['5 short clips', 'AI editing', 'Basic titles', 'Standard quality']
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 1000, // $10
    credits: 15,
    features: ['15 short clips', 'Advanced AI editing', 'Custom titles', 'HD quality']
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 1500, // $15
    credits: 50,
    features: ['50 short clips', 'Premium AI editing', 'Custom branding', '4K quality']
  }
};

// Get pricing tiers
router.get('/tiers', (req, res) => {
  res.json(Object.values(PRICING_TIERS));
});

// Create payment intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    const { tierId } = req.body;
    const tier = PRICING_TIERS[tierId];

    if (!tier) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: tier.price,
      currency: 'usd',
      metadata: {
        userId: req.user.uid,
        tierId: tier.id,
        credits: tier.credits.toString()
      },
      description: `${tier.name} Plan - ${tier.credits} credits`
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      tier
    });
  } catch (error) {
    logger.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm-payment', verifyToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    if (paymentIntent.metadata.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const credits = parseInt(paymentIntent.metadata.credits);
    const transactionId = uuidv4();

    // Add credits to user
    await db.collection('users').doc(req.user.uid).update({
      credits: admin.firestore.FieldValue.increment(credits),
      totalSpent: admin.firestore.FieldValue.increment(paymentIntent.amount / 100),
      lastPurchase: new Date()
    });

    // Record transaction
    await db.collection('transactions').doc(transactionId).set({
      userId: req.user.uid,
      paymentIntentId,
      amount: paymentIntent.amount,
      credits,
      tier: paymentIntent.metadata.tierId,
      status: 'completed',
      createdAt: new Date()
    });

    logger.info(`Payment completed: ${transactionId}`);
    res.json({ success: true, credits, message: 'Payment successful!' });
  } catch (error) {
    logger.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Webhook for Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const credits = parseInt(paymentIntent.metadata.credits);
      const userId = paymentIntent.metadata.userId;

      await db.collection('users').doc(userId).update({
        credits: admin.firestore.FieldValue.increment(credits),
        lastPurchase: new Date()
      });

      logger.info(`Webhook: Payment succeeded for user ${userId}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Get transaction history
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('transactions')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(transactions);
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;