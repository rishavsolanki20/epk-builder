#!/bin/bash

echo "========================================"
echo "SoundKit EPK Builder - Installation"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if MongoDB is installed or running
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found. You'll need to:"
    echo "   - Install MongoDB locally, or"
    echo "   - Use MongoDB Atlas (cloud), or"
    echo "   - Run MongoDB in Docker: docker run -d -p 27017:27017 --name mongodb mongo"
fi

echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "Setting up environment variables..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please edit .env and update the following:"
    echo "   - SESSION_SECRET (use a random string)"
    echo "   - MONGODB_URI (if not using localhost)"
else
    echo "⚠️  .env file already exists. Skipping."
fi

echo ""
echo "Creating upload directories..."
mkdir -p uploads/photos
echo "✅ Upload directories created"

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Start the application:"
echo "   npm start         (production)"
echo "   npm run dev       (development with auto-reload)"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Read README.md for detailed documentation"
echo ""
