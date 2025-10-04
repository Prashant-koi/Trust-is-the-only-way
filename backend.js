const express = require('express');
const cors = require('cors');
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    blockchain: !!contract,
    wallet: wallet.address 
  });
});

// Preauth - check if MFA is required
app.post('/api/preauth', (req, res) => {
  const { merchantId, orderId, amount, currency } = req.body;
  const threshold = merchantThresholds[merchantId] || merchantThresholds.default;
  const mfaRequired = amount > threshold;
  
  console.log(`📋 Preauth: Order ${orderId}, Amount $${amount}, MFA ${mfaRequired ? 'REQUIRED' : 'NOT REQUIRED'}`);
  
  res.json({
    success: true,
    mfaRequired,
    methods: ['otp'],
    orderId,
    threshold
  });
});

// Send OTP
app.post('/api/send-otp', (req, res) => {
  const { orderId } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[orderId] = { code: otp, expires: Date.now() + 300000 }; // 5 min
  
  console.log(`📱 OTP for order ${orderId}: ${otp}`);
  
  res.json({ success: true, message: 'OTP sent (check terminal)' });
});

// Verify OTP and log to blockchain
app.post('/api/verify-otp', async (req, res) => {
  const { merchantId, orderId, otp } = req.body;
  
  const stored = otpStore[orderId];
  if (!stored) {
    return res.json({ success: false, message: 'OTP expired or not found' });
  }
  
  if (stored.code !== otp) {
    return res.json({ success: false, message: 'Invalid OTP' });
  }
  
  if (Date.now() > stored.expires) {
    delete otpStore[orderId];
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

