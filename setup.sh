#!/bin/bash
echo "🚀 Setting up IntellMeet..."

echo "📦 Installing server dependencies..."
cd server && npm install

echo "📦 Installing client dependencies..."
cd ../client && npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. cd server && cp .env.example .env"
echo "  2. Edit server/.env with your MongoDB URI and JWT secret"
echo "  3. Terminal 1: cd server && npm run dev"
echo "  4. Terminal 2: cd client && npm run dev"
echo ""
echo "🌐 App will be at: http://localhost:5173"
