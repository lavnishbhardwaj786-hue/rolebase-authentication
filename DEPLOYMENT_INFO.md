# Role-Based Authentication - Deployment Information

## Deployment Status: ✅ ACTIVE

### Public URLs

| Service | URL | Port |
|---------|-----|------|
| **Frontend (React App)** | https://3000-iibjp0j9kdjcepjskc8rq-4faaa289.sg1.manus.computer | 3000 |
| **Backend API** | https://5000-iibjp0j9kdjcepjskc8rq-4faaa289.sg1.manus.computer | 5000 |

### Backend Configuration

**Port:** 5000  
**Database:** MongoDB Atlas  
**Status:** ✅ Connected and Running

#### Environment Variables (Backend)
```
DB_PASSWORD=mongodb+srv://lavnishbhardwaj786_db_user:lavnishbhardwaj786_db_user2@cluster0.ua3hbry.mongodb.net/
JWT_SECRET=your_jwt_secret_key_change_this_in_production
data=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

**Port:** 3000  
**Build Tool:** Vite  
**Status:** ✅ Built and Running

#### Build Output
- Location: `/home/ubuntu/rolebase-authentication/frontend-new/dist`
- Size: ~320KB (gzipped: ~97.5KB)
- Modules: 65 transformed

### Application Features

The application includes:

1. **Authentication System**
   - User Registration
   - User Login with JWT tokens
   - Role-based access control

2. **Team Management**
   - Create teams
   - Add/remove team members
   - Transfer leadership

3. **Task Management**
   - Create tasks (Leaders only)
   - Assign tasks to team members
   - Real-time task updates via WebSocket
   - Task status tracking

4. **Real-time Features**
   - Socket.IO integration for live task updates
   - Team-based room management

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Teams
- Team management endpoints (CRUD operations)

#### Tasks
- Task creation, update, and deletion endpoints
- Real-time task synchronization

### Database Collections

- **Users** - User accounts with authentication
- **Teams** - Team information and members
- **Tasks** - Task assignments and status

### Testing the Application

1. **Access Frontend:** https://3000-iibjp0j9kdjcepjskc8rq-4faaa289.sg1.manus.computer
2. **Register a new account** with email and password
3. **Login** with your credentials
4. **Create a team** and invite members
5. **Create tasks** and assign them to team members
6. **Monitor real-time updates** as tasks are modified

### Important Notes

⚠️ **Security Considerations:**
- The JWT_SECRET should be changed to a strong random value in production
- MongoDB credentials are embedded in the connection string - consider using environment variables
- CORS is currently set to accept localhost - update this for production deployments
- The frontend Socket.IO URL is set to use the same origin as the server

### Troubleshooting

If you encounter issues:

1. **Backend not connecting:** Check MongoDB Atlas connection string and network access
2. **Frontend can't reach API:** Verify CORS settings match your frontend URL
3. **Socket.IO connection fails:** Ensure the backend URL is correctly configured in the frontend

### Process Management

**Backend Process ID:** 4661  
**Frontend Process ID:** 5885

To restart services:
```bash
# Restart backend
cd /home/ubuntu/rolebase-authentication/backend
npm start

# Restart frontend
cd /home/ubuntu/rolebase-authentication/frontend-new/dist
http-server -p 3000
```

---

**Deployment Date:** March 26, 2026  
**Deployment Environment:** Manus Sandbox  
**Status:** Active and Ready for Use
