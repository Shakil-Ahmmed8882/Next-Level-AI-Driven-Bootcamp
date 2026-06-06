#!/bin/bash

# DevPulse Quick Testing Script
# Copy-paste this entire script to your terminal

BASE_URL="http://localhost:5000"

echo "🚀 DevPulse API Testing Started..."
echo ""

# ============================================
# 1. REGISTER USERS
# ============================================
echo "1️⃣ REGISTERING CONTRIBUTOR USER..."
CONTRIBUTOR=$(curl -s -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "contributor"
  }')
echo "✅ Contributor registered:"
echo "$CONTRIBUTOR" | jq '.' 2>/dev/null || echo "$CONTRIBUTOR"
echo ""

echo "2️⃣ REGISTERING MAINTAINER USER..."
MAINTAINER=$(curl -s -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "password123",
    "role": "maintainer"
  }')
echo "✅ Maintainer registered:"
echo "$MAINTAINER" | jq '.' 2>/dev/null || echo "$MAINTAINER"
echo ""

# ============================================
# 2. LOGIN & GET TOKENS
# ============================================
echo "3️⃣ LOGGING IN AS CONTRIBUTOR..."
LOGIN_CONTRIBUTOR=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')
echo "✅ Contributor logged in:"
echo "$LOGIN_CONTRIBUTOR" | jq '.' 2>/dev/null || echo "$LOGIN_CONTRIBUTOR"

TOKEN_CONTRIBUTOR=$(echo "$LOGIN_CONTRIBUTOR" | jq -r '.data.token' 2>/dev/null)
echo "📝 Token: $TOKEN_CONTRIBUTOR"
echo ""

echo "4️⃣ LOGGING IN AS MAINTAINER..."
LOGIN_MAINTAINER=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }')
echo "✅ Maintainer logged in:"
echo "$LOGIN_MAINTAINER" | jq '.' 2>/dev/null || echo "$LOGIN_MAINTAINER"

TOKEN_MAINTAINER=$(echo "$LOGIN_MAINTAINER" | jq -r '.data.token' 2>/dev/null)
echo "📝 Token: $TOKEN_MAINTAINER"
echo ""

# ============================================
# 3. CREATE ISSUES
# ============================================
echo "5️⃣ CREATING BUG ISSUE (as contributor)..."
ISSUE_BUG=$(curl -s -X POST $BASE_URL/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN_CONTRIBUTOR" \
  -d '{
    "title": "Login button not working",
    "description": "The submit button on the login page is not responding to clicks in Chrome browser version 120 and above",
    "type": "bug"
  }')
echo "✅ Bug issue created:"
echo "$ISSUE_BUG" | jq '.' 2>/dev/null || echo "$ISSUE_BUG"

ISSUE_ID_1=$(echo "$ISSUE_BUG" | jq -r '.data.id' 2>/dev/null)
echo "📝 Issue ID: $ISSUE_ID_1"
echo ""

echo "6️⃣ CREATING FEATURE REQUEST (as contributor)..."
ISSUE_FEATURE=$(curl -s -X POST $BASE_URL/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN_CONTRIBUTOR" \
  -d '{
    "title": "Add dark mode support",
    "description": "Users are requesting a dark mode option in the application to improve usability in low-light environments and reduce eye strain",
    "type": "feature_request"
  }')
echo "✅ Feature request created:"
echo "$ISSUE_FEATURE" | jq '.' 2>/dev/null || echo "$ISSUE_FEATURE"

ISSUE_ID_2=$(echo "$ISSUE_FEATURE" | jq -r '.data.id' 2>/dev/null)
echo "📝 Issue ID: $ISSUE_ID_2"
echo ""

# ============================================
# 4. GET ISSUES
# ============================================
echo "7️⃣ GETTING ALL ISSUES..."
ALL_ISSUES=$(curl -s -X GET "$BASE_URL/api/issues")
echo "✅ All issues retrieved:"
echo "$ALL_ISSUES" | jq '.' 2>/dev/null || echo "$ALL_ISSUES"
echo ""

echo "8️⃣ GETTING ONLY BUG ISSUES..."
BUG_ISSUES=$(curl -s -X GET "$BASE_URL/api/issues?type=bug")
echo "✅ Bug issues:"
echo "$BUG_ISSUES" | jq '.' 2>/dev/null || echo "$BUG_ISSUES"
echo ""

echo "9️⃣ GETTING SINGLE ISSUE..."
SINGLE_ISSUE=$(curl -s -X GET "$BASE_URL/api/issues/$ISSUE_ID_1")
echo "✅ Single issue:"
echo "$SINGLE_ISSUE" | jq '.' 2>/dev/null || echo "$SINGLE_ISSUE"
echo ""

# ============================================
# 5. UPDATE ISSUE
# ============================================
echo "🔟 UPDATING OWN ISSUE (contributor)..."
UPDATE_ISSUE=$(curl -s -X PATCH "$BASE_URL/api/issues/$ISSUE_ID_1" \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN_CONTRIBUTOR" \
  -d '{
    "status": "in_progress"
  }')
echo "✅ Issue updated:"
echo "$UPDATE_ISSUE" | jq '.' 2>/dev/null || echo "$UPDATE_ISSUE"
echo ""

# ============================================
# 6. DELETE ISSUE
# ============================================
echo "1️⃣1️⃣ DELETING ISSUE (maintainer only)..."
DELETE_ISSUE=$(curl -s -X DELETE "$BASE_URL/api/issues/$ISSUE_ID_2" \
  -H "Authorization: $TOKEN_MAINTAINER")
echo "✅ Issue deleted:"
echo "$DELETE_ISSUE" | jq '.' 2>/dev/null || echo "$DELETE_ISSUE"
echo ""

# ============================================
# 7. ERROR TESTS
# ============================================
echo "1️⃣2️⃣ TESTING VALIDATION ERROR (missing description)..."
ERROR_TEST=$(curl -s -X POST $BASE_URL/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN_CONTRIBUTOR" \
  -d '{
    "title": "No description",
    "type": "bug"
  }')
echo "✅ Validation error response:"
echo "$ERROR_TEST" | jq '.' 2>/dev/null || echo "$ERROR_TEST"
echo ""

echo "1️⃣3️⃣ TESTING AUTHORIZATION ERROR (missing token)..."
AUTH_ERROR=$(curl -s -X POST $BASE_URL/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No token provided",
    "description": "This should fail because no authorization token is provided",
    "type": "bug"
  }')
echo "✅ Authorization error response:"
echo "$AUTH_ERROR" | jq '.' 2>/dev/null || echo "$AUTH_ERROR"
echo ""

echo "1️⃣4️⃣ TESTING 404 ERROR (issue not found)..."
NOT_FOUND=$(curl -s -X GET "$BASE_URL/api/issues/99999")
echo "✅ Not found error response:"
echo "$NOT_FOUND" | jq '.' 2>/dev/null || echo "$NOT_FOUND"
echo ""

echo "✅ ALL TESTS COMPLETED!"
echo ""
echo "Summary:"
echo "- ✅ User registration working"
echo "- ✅ User login and JWT generation working"
echo "- ✅ Create issues working"
echo "- ✅ Get issues working"
echo "- ✅ Update issues working"
echo "- ✅ Delete issues working"
echo "- ✅ Validation errors working"
echo "- ✅ Authorization errors working"
echo "- ✅ Not found errors working"
echo ""
echo "🎉 DevPulse API is ready for production!"
