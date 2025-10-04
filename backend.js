const express = require('express');
const cors = require('cors');
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend - prioritize dist (Vite build) over public (legacy)
const fs = require('fs');
if (fs.existsSync('dist')) {
  app.use(express.static('dist'));
  console.log('📁 Serving Vite frontend from /dist');
} else {
  app.use(express.static('public'));
  console.log('📁 Serving legacy frontend from /public');
}

// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, provider);
const CONTRACT_ABI = [
  "event MfaLogged(bytes32 indexed approvalHash, address indexed merchant, uint256 timestamp)",
  "function logMfa(bytes32 approvalHash) external"
];
let contract;

if (process.env.CONTRACT_ADDRESS) {
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
}

// In-memory storage
const otpStore = {};
const merchantThresholds = { default: 500 };

// Analytics storage
const analyticsData = {
  transactions: [],
  fraudAttempts: [],
  mfaUsage: [],
  dailyStats: new Map()
};

// Fraud pattern detection
function detectFraudPatterns() {
  const patterns = [];
  
  // Pattern 1: Multiple failed MFA attempts
  const failedMfa = analyticsData.fraudAttempts.filter(f => 
    f.reason && f.reason.includes('OTP') && 
    Date.now() - f.timestamp.getTime() < 3600000 // Last hour
  );
  if (failedMfa.length > 2) {
    patterns.push({
      type: 'Multiple Failed MFA',
      count: failedMfa.length,
      severity: 'high',
      description: 'Multiple OTP failures detected in the last hour'
    });
  }

  // Pattern 2: High-value transaction attempts
  const highValueAttempts = analyticsData.fraudAttempts.filter(f => 
    f.amount > 1000 && Date.now() - f.timestamp.getTime() < 86400000 // Last 24h
  );
  if (highValueAttempts.length > 0) {
    patterns.push({
      type: 'High-Value Fraud Attempts',
      count: highValueAttempts.length,
      severity: 'high',
      description: 'Attempted fraudulent transactions above $1000'
    });
  }

  // Pattern 3: Rapid transaction attempts
  const recentTransactions = analyticsData.transactions.filter(t => 
    Date.now() - t.timestamp.getTime() < 300000 // Last 5 minutes
  );
  if (recentTransactions.length > 3) {
    patterns.push({
      type: 'Rapid Transactions',
      count: recentTransactions.length,
      severity: 'medium',
      description: 'Multiple transactions in short time period'
    });
  }

  return patterns;
}

// Blockchain transaction caching
let blockchainCache = {
  transactions: [],
  lastFetch: 0,
  cacheDurationMs: 5 * 60 * 1000 // 5 minutes cache
};

// Blockchain transaction querying with caching
async function getBlockchainTransactions() {
  if (!contract || !provider) return [];
  
  const now = Date.now();
  
  // Return cached data if still valid
  if (now - blockchainCache.lastFetch < blockchainCache.cacheDurationMs) {
    console.log('📋 Using cached blockchain transactions');
    return blockchainCache.transactions;
  }
  
  try {
    // Get current block number and query only 9 blocks to stay within free tier limit
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 9); // Last 9 blocks to be safe
    const toBlock = currentBlock;
    
    console.log(`🔍 Querying blockchain blocks ${fromBlock} to ${toBlock} (range: ${toBlock - fromBlock + 1})`);
    
    const filter = contract.filters.MfaLogged();
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    
    const transactions = events.map(event => ({
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      approvalHash: event.args.approvalHash,
      merchant: event.args.merchant,
      timestamp: new Date(Number(event.args.timestamp) * 1000),
      explorerUrl: `https://amoy.polygonscan.com/tx/${event.transactionHash}`
    }));
    
    // Update cache
    blockchainCache.transactions = transactions;
    blockchainCache.lastFetch = now;
    
    console.log(`💾 Cached ${transactions.length} blockchain transactions`);
    
    return transactions;
  } catch (error) {
    console.error('Error fetching blockchain transactions:', error);
    // Return cached data if available, otherwise empty array
    return blockchainCache.transactions.length > 0 ? blockchainCache.transactions : [];
  }
}

// Helper functions for analytics
function recordTransaction(type, data) {
  const timestamp = new Date();
  const record = { ...data, timestamp, type };
  
  if (type === 'transaction') {
    analyticsData.transactions.push(record);
  } else if (type === 'fraud') {
    analyticsData.fraudAttempts.push(record);
  } else if (type === 'mfa') {
    analyticsData.mfaUsage.push(record);
  }
  
  // Update daily stats
  const dateKey = timestamp.toDateString();
  if (!analyticsData.dailyStats.has(dateKey)) {
    analyticsData.dailyStats.set(dateKey, {
      date: timestamp.toISOString().split('T')[0],
      transactions: 0,
      revenue: 0,
      fraudAttempts: 0,
      mfaUsage: 0
    });
  }
  
  const dayStats = analyticsData.dailyStats.get(dateKey);
  if (type === 'transaction') {
    dayStats.transactions += 1;
    dayStats.revenue += data.amount || 0;
  } else if (type === 'fraud') {
    dayStats.fraudAttempts += 1;
  } else if (type === 'mfa') {
    dayStats.mfaUsage += 1;
  }
}

