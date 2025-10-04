# 🛡️ PayShield - Universal MFA Payment Layer

**Multi-Factor Authentication with Blockchain Transparency**

## ⚡ **Quick Start**

### **Immediate Testing (No Setup Required):**
```
http://localhost:3001  # Backend + Legacy Frontend (already running)
```

### **Modern Development Setup:**
```bash
# Windows (WSL) - Replace [YOUR_USERNAME] with your username
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way/frontend && npm install && npm run dev"

# Opens modern React frontend at http://localhost:3000 or 3002
```

### **Build Commands Summary:**
```bash
npm run frontend:install    # Install React frontend dependencies
npm run frontend:dev        # Start Vite dev server (React + HMR)
npm run frontend:build      # Build for production
npm run dev                 # Start both backend + frontend
```

## � **New Frontend Architecture**

This project has been **refactored** with a modern Vite + React frontend while preserving the existing backend and smart contracts.

### **Project Structure:**
```
├── backend.js              # Express server (unchanged)
├── contracts/              # Smart contracts (unchanged)  
├── public/                 # Legacy frontend (HTML/CSS/JS)
├── frontend/               # 🆕 NEW Vite + React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── dist/                   # Built frontend (auto-generated)
```

## 🚀 **Development Setup**

### **Prerequisites:**
- **Node.js & npm** - Install from [nodejs.org](https://nodejs.org/)
- **WSL** (for Windows users) - If PowerShell doesn't have npm/node access

### **Option 1: Quick Start (Legacy Frontend)**
If you just want to test the app immediately:
```bash
# Backend is already running at http://localhost:3001
# Just open your browser to test the MFA flow
```

### **Option 2: Full Modern Development Setup**

#### **Step 1: Install Dependencies**
```bash
# If using WSL (recommended for Windows):
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way && npm install"
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way/frontend && npm install"

# If using regular terminal with npm access:
npm install
cd frontend && npm install && cd ..
```

#### **Step 2: Development Mode (Dual Frontend)**
```bash
# Option A: Using WSL
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way && node backend.js" &
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way/frontend && npm run dev"

# Option B: Using npm scripts (if available)
npm run dev  # Starts both backend + frontend concurrently
```

This will start:
- **Backend API**: `http://localhost:3001`
- **Legacy Frontend**: `http://localhost:3001` (HTML/CSS/JS)
- **Modern Frontend**: `http://localhost:3000` or `http://localhost:3002` (React + Vite)

#### **Step 3: Production Build**
```bash
# Build optimized React frontend
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way/frontend && npm run build"

# Or using npm script:
npm run build

# Start production server (serves built frontend from /dist)
npm start
```

### **Build Architecture:**
- **Development**: Frontend dev server (port 3000/3002) + Backend API (port 3001)
- **Production**: Single backend serves both API and built frontend from `/dist`

## 🧪 **Testing the MFA Flow**

### **Low-Value Purchase (No MFA):**
1. Add **Wireless Mouse** ($79.99) → Immediate payment

### **High-Value Purchase (MFA Required):** ⭐
1. Add **Premium Laptop** ($1,299.99) 
2. Click **"Proceed to Secure Checkout"**
3. **MFA Modal appears** → Click **"📱 Send One-Time Code"**
4. **Check terminal** for OTP: `📱 OTP for order_XXX: 123456`
5. Enter code → **"✓ Verify Code"**
6. ✅ **Blockchain transaction recorded!**

## 📊 **System Status:**
- ✅ **Backend**: `http://localhost:3001` (Express.js)
- ✅ **Frontend**: Modern Vite + React architecture
- ✅ **Smart Contract**: `0x95493E1175Dc4966B6dCc865b6302e7B8704b319`
- ✅ **Blockchain**: Polygon Amoy Testnet
- ✅ **Database**: In-memory (for demo)

## 🔧 **Available Scripts**

### **Backend Scripts:**
```bash
npm run backend          # Start backend only (serves legacy frontend)
npm start               # Start production backend (serves from /dist if available)
```

### **Frontend Scripts:**
```bash
npm run frontend:install    # Install frontend dependencies
npm run frontend:dev        # Start Vite dev server only
npm run frontend:build      # Build optimized React frontend to /dist
npm run frontend:preview    # Preview production build locally
```

### **Combined Scripts:**
```bash
npm run dev             # Start both backend + frontend concurrently
npm run build           # Build production frontend
```

### **Blockchain Scripts:**
```bash
npm run deploy          # Deploy smart contract to Polygon Amoy
```

### **WSL Commands (Windows Users):**
```bash
# Backend
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way && node backend.js"

# Frontend Development
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way/frontend && npm run dev"

# Frontend Build
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way/frontend && npm run build"
```

## 🏗️ **Architecture Notes**

### **Smart Backend Detection:**
The backend automatically serves:
- `/dist` folder (if Vite build exists) 
- `/public` folder (legacy fallback)

### **API Integration:**
- Frontend uses environment variables for API URLs
- Vite proxy handles API calls during development
- Production build connects directly to backend

### **Blockchain Integration:**
- All MFA approvals logged to Polygon Amoy
- Immutable audit trail for compliance
- Real transaction links to PolygonScan

---

## 🛠️ **Build Troubleshooting**

### **Common Issues & Solutions:**

#### **"npm command not found" in PowerShell:**
```bash
# Use WSL instead:
wsl bash -c "cd /mnt/c/Users/[YOUR_USERNAME]/Trust-is-only-way && npm install"
```

#### **Port Already in Use:**
```bash
# Backend (3001): Kill existing process or restart terminal
# Frontend: Vite will automatically try ports 3000, 3002, 3003, etc.
```

#### **CORS Errors in Development:**
- Frontend dev server automatically proxies API calls to backend
- Check `frontend/vite.config.js` proxy configuration

#### **Production Build Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear frontend dependencies
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
```

#### **Missing Dependencies:**
```bash
# Install missing packages in frontend
cd frontend && npm install react react-dom @vitejs/plugin-react vite
```

### **Development vs Production:**
- **Development**: Two servers (API + Vite dev server with HMR)
- **Production**: Single server (backend serves built frontend from `/dist`)

## 🎉 **Ready for Production!**

The new architecture provides a solid foundation for:
- Advanced React features (hooks, context, routing)
- State management (Redux, Zustand)  
- Testing frameworks (Vitest, React Testing Library)
- UI libraries (Material-UI, Chakra UI)
- TypeScript migration

## 🔍 **Blockchain Information**

- **Smart Contract**: `0x95493E1175Dc4966B6dCc865b6302e7B8704b319`
- **Network**: Polygon Amoy Testnet
- **Explorer**: https://amoy.polygonscan.com/address/0x95493E1175Dc4966B6dCc865b6302e7B8704b319

## 🛠️ Architecture:

- **Frontend**: Pure HTML/JS (no frameworks, no module issues)
- **Backend**: Express.js with ethers.js for blockchain
- **Smart Contract**: Solidity deployed to Polygon Amoy
- **MFA**: OTP-based (6-digit codes in terminal)

## 💡 Key Features:

✅ **Zero Integration** - Drop-in solution  
✅ **Configurable Thresholds** - $500 default  
✅ **Blockchain Audit Trail** - Every MFA logged on-chain  
✅ **No PII Storage** - Only cryptographic hashes  
✅ **Instant Verification** - Real-time MFA  
✅ **Transparent Proofs** - Anyone can verify on-chain  

## 🔐 Security:

- OTP expires in 5 minutes
- Approval hashes are one-way (keccak256)
- No sensitive data on blockchain
- TLS for all API calls

## 📝 Technical Details:

**Approval Hash Generation:**
```
keccak256(merchantId|orderId|timestamp|method|receiptId)
```

**Smart Contract Event:**
```solidity
event MfaLogged(bytes32 indexed approvalHash, address indexed merchant, uint256 timestamp);
```

---

## 🎉 DEMO IS READY!

**Open http://localhost:3001 and try it now!**

