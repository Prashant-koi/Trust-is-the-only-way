#!/bin/bash
# filepath: c:\Users\koira\Trust-is-only-way\sdk\scripts\dev.sh
echo "🚀 Starting TrustJS development..."

# Install dependencies
npm install

# Start development build with watch mode
npm run dev &

# Start example server
cd examples/react-basic && npm install && npm start