function detectFraudPatterns() {
  const patterns = [];
  // Helper function to get timestamp as milliseconds
  const getTimestampMs = (item) => {
    if (!item.timestamp) return 0;
    return item.timestamp instanceof Date ? item.timestamp.getTime() : item.timestamp;
  };
  
  const recentFraud = analyticsData.fraudAttempts.filter(
    f => Date.now() - getTimestampMs(f) < 24 * 60 * 60 * 1000
  );
  
  // Pattern 1: Multiple failed MFA attempts
  const failedMfaAttempts = recentFraud.filter(f => f.reason?.includes('MFA'));
  if (failedMfaAttempts.length >= 3) {
    patterns.push({
      type: 'Multiple Failed MFA',
      count: failedMfaAttempts.length,
      severity: 'high',
      description: 'Multiple transactions with failed MFA verification detected'
    });
  }
  
  // Pattern 2: High-value transaction attempts
  const highValueFraud = recentFraud.filter(f => f.amount > 1000);
  if (highValueFraud.length >= 2) {
    patterns.push({
      type: 'High-Value Fraud',
      count: highValueFraud.length,
      severity: 'medium',
      description: 'Multiple high-value fraudulent transaction attempts'
    });
  }
  
  // Pattern 3: Rapid transaction attempts
  const rapidAttempts = recentFraud.filter(f => {
    const hourAgo = Date.now() - 60 * 60 * 1000;
    return getTimestampMs(f) > hourAgo;
  });
  if (rapidAttempts.length >= 5) {
    patterns.push({
      type: 'Rapid Attempts',
      count: rapidAttempts.length,
      severity: 'low',
      description: 'Multiple fraud attempts in short time period'
    });
  }
  
  return patterns;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    blockchain: !!contract,
    wallet: wallet.address 
  });
});

// Merchant Analytics API
app.get('/api/merchant/analytics', async (req, res) => {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Helper function to get timestamp as Date object
  const getTimestamp = (item) => {
    if (!item.timestamp) return new Date(0);
    return item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
  };
  
  // Filter recent data with proper timestamp handling
  const recentTransactions = analyticsData.transactions.filter(t => getTimestamp(t) > last30Days);
  const recentFraud = analyticsData.fraudAttempts.filter(f => getTimestamp(f) > last30Days);
  const recentMfa = analyticsData.mfaUsage.filter(m => getTimestamp(m) > last30Days);
  
  // Calculate metrics
  const totalRevenue = recentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const fraudPatterns = detectFraudPatterns();
  
  // Get blockchain transactions with error handling
  let blockchainTransactions = [];
  try {
    blockchainTransactions = await getBlockchainTransactions();
  } catch (error) {
    console.log('Blockchain query failed, using sample data:', error.message);
    blockchainTransactions = [];
  }
  
  // Generate sample daily stats if none exist
  let dailyStatsArray = Array.from(analyticsData.dailyStats.values())
    .filter(stat => new Date(stat.date) > last30Days)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // If no daily stats, generate sample data
  if (dailyStatsArray.length === 0) {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dailyStatsArray.push({
        date: date.toISOString().split('T')[0],
        transactions: Math.floor(Math.random() * 50) + 20,
        revenue: Math.floor(Math.random() * 5000) + 2000,
        fraudAttempts: Math.floor(Math.random() * 5)
      });
    }
  }
  
  // Format recent transactions for display
  const formattedTransactions = analyticsData.transactions
    .slice(-10) // Last 10 transactions
    .reverse()
    .map(t => ({
      id: t.orderId || `tx_${Date.now()}`,
      amount: t.amount || 0,
      status: t.success ? 'completed' : (t.fraud ? 'fraud_blocked' : 'pending'),
      mfaUsed: !!t.mfaUsed,
      timestamp: getTimestamp(t).toISOString(),
      method: t.method || 'none',
      riskScore: t.riskScore || 'low',
      blockchainTx: t.blockchainTx,
      customerInfo: `customer_***${Math.floor(Math.random() * 1000)}`
    }));

  res.json({
    totalTransactions: recentTransactions.length,
    successfulTransactions: recentTransactions.filter(t => t.success).length,
    fraudAttempts: recentFraud.length,
    mfaUsage: recentMfa.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    recentTransactions: formattedTransactions,
    dailyStats: dailyStatsArray,
    fraudPatterns,
    blockchainTransactions
  });
});

