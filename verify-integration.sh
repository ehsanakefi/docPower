#!/bin/bash

# DocPower Integration Verification Script
# This script verifies that all backend endpoints are working correctly

echo "🔍 DocPower Backend Integration Verification"
echo "============================================"
echo ""

BASE_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response)"
    fi
}

# Check if backend is running
echo "Checking if backend is running on $BASE_URL..."
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${RED}✗ Backend is not running on $BASE_URL${NC}"
    echo "Please start the backend server first:"
    echo "  cd docpower-backend && npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Backend is running${NC}"
echo ""

# Health Check
echo "=== Health Check ==="
test_endpoint "GET" "/health" "Health endpoint"
echo ""

# Document Endpoints
echo "=== Document Endpoints ==="
test_endpoint "GET" "/api/documents" "Get all documents"
test_endpoint "GET" "/api/documents/1" "Get document by ID"
echo ""

# Search Endpoints
echo "=== Search Endpoints ==="
test_endpoint "GET" "/api/search?q=test&mode=simple" "Simple search"
test_endpoint "GET" "/api/search?q=test&mode=ir" "IR search"
test_endpoint "GET" "/api/search?q=test&mode=rag" "RAG search"
echo ""

# User Endpoints
echo "=== User Endpoints (NEW) ==="
test_endpoint "GET" "/api/users" "Get all users"
test_endpoint "GET" "/api/users/stats" "Get user statistics"
test_endpoint "GET" "/api/users/1" "Get user by ID"
echo ""

# Logs Endpoints
echo "=== Logs Endpoints (NEW) ==="
test_endpoint "GET" "/api/logs" "Get all logs"
test_endpoint "GET" "/api/logs/stats" "Get log statistics"
test_endpoint "GET" "/api/logs?type=error" "Get error logs"
echo ""

# Notifications Endpoints
echo "=== Notifications Endpoints (NEW) ==="
test_endpoint "GET" "/api/notifications?userId=1" "Get user notifications"
test_endpoint "GET" "/api/notifications/unread-count?userId=1" "Get unread count"
echo ""

# AI Assistant Endpoints
echo "=== AI Assistant Endpoints (NEW) ==="
test_endpoint "POST" "/api/ai/chat" "Send AI message" '{"message":"ضریب همزمانی چیست؟"}'
echo ""

# Filter Endpoints
echo "=== Filter Endpoints (NEW) ==="
test_endpoint "GET" "/api/filter/documents" "Get filtered documents"
test_endpoint "GET" "/api/filter/options" "Get filter options"
echo ""

# Summary
echo "============================================"
echo "Verification complete!"
echo ""
echo "Next steps:"
echo "1. Start the frontend: cd my-app && npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Test the UI components"
echo ""
echo "Documentation:"
echo "- Quick Start: QUICK_START.md"
echo "- Full Integration Guide: FRONTEND_BACKEND_INTEGRATION.md"
echo "- Summary: INTEGRATION_SUMMARY.md"
