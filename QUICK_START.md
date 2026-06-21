# DocPower Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Git installed

---

## Step 1: Install Dependencies

### Backend
```bash
cd docpower-backend
npm install
```

### Frontend
```bash
cd my-app
npm install
```

---

## Step 2: Configure Environment

Environment files are already created with default values. No action needed unless you want to customize.

**Backend**: `docpower-backend/.env`
**Frontend**: `my-app/.env.local`

---

## Step 3: Start the Servers

### Terminal 1 - Backend (Port 3001)
```bash
cd docpower-backend
npm run dev
```

Expected output:
```
🚀 DocPower Backend Server is running on http://localhost:3001
📚 Document Search API: http://localhost:3001/api/documents/search
🔧 Admin API: http://localhost:3001/api/admin/documents
💊 Health Check: http://localhost:3001/health
```

### Terminal 2 - Frontend (Port 3000)
```bash
cd my-app
npm run dev
```

Expected output:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
```

---

## Step 4: Access the Application

Open your browser and navigate to:
**http://localhost:3000**

### Default Login Credentials

**Admin User**:
- Username: `a.mohammadi`
- Password: (check backend mock users)

**Regular User**:
- Username: `s.ahmadi`
- Password: (check backend mock users)

---

## Step 5: Test Features

### ✅ Admin Dashboard (`/admin`)
1. **Upload Document**
   - Click "افزودن سند"
   - Upload a .docx file
   - Fill in metadata
   - Submit

2. **View Documents**
   - See document library
   - Delete documents
   - View statistics

3. **System Logs**
   - Navigate to logs section
   - View real-time system events
   - Check statistics

4. **User Management**
   - Navigate to user access control
   - Create new users
   - Change roles
   - Toggle status

### ✅ User Dashboard (`/user`)
1. **Browse Documents**
   - View document list
   - Click to see details

2. **Search Documents**
   - Navigate to search
   - Try different modes:
     - Simple search
     - IR search
     - RAG search

3. **AI Assistant**
   - Click AI assistant icon
   - Ask questions in Persian
   - Try: "ضریب همزمانی چیست؟"

4. **Filter Documents**
   - Use filter sidebar
   - Select issuing bodies
   - Select technical domains
   - Apply filters

5. **Notifications**
   - Check notification bell
   - View unread count
   - Click to see notifications

---

## 🧪 Testing API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Documents
```bash
curl http://localhost:3001/api/documents
```

### Search (Simple Mode)
```bash
curl "http://localhost:3001/api/search?q=مدیریت&mode=simple"
```

### Get Users
```bash
curl http://localhost:3001/api/users
```

### Get Logs
```bash
curl http://localhost:3001/api/logs
```

### Get Notifications
```bash
curl "http://localhost:3001/api/notifications?userId=1"
```

### AI Chat
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "ضریب همزمانی چیست؟"}'
```

---

## 📊 Feature Status

| Feature | Status | Location |
|---------|--------|----------|
| Authentication | ✅ Working | `/` |
| Document Upload | ✅ Working | `/admin` |
| Document Library | ✅ Working | `/admin` |
| Document Search | ✅ Working | `/user/search` |
| AI Assistant | ✅ Working | All user pages |
| System Logs | ✅ Working | `/admin` (logs section) |
| User Management | ✅ Working | `/admin` (users section) |
| Notifications | ✅ Working | Top navigation |
| Filters | ✅ Working | Search/browse pages |
| Document Details | ✅ Working | `/user/documents/:id` |

---

## 🐛 Troubleshooting

### Backend won't start
1. Check if port 3001 is free: `lsof -i :3001`
2. Kill process if needed: `kill -9 <PID>`
3. Check dependencies: `npm install`

### Frontend won't start
1. Check if port 3000 is free: `lsof -i :3000`
2. Kill process if needed: `kill -9 <PID>`
3. Check dependencies: `npm install`
4. Clear Next.js cache: `rm -rf .next`

### API calls failing
1. Verify backend is running on port 3001
2. Check `my-app/.env.local` has correct API URL
3. Check browser console for CORS errors
4. Verify backend CORS settings in `.env`

### Mock data not appearing
1. Backend services use in-memory mock data
2. Data resets on server restart
3. This is expected behavior for development

---

## 📚 Documentation

- **Complete Integration Guide**: `FRONTEND_BACKEND_INTEGRATION.md`
- **Backend Architecture**: `docpower-backend/ARCHITECTURE.md`
- **Search Implementation**: `docpower-backend/REFACTORING_SUMMARY.md`
- **Previous Work**: `IMPLEMENTATION_COMPLETE.md`

---

## 🎯 What's Working

### Backend APIs (23 endpoints)
- ✅ Authentication (2)
- ✅ Documents (6)
- ✅ Search (2)
- ✅ Users (6)
- ✅ Logs (3)
- ✅ Notifications (4)
- ✅ AI Chat (2)
- ✅ Filters (2)

### Frontend Components (9 connected)
- ✅ AuthContext
- ✅ DocumentLibrary
- ✅ UploadDocument
- ✅ Overview (Admin Dashboard)
- ✅ SystemLogs
- ✅ UserAccessControl
- ✅ User Dashboard
- ✅ DocumentDetail
- ✅ Search Page
- ✅ AIAssistant
- ✅ TopNavigation (Notifications)

---

## 🔄 Data Flow

```
User Action (Frontend)
    ↓
React Component (useState, useEffect)
    ↓
API Service (my-app/src/app/services/api.ts)
    ↓
HTTP Request (fetch)
    ↓
Express Route (docpower-backend/src/routes/*.routes.ts)
    ↓
Controller (docpower-backend/src/controllers/*.controller.ts)
    ↓
Service (docpower-backend/src/services/*.service.ts)
    ↓
Mock Data / Database
    ↓
Response (JSON)
    ↓
Frontend Update (setState)
    ↓
UI Re-render
```

---

## 🎨 UI Features

- ✅ Dark mode support
- ✅ RTL (Right-to-Left) for Persian text
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Empty states
- ✅ Bilingual (Persian/English)

---

## 🔐 Security Notes

Current setup is for **development only**:
- Mock authentication (no real password hashing)
- In-memory data (resets on restart)
- No rate limiting
- CORS open to localhost
- Simple JWT secret

For production, implement:
- Real database with Prisma
- Password hashing (bcrypt)
- Proper JWT management
- Rate limiting
- HTTPS
- Environment-specific secrets

---

## ✨ Ready to Code!

Everything is set up and working. Start developing new features or customize existing ones.

**Happy Coding! 🚀**