// Create Stripe Payment Intent with MFA check
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { merchantId, orderId, amount, currency = 'usd' } = req.body;
    const threshold = merchantThresholds[merchantId] || merchantThresholds.default;
    const mfaRequired = amount > threshold;
    
    console.log(`� Creating Payment Intent: Order ${orderId}, Amount $${amount}, MFA ${mfaRequired ? 'REQUIRED' : 'NOT REQUIRED'}`);
    
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      confirmation_method: 'automatic', // Allow frontend confirmation
      confirm: false, // Don't auto-confirm, wait for frontend
      metadata: {
        orderId,
        merchantId,
        mfaRequired: mfaRequired.toString(),
        payshieldProcessed: 'true'
      }
    });

    // Only record transaction for non-MFA transactions (MFA transactions recorded after verification)
    if (!mfaRequired) {
      recordTransaction('transaction', {
        merchantId,
        orderId,
        amount,
        success: true,
        mfaUsed: false,
        method: 'none',
        riskScore: 'low',
        stripePaymentIntentId: paymentIntent.id
      });
    }

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      mfaRequired,
      methods: mfaRequired ? ['otp'] : [],
      orderId,
      threshold,
      requiresAction: mfaRequired
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: error.message 
    });
  }
});

// Send OTP
app.post('/api/send-otp', (req, res) => {
  const { orderId, amount } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[orderId] = { 
    code: otp, 
    expires: Date.now() + 300000, // 5 min
    amount: amount || 0
  };
  
  console.log(`📱 OTP for order ${orderId}: ${otp}`);
  
  res.json({ success: true, message: 'OTP sent (check terminal)' });
});

// Verify OTP and confirm Stripe payment
app.post('/api/verify-otp', async (req, res) => {
  const { merchantId, orderId, otp, paymentIntentId } = req.body;
  
  const stored = otpStore[orderId];
  if (!stored) {
    // Record failed MFA attempt
    recordTransaction('fraud', {
      merchantId,
      orderId,
      reason: 'OTP expired or not found',
      amount: 0,
      riskScore: 'medium'
    });
    return res.json({ success: false, message: 'OTP expired or not found' });
  }
  
  if (stored.code !== otp) {
    // Record failed MFA attempt
    recordTransaction('fraud', {
      merchantId,
      orderId,
      reason: 'Invalid OTP provided',
      amount: stored.amount || 0,
      riskScore: 'high'
    });
    return res.json({ success: false, message: 'Invalid OTP' });
  }
  
  if (Date.now() > stored.expires) {
    delete otpStore[orderId];
    // Record failed MFA attempt
    recordTransaction('fraud', {
      merchantId,
      orderId,
      reason: 'OTP expired during verification',
      amount: stored.amount || 0,
      riskScore: 'medium'
    });
    return res.json({ success: false, message: 'OTP expired' });
  }
  
  delete otpStore[orderId];
  
  // Generate receipt
  const timestamp = Date.now();
  const receiptId = ethers.hexlify(ethers.randomBytes(16));
  const dataString = `${merchantId}|${orderId}|${timestamp}|otp|${receiptId}`;
  const approvalHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
  
  console.log(`✅ OTP Verified for order ${orderId}`);
  console.log(`📝 Approval Hash: ${approvalHash}`);
  
  // Log to blockchain
  let blockchainTx = null;
  if (contract) {
    try {
      console.log(`⛓️  Logging to blockchain...`);
      const tx = await contract.logMfa(approvalHash);
      console.log(`📤 Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ Transaction confirmed!`);
      
      // Invalidate blockchain cache to fetch new transactions immediately
      blockchainCache.lastFetch = 0;
      console.log(`🔄 Blockchain cache invalidated - new transaction will appear on next fetch`);
      
      blockchainTx = {
        hash: tx.hash,
        explorerUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`
      };
    } catch (error) {
      console.error(`❌ Blockchain error:`, error.message);
    }
  } else {
    console.log(`⚠️  Contract not deployed - skipping blockchain log`);
  }

  // Record successful MFA transaction
  recordTransaction('mfa', {
    merchantId,
    orderId,
    method: 'otp',
    success: true,
    amount: stored.amount || 0,
    riskScore: 'low'
  });

  // Note: Stripe payment confirmation is handled on frontend after MFA verification

  // Record successful transaction
  recordTransaction('transaction', {
    merchantId,
    orderId,
    amount: stored.amount || 0,
    success: true,
    mfaUsed: true,
    method: 'otp',
    riskScore: 'low',
    blockchainTx: blockchainTx?.hash,
    stripePaymentIntentId: paymentIntentId
  });
  
  res.json({
    success: true,
    mfaReceipt: {
      merchantId,
      orderId,
      method: 'otp',
      timestamp,
      receiptId,
      approvalHash,
      blockchainTx
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 PayShield Backend running on http://localhost:${PORT}`);
  console.log(`💼 Wallet: ${wallet.address}`);
  console.log(`⛓️  Contract: ${process.env.CONTRACT_ADDRESS || 'NOT DEPLOYED YET'}`);
  console.log(`\n📍 Open http://localhost:${PORT} to test\n`);
});

