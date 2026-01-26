#!/usr/bin/env bash
# Configuration Validation Script
# Run this to verify the API configuration is set up correctly

echo "🔍 Checking API Configuration Setup..."
echo ""

# Check if config file exists
if [ -f "src/config/apiConfig.js" ]; then
  echo "✅ Config file exists: src/config/apiConfig.js"
else
  echo "❌ Config file missing: src/config/apiConfig.js"
  exit 1
fi

# Check if .env.example exists
if [ -f ".env.example" ]; then
  echo "✅ .env.example exists"
else
  echo "❌ .env.example missing"
  exit 1
fi

# Check axios.js imports config
if grep -q "import { API_BASE_URL }" src/api/axios.js; then
  echo "✅ axios.js imports API_BASE_URL"
else
  echo "❌ axios.js doesn't import API_BASE_URL"
  exit 1
fi

# Check for hardcoded localhost URLs (excluding comments and config file)
if grep -r "baseURL:.*http://localhost" src/api/*.js | grep -v "apiConfig"; then
  echo "❌ Found hardcoded localhost URLs in API files"
  exit 1
else
  echo "✅ No hardcoded localhost URLs in API files"
fi

# Check if any fetch calls exist outside of axios
if grep -r "fetch(" src/ --include="*.js" --include="*.jsx" | grep -v "Fetch" | grep -v "fetch:"; then
  echo "⚠️  Found fetch() calls - verify they use axios instead"
else
  echo "✅ No raw fetch() calls found"
fi

echo ""
echo "✅ API Configuration Setup is Valid!"
echo ""
echo "📝 Next steps:"
echo "  1. Create .env.local with your backend URL"
echo "  2. Start the dev server: npm run dev"
echo "  3. Check console for: [API CONFIG] 🔧 API Configuration:"
echo ""
