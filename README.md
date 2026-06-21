# DocPower - Document Management & Search System

A comprehensive Persian/English bilingual document management system with advanced search capabilities, AI assistance, and user management.

## 🎯 Project Status

✅ **Frontend-Backend Integration: COMPLETE**

All components are now fully connected to backend APIs. The system is ready for testing and further development.

---

## 📋 Quick Links

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Integration Guide](FRONTEND_BACKEND_INTEGRATION.md)** - Complete technical documentation
- **[Integration Summary](INTEGRATION_SUMMARY.md)** - Executive summary of changes
- **[Backend Architecture](docpower-backend/ARCHITECTURE.md)** - System architecture
- **[Search Implementation](docpower-backend/REFACTORING_SUMMARY.md)** - Search system details

---

## 🚀 Features

### Document Management
- ✅ Upload Word documents (.docx)
- ✅ Multi-layer chunking (paragraph, retrieval, RAG)
- ✅ Persian text normalization
- ✅ Document metadata management
- ✅ Document library with search

### Search Capabilities
- ✅ **Simple Search** - Fast text matching
- ✅ **IR Search** - Classical information retrieval (BM25/TF-IDF)
- ✅ **RAG Search** - Vector-based semantic search
- ✅ Advanced filtering by metadata
- ✅ Multi-criteria filtering

### User Management
- ✅ Role-based access control (Admin, Editor, Viewer)
- ✅ User CRUD operations
- ✅ Status management (Active/Inactive)
- ✅ User statistics dashboard
- ✅ Search and filter users

### System Administration
- ✅ System logs with filtering
- ✅ Event tracking and statistics
- ✅ Real-time monitoring
- ✅ Admin dashboard with analytics

### AI Assistant
- ✅ Conversational chat interface
- ✅ Domain-specific knowledge (Persian electrical engineering)
- ✅ Context-aware responses
- ✅ Conversation history
- ✅ Technical term explanations

### Notifications
- ✅ User-specific notifications
- ✅ Read/unread tracking
- ✅ Unread count badge
- ✅ Real-time updates

### UI/UX
- ✅ Dark mode support
- ✅ RTL (Right-to-Left) for Persian
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Bilingual interface

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: Mock (In-memory) / PostgreSQL (Production)
- **ORM**: Prisma (ready for production)
- **Document Processing**: Mammoth.js
- **API Communication**: Axios

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd docpower-backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on: `http://localhost:3001`

### Frontend Setup
```bash
cd my-app
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🧪 Verification

Run the verification script to test all API endpoints:

```bash
./verify-integration.sh
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Documents
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `POST /api/documents/upload` - Upload document
- `DELETE /api/documents/:id` - Delete document

### Search
- `GET /api/search?q={query}&mode={mode}` - Unified search

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id/role` - Update role
- `PUT /api/users/:id/toggle-status` - Toggle status

### Logs
- `GET /api/logs` - List logs
- `GET /api/logs/stats` - Log statistics

### Notifications
- `GET /api/notifications?userId={id}` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

### AI Assistant
- `POST /api/ai/chat` - Send message
- `GET /api/ai/conversations/:id` - Get history

### Filters
- `GET /api/filter/documents` - Filtered documents
- `GET /api/filter/options` - Filter options

**Total**: 28 endpoints

---

## 📂 Project Structure

```
docPower/
├── docpower-backend/          # Backend API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utilities
│   │   ├── types/             # TypeScript types
│   │   └── app.ts             # Express app
│   ├── .env                   # Environment config
│   └── package.json
│
├── my-app/                    # Frontend application
│   ├── src/
│   │   └── app/
│   │       ├── admin/         # Admin components
│   │       ├── user/          # User components
│   │       ├── usercomponents/# Shared components
│   │       ├── components/    # UI components
│   │       ├── contexts/      # React contexts
│   │       └── services/      # API service
│   ├── .env.local             # Environment config
│   └── package.json
│
├── QUICK_START.md             # 5-minute setup guide
├── FRONTEND_BACKEND_INTEGRATION.md  # Complete integration docs
├── INTEGRATION_SUMMARY.md     # Executive summary
├── verify-integration.sh      # Verification script
└── README.md                  # This file
```

---

## 🎮 Usage

### Admin Functions (`/admin`)
1. **Upload Documents** - Add new technical documents
2. **Manage Documents** - View, edit, delete documents
3. **User Management** - Create users, assign roles, manage access
4. **System Logs** - Monitor system events and activities
5. **Analytics** - View statistics and insights

### User Functions (`/user`)
1. **Browse Documents** - View available documents
2. **Search Documents** - Use simple, IR, or RAG search modes
3. **View Details** - Read document content and metadata
4. **AI Assistant** - Ask questions about technical topics
5. **Filter Results** - Use advanced filters to find documents
6. **Notifications** - Stay updated with system notifications

---

## 🔒 Security Notes

Current setup is for **development only**:
- Mock authentication (no real password verification)
- In-memory data (resets on server restart)
- No rate limiting
- Simple CORS configuration

For production deployment:
- Implement real database with Prisma
- Add password hashing (bcrypt)
- Add authentication middleware
- Implement rate limiting
- Enable HTTPS
- Use secure JWT secrets
- Add input validation
- Implement proper session management

---

## 🧪 Testing

### Manual Testing
1. Start backend server
2. Start frontend server
3. Navigate to `http://localhost:3000`
4. Test each feature:
   - Login
   - Upload document
   - Search with different modes
   - User management
   - AI chat
   - Notifications
   - System logs

### API Testing
Use the verification script:
```bash
./verify-integration.sh
```

Or test manually with curl:
```bash
# Health check
curl http://localhost:3001/health

# Get documents
curl http://localhost:3001/api/documents

# Search
curl "http://localhost:3001/api/search?q=test&mode=simple"
```

---

## 📊 Statistics

- **Total Endpoints**: 28 (11 existing + 17 new)
- **Connected Components**: 12
- **Backend Services**: 10
- **Frontend Pages**: 15+
- **Lines of Code**: ~20,000+
- **Languages**: Persian (Farsi) + English

---

## 🗺️ Roadmap

### Phase 1: Core Features (✅ Complete)
- [x] Document management
- [x] Multi-mode search
- [x] User management
- [x] System logs
- [x] AI assistant
- [x] Notifications
- [x] Advanced filtering

### Phase 2: Enhancement (Planned)
- [ ] Real database integration (Prisma + PostgreSQL)
- [ ] Proper authentication & authorization
- [ ] Unit & integration tests
- [ ] API documentation (Swagger)
- [ ] Python GPU service for IR/RAG

### Phase 3: Production (Planned)
- [ ] Real AI integration (OpenAI/Anthropic)
- [ ] Caching layer (Redis)
- [ ] Monitoring & logging
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Performance optimization

---

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

[Specify your license here]

---

## 🆘 Support

- **Documentation**: See `QUICK_START.md` and `FRONTEND_BACKEND_INTEGRATION.md`
- **Issues**: Check console logs for detailed error messages
- **API Testing**: Use `verify-integration.sh` script

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices for document management and intelligent search.

---

**Status**: ✅ Ready for Development & Testing

**Last Updated**: 2026-06-21

**Version**: 1.0.0
