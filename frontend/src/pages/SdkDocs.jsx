import { useState } from 'react'
import { Code, Copy, Check, Book, Zap, Shield, Terminal, Package } from 'lucide-react'

function SdkDocs() {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language = 'javascript', id }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
        >
          {copiedCode === id ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-theme-text/60" />
          )}
        </button>
      </div>
      <pre className="bg-[#1a1a2e] border border-white/10 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-theme-text font-mono">{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="page-shell">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow">Developer Documentation</p>
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">
            TrustJS SDK
          </h1>
          <p className="text-lg text-theme-text/70 mb-8">
            Trust is the only way. Integrate blockchain-powered MFA verification into your payment flows in minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://github.com/trustjs/trust-mfa-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-theme-text font-medium rounded-lg transition-all duration-200 border border-white/20"
            >
              <Package className="h-5 w-5" />
              View on GitHub
            </a>
            <a
              href="/sdk/example.html"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 border border-purple-500"
            >
              <Zap className="h-5 w-5" />
              Live Demo
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <div className="glass-panel mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-text">Quick Start</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-3">Installation</h3>
              <CodeBlock
                id="install-npm"
                code={`npm install trust-mfa-sdk`}
              />
              <p className="text-sm text-theme-text/60 mt-2">Or include via CDN:</p>
              <CodeBlock
                id="install-cdn"
                code={`<script src="https://cdn.payshield.com/trust-mfa-sdk.js"></script>`}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-3">Basic Usage</h3>
              <CodeBlock
                id="basic-usage"
                code={`const mfa = new TrustMFA({
  apiUrl: 'https://api.trustjs.com',
  merchantId: 'your_merchant_id',
  threshold: 500 // MFA required for amounts > $500
});

// Request MFA verification
const result = await mfa.requestMfa({
  orderId: 'order_123',
  amount: 599.99,
  customerEmail: 'customer@example.com'
}, {
  onOtpSent: (response) => {
    console.log('OTP sent to customer');
  },
  onVerificationRequired: async (response) => {
    // Prompt user for OTP (custom UI)
    return await promptUserForOtp();
  }
});

if (result.success && result.verified) {
  console.log('MFA verified!');
  console.log('Blockchain TX:', result.blockchainTx);
  console.log('Approval Hash:', result.approvalHash);
}`}
              />
            </div>
          </div>
        </div>

        {/* API Reference */}
        <div className="glass-panel mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
              <Book className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-text">API Reference</h2>
          </div>

          <div className="space-y-8">
            {/* Constructor */}
            <div>
              <h3 className="text-xl font-semibold text-theme-text mb-4">Constructor</h3>
              <CodeBlock
                id="constructor"
                code={`new TrustMFA(options)`}
              />
              <div className="mt-4 space-y-3">
                <p className="text-theme-text/70">Options:</p>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex gap-3">
                    <code className="text-purple-400 font-mono text-sm">apiUrl</code>
                    <span className="text-theme-text/60 text-sm">(string) - Backend API URL (default: 'http://localhost:3001')</span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-purple-400 font-mono text-sm">merchantId</code>
                    <span className="text-theme-text/60 text-sm">(string) - Your merchant identifier (default: 'default')</span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-purple-400 font-mono text-sm">threshold</code>
                    <span className="text-theme-text/60 text-sm">(number) - Amount threshold for MFA (default: 500)</span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-purple-400 font-mono text-sm">onOtpRequired</code>
                    <span className="text-theme-text/60 text-sm">(function) - Global OTP handler callback</span>
                  </div>
                </div>
              </div>
            </div>

            {/* requestMfa */}
            <div>
              <h3 className="text-xl font-semibold text-theme-text mb-4">requestMfa(params, options)</h3>
              <p className="text-theme-text/70 mb-4">Request MFA verification for a transaction.</p>
              <CodeBlock
                id="request-mfa"
                code={`await mfa.requestMfa(params, options)`}
              />
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-theme-text/70 mb-2">Parameters:</p>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex gap-3">
                      <code className="text-cyan-400 font-mono text-sm">params.orderId</code>
                      <span className="text-theme-text/60 text-sm">(string, required) - Unique order identifier</span>
                    </div>
                    <div className="flex gap-3">
                      <code className="text-cyan-400 font-mono text-sm">params.amount</code>
                      <span className="text-theme-text/60 text-sm">(number, required) - Transaction amount</span>
                    </div>
                    <div className="flex gap-3">
                      <code className="text-cyan-400 font-mono text-sm">params.customerEmail</code>
                      <span className="text-theme-text/60 text-sm">(string, optional) - Customer email</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-theme-text/70 mb-2">Options:</p>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex gap-3">
                      <code className="text-green-400 font-mono text-sm">onOtpSent</code>
                      <span className="text-theme-text/60 text-sm">(function) - Called when OTP is sent</span>
                    </div>
                    <div className="flex gap-3">
                      <code className="text-green-400 font-mono text-sm">onVerificationRequired</code>
                      <span className="text-theme-text/60 text-sm">(function) - Called to get OTP from user</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-theme-text/70 mb-2">Returns: Promise&lt;Object&gt;</p>
                  <CodeBlock
                    id="response-format"
                    code={`{
  success: true,
  mfaRequired: true,
  verified: true,
  receipt: {
    merchantId: 'merchant_123',
    orderId: 'order_123',
    method: 'otp',
    timestamp: 1234567890,
    receiptId: '0x...',
    approvalHash: '0x...',
    blockchainTx: {
      hash: '0x...',
      explorerUrl: 'https://...'
    }
  },
  blockchainTx: { hash: '0x...', explorerUrl: '...' },
  approvalHash: '0x...',
  timestamp: 1234567890
}`}
                  />
                </div>
              </div>
            </div>

            {/* isMfaRequired */}
            <div>
              <h3 className="text-xl font-semibold text-theme-text mb-4">isMfaRequired(amount)</h3>
              <p className="text-theme-text/70 mb-4">Check if MFA is required for a given amount.</p>
              <CodeBlock
                id="is-mfa-required"
                code={`const required = mfa.isMfaRequired(599.99);
console.log(required); // true (if threshold is 500)`}
              />
            </div>

            {/* getAnalytics */}
            <div>
              <h3 className="text-xl font-semibold text-theme-text mb-4">getAnalytics()</h3>
              <p className="text-theme-text/70 mb-4">Get merchant analytics data.</p>
              <CodeBlock
                id="get-analytics"
                code={`const analytics = await mfa.getAnalytics();
console.log(analytics.totalTransactions);
console.log(analytics.blockchainTransactions);`}
              />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="glass-panel mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <Terminal className="h-5 w-5 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-text">Usage Examples</h2>
          </div>

          <div className="space-y-8">
            {/* React Example */}
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-3">React Integration</h3>
              <CodeBlock
                id="react-example"
                code={`import TrustMFA from 'trust-mfa-sdk';
import { useState } from 'react';

function CheckoutForm() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpResolver, setOtpResolver] = useState(null);

  const mfa = new TrustMFA({
    apiUrl: process.env.REACT_APP_MFA_API,
    merchantId: process.env.REACT_APP_MERCHANT_ID
  });

  const handleCheckout = async (order) => {
    const result = await mfa.requestMfa({
      orderId: order.id,
      amount: order.amount
    }, {
      onVerificationRequired: () => {
        return new Promise((resolve) => {
          setOtpResolver(() => resolve);
          setShowOtpModal(true);
        });
      }
    });

    if (result.success && result.verified) {
      console.log('Blockchain proof:', result.blockchainTx);
    }
  };

  return (
    <>
      <button onClick={() => handleCheckout(order)}>
        Complete Purchase
      </button>
      {showOtpModal && <OtpModal onSubmit={handleOtpSubmit} />}
    </>
  );
}`}
              />
            </div>

            {/* Node.js Example */}
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-3">Node.js Backend</h3>
              <CodeBlock
                id="nodejs-example"
                code={`const TrustMFA = require('trust-mfa-sdk');

const mfa = new TrustMFA({
  apiUrl: 'https://api.trustjs.com',
  merchantId: process.env.MERCHANT_ID
});

app.post('/api/checkout', async (req, res) => {
  const { orderId, amount, otp } = req.body;

  if (mfa.isMfaRequired(amount)) {
    const result = await mfa.requestMfa({
      orderId,
      amount
    }, {
      onVerificationRequired: async () => {
        return otp; // OTP from user
      }
    });

    if (!result.success || !result.verified) {
      return res.status(403).json({
        error: 'MFA verification failed'
      });
    }

    // Store blockchain receipt
    await db.orders.update(orderId, {
      mfaReceipt: result.receipt,
      blockchainProof: result.blockchainTx
    });
  }

  res.json({ success: true });
});`}
              />
            </div>

            {/* E-commerce Example */}
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-3">E-commerce Checkout</h3>
              <CodeBlock
                id="ecommerce-example"
                code={`const mfa = new TrustMFA({
  apiUrl: 'https://api.trustjs.com',
  merchantId: 'shop_12345'
});

async function processCheckout(order) {
  if (mfa.isMfaRequired(order.amount)) {
    const result = await mfa.requestMfa({
      orderId: order.id,
      amount: order.amount,
      customerEmail: order.customerEmail
    }, {
      onOtpSent: () => {
        showNotification('Verification code sent!');
      },
      onVerificationRequired: async () => {
        return await showOtpModal();
      }
    });

    if (!result.success || !result.verified) {
      throw new Error('MFA verification failed');
    }

    // Store blockchain proof
    order.mfaReceipt = result.receipt;
    order.blockchainProof = result.blockchainTx;
  }

  await processPayment(order);
}`}
              />
            </div>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="glass-panel">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-text">Security Best Practices</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-semibold text-theme-text mb-1">Never expose merchant secrets</h4>
                <p className="text-sm text-theme-text/60">Keep your merchant secret key secure on the backend. Never include it in client-side code.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-semibold text-theme-text mb-1">Verify MFA receipts</h4>
                <p className="text-sm text-theme-text/60">Always verify MFA receipts on your backend before processing payments.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold text-sm mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-semibold text-theme-text mb-1">Store blockchain proofs</h4>
                <p className="text-sm text-theme-text/60">Save blockchain transaction hashes for audit trails and dispute resolution.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-semibold text-theme-text mb-1">Implement rate limiting</h4>
                <p className="text-sm text-theme-text/60">Add rate limiting on OTP requests to prevent abuse and brute force attacks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm mt-0.5">
                5
              </div>
              <div>
                <h4 className="font-semibold text-theme-text mb-1">Use HTTPS</h4>
                <p className="text-sm text-theme-text/60">Always use HTTPS for all API communications to protect sensitive data in transit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SdkDocs
