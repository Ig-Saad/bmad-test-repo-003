# 🚀 Epic 1 - Local Development Setup Guide

## Complete setup instructions for BMad v6 POC - Epic 1 Implementation

---

## 📋 **Prerequisites Installation**

### **1. Node.js 18+ (LTS Recommended)**
```powershell
# Download and install from: https://nodejs.org/
# Verify installation:
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### **2. PostgreSQL 13+**
```powershell
# Download from: https://www.postgresql.org/download/windows/
# During installation:
# - Set postgres user password (remember this!)
# - Default port: 5432
# - Include pgAdmin and command line tools

# Verify installation:
psql --version  # Should show PostgreSQL 13.x or higher
```

### **3. Redis 6+ (REQUIRED for Epic 1 Performance)**

**🎯 RECOMMENDED: Chocolatey Installation (Installs Memurai - Windows Redis)**
```powershell
# Install using Chocolatey (easiest method)
choco install redis-64 -y

# This installs Memurai (Windows-compatible Redis implementation)
# Memurai automatically starts as a Windows service

# Verify installation:
Get-Service -DisplayName "*Memurai*"
# Should show: Status=Running, Name=Memurai, DisplayName=Memurai

# Test connection:
Test-NetConnection -ComputerName localhost -Port 6379
# Should show: TcpTestSucceeded = True
```

**Alternative A: Manual Redis for Windows**
```powershell
# Download from: https://github.com/tporadowski/redis/releases
# Download: Redis-x64-5.0.14.1.msi (or latest)
# Install with default settings, start as Windows service

# Verify service:
Get-Service -Name "*redis*"
```

**Alternative B: WSL2 + Ubuntu**
```powershell
# Enable WSL2 first, then:
wsl --install -d Ubuntu

# In WSL2 terminal:
sudo apt update
sudo apt install redis-server
redis-server --daemonize yes

# Test from Windows:
Test-NetConnection -ComputerName localhost -Port 6379
```

**Alternative C: Docker (If you prefer containers)**
```powershell
# Install Docker Desktop first
docker run --name redis-local -p 6379:6379 -d redis:6-alpine

# Verify:
docker ps
Test-NetConnection -ComputerName localhost -Port 6379
```

**🔧 RedisInsight GUI Tool (Optional but Recommended)**
```powershell
# If you have RedisInsight installed, connect with:
# Host: localhost
# Port: 6379
# Database Alias: Epic1-BMad-Cache
# No password required for local setup
```

---

## 🏗️ **Project Setup Steps**

### **1. Repository Setup**
```powershell
# Navigate to your project
cd "d:\Web_UI_Upstream_with_v6"

# Verify bmm framework structure exists
ls bmm\agents\    # Should show: analyst.md, architect.md, dev.md, etc.
ls bmm\workflows\ # Should show workflow directories
```

### **2. Dependencies Installation**
```powershell
# Backend dependencies
cd src\backend
npm install

# Frontend dependencies
cd ..\frontend
npm install

# Return to project root
cd ..\..
```

### **3. Database Setup (PostgreSQL)**
```powershell
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database and user (in psql prompt):
CREATE DATABASE ignis_web;
CREATE USER ignis_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE ignis_web TO ignis_user;
\q

# Initialize database schema
cd src\backend
npx prisma migrate dev --name init
npx prisma generate

# Verify database setup:
psql -U ignis_user -d ignis_web -h localhost
\dt  # Should show tables created by Prisma
\q
```

### **4. Environment Configuration**

**Backend Environment (`src/backend/.env`)**
```env
# Database Configuration (Updated with ignis_web)
DATABASE_URL="postgresql://ignis_user:secure_password_123@localhost:5432/ignis_web"

# Redis Configuration (REQUIRED - MUST BE ENABLED)
REDIS_ENABLED=true
REDIS_URL="redis://localhost:6379"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=""  # Leave empty for local setup

# JWT Configuration
JWT_SECRET="epic1-super-secure-jwt-secret-key-bmad-v6-2024"

# Microsoft EntraID/Azure AD (Story 1.2)
# Get these from Azure Portal > App registrations
AZURE_CLIENT_ID="your-azure-app-client-id"
AZURE_CLIENT_SECRET="your-azure-app-client-secret"
AZURE_TENANT_ID="your-azure-tenant-id"
AZURE_REDIRECT_URI="http://localhost:3000/api/auth/callback"

# External Services (Story 1.3)
# GitHub Personal Access Token
GITHUB_TOKEN="ghp_your-github-personal-access-token"
GITHUB_API_BASE_URL="https://api.github.com"

# SharePoint Configuration
SHAREPOINT_SITE_URL="https://yourorg.sharepoint.com/sites/yoursite"
SHAREPOINT_CLIENT_ID="your-sharepoint-app-id"
SHAREPOINT_CLIENT_SECRET="your-sharepoint-app-secret"

# Ignis Platform Integration
IGNIS_PLATFORM_API_KEY="your-ignis-api-key"
IGNIS_PLATFORM_BASE_URL="https://api.ignis-platform.com"

# BMad Framework (Story 1.4) - CRITICAL
BMAD_FRAMEWORK_PATH="../../bmm"

# Server Configuration
PORT=3001
HOST="localhost"
NODE_ENV=development
LOG_LEVEL=info

# Performance Settings
CACHE_TTL=300  # 5 minutes cache for Redis
MAX_CONCURRENT_REQUESTS=100
```

**Frontend Environment (`src/frontend/.env`)**
```env
# React App Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001

# Azure AD Configuration (must match backend)
REACT_APP_AZURE_CLIENT_ID=your-azure-app-client-id
REACT_APP_AZURE_TENANT_ID=your-azure-tenant-id
REACT_APP_AZURE_REDIRECT_URI=http://localhost:3002/auth/callback

# Feature Flags
REACT_APP_ENABLE_BMAD_FRAMEWORK=true
REACT_APP_ENABLE_EXTERNAL_SERVICES=true
REACT_APP_DEBUG_MODE=true
```

---

## 🚦 **Start Services (3 Terminal Setup)**

### **Terminal 1: Redis Server**
```powershell
# Memurai/Redis should already be running as Windows service
# Verify it's running:
Get-Service -DisplayName "*Memurai*", "*Redis*"
# Should show: Status = Running

# Test connection:
Test-NetConnection -ComputerName localhost -Port 6379
# Should show: TcpTestSucceeded = True

# If not running, start the service:
Start-Service Memurai
# OR for manual Redis:
# redis-server --port 6379

# Alternative verification (if redis-cli available):
# redis-cli ping
# Expected: PONG
```

### **Terminal 2: Backend API Server**
```powershell
cd "d:\Web_UI_Upstream_with_v6\src\backend"

# Start in development mode
npm run dev

# Expected output:
# [INFO] BMad v6 Framework Integration initialized successfully
# [INFO] Successfully loaded X BMad v6 agents
# [INFO] Successfully loaded X BMad v6 templates
# [INFO] Successfully loaded 3 BMad v6 workflows
# [INFO] Server listening at http://localhost:3001
```

### **Terminal 3: Frontend Development Server**
```powershell
cd "d:\Web_UI_Upstream_with_v6\src\frontend"

# Start React development server (IMPORTANT: Use 'dev' not 'start')
npm run dev

# Expected output:
# ▲ Next.js 14.2.5
# - Local:        http://localhost:3002
# - Experiments (use with caution): forceSwcTransforms
# ✓ Ready in 2.1s
```

**💡 Important Note:**
- `npm run dev` = Development mode (hot reload, debugging)
- `npm start` = Production mode (requires `npm run build` first)
- **Always use `npm run dev` for local development!**

---

## ✅ **Verification & Testing Steps**

### **1. Basic Health Checks**
```powershell
# API Health Check
curl http://localhost:3001/health
# Expected: {"status":"healthy","timestamp":"...","services":{"database":{"status":"healthy"},"redis":{"status":"healthy"}}}

# Test Redis Connection via Backend
Test-NetConnection -ComputerName localhost -Port 6379
# Expected: TcpTestSucceeded = True

# Verify BMad Framework Integration
curl http://localhost:3001/api/v1/bmad/health
# Expected: {"success":true,"health":{"initialized":true,"agentCount":12,"templateCount":X,"workflowTypeCount":3}}
```

### **2. Story 1.4 - BMad Framework Integration Tests**
```powershell
# Framework Health Check (No auth required)
curl http://localhost:3001/api/v1/bmad/health
# Expected: {"success":true,"health":{"initialized":true,"agentCount":12,"templateCount":X,"workflowTypeCount":3}}

# Test Agent Loading (No auth required for basic endpoint)
curl http://localhost:3001/api/v1/bmad/agents
# Expected: {"success":true,"agents":[...]} - Array of 12 BMad agents with metadata

# Test Template System (No auth required)
curl http://localhost:3001/api/v1/bmad/templates
# Expected: {"success":true,"templates":[...]} - Array of templates from bmm/workflows and bmm/docs

# Test Workflow Definitions (No auth required)
curl http://localhost:3001/api/v1/bmad/workflows
# Expected: {"success":true,"workflows":[{"id":"quick_flow",...}, {"id":"bmad_method",...}, {"id":"brownfield",...}]}
```

### **3. Story 1.2 - Authentication System Tests**
```powershell
# Test JWT Token Generation
curl -X POST http://localhost:3001/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","role":"developer"}'
# Expected: {"token":"eyJ...","expiresIn":"7d"}

# Test Protected Route
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/v1/auth/profile
# Expected: User profile with role-based permissions
```

### **4. Story 1.3 - External Services Tests**
```powershell
# Test GitHub Integration (requires valid GitHub token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/v1/config/github/validate
# Expected: {"status":"valid","user":"your-github-username","scopes":[...]}

# Test Configuration Management
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/v1/config
# Expected: Configuration object with external service status
```

---

## 🧪 **Running Test Suites**

### **Backend Tests**
```powershell
cd src\backend

# Run all Epic 1 tests
npm test

# Run specific story tests:
npm test auth.test.ts                    # Story 1.2
npm test config-simple.test.ts           # Story 1.3
npm test bmad-framework-simple.test.ts   # Story 1.4

# Run with coverage
npm run test:coverage
```

### **Frontend Tests**
```powershell
cd src\frontend

# Run all frontend tests
npm test

# Run specific component tests:
npm test auth.test.tsx    # Authentication components
npm test config.test.tsx  # Configuration components

# Run in watch mode
npm test -- --watch
```

---

## 📊 **Performance Benchmarks (Epic 1 Requirements)**

Expected performance after successful setup:

- **Agent Loading:** < 1 second (target: ~850ms) ✅
- **Template Access:** < 500ms (target: ~420ms) ✅
- **Workflow Operations:** < 200ms (target: ~150ms) ✅
- **Context-Aware Agent Selection:** < 2 seconds (target: ~1.8s) ✅
- **Redis Cache Hit Ratio:** > 90% ✅

### **Performance Testing Commands**
```powershell
# Measure agent loading performance (First call - cache miss)
curl -w "@curl-format.txt" http://localhost:3001/api/v1/bmad/agents

# Measure agent loading performance (Second call - cache hit)
curl -w "@curl-format.txt" http://localhost:3001/api/v1/bmad/agents

# Measure template loading performance
curl -w "@curl-format.txt" http://localhost:3001/api/v1/bmad/templates

# Create curl-format.txt for timing:
echo "     time_namelookup:  %{time_namelookup}\n      time_connect:  %{time_connect}\n   time_appconnect:  %{time_appconnect}\n  time_pretransfer:  %{time_pretransfer}\n     time_redirect:  %{time_redirect}\n time_starttransfer:  %{time_starttransfer}\n                     ----------\n         time_total:  %{time_total}\n" > curl-format.txt
```

---

## 🚨 **Troubleshooting Guide**

### **Database Issues**
```powershell
# Check PostgreSQL service status
Get-Service postgresql*

# Test direct connection
psql -U ignis_user -d ignis_web -h localhost
# If connection fails, check:
# 1. PostgreSQL service is running
# 2. User credentials are correct
# 3. Database exists

# Reset database if needed:
psql -U postgres
DROP DATABASE ignis_web;
CREATE DATABASE ignis_web;
GRANT ALL PRIVILEGES ON DATABASE ignis_web TO ignis_user;
\q
cd src\backend
npx prisma migrate reset --force
```

### **Redis Connection Issues**
```powershell
# Check if Memurai/Redis service is running
Get-Service -DisplayName "*Memurai*", "*Redis*"
# Expected: Status = Running

# Test Redis connection
Test-NetConnection -ComputerName localhost -Port 6379
# Expected: TcpTestSucceeded = True

# If Redis not responding:
# Start the service:
Start-Service Memurai
# OR restart if needed:
Restart-Service Memurai

# Alternative: Install via Chocolatey if missing:
choco install redis-64 -y

# Check Redis logs (Windows):
# Event Viewer > Applications and Services Logs > Memurai

# If redis-cli is available, test functionality:
# redis-cli ping
# Should return: PONG
```

### **BMad Framework Loading Issues**
```powershell
# Verify bmm directory structure
ls bmm\agents\*.md
# Should show: analyst.md, architect.md, dev.md, pm.md, sm.md, tea.md, tech-writer.md, ux-designer.md

ls bmm\workflows\
# Should show workflow directories

# Check backend logs for framework errors:
cd src\backend
npm run dev
# Look for: "BMad v6 Framework Integration initialized successfully"
```

### **Frontend Build/Start Issues**
```powershell
# ERROR: "Could not find a production build in the '.next' directory"
# CAUSE: Using 'npm start' instead of 'npm run dev'

# SOLUTION 1: Use development mode (recommended for local dev)
cd src\frontend
npm run dev              # ✅ Correct for development

# SOLUTION 2: Build for production (if you really need production mode)
cd src\frontend
npm run build           # Build the production version
npm start               # Then start production server

# Clear Next.js cache if having issues:
cd src\frontend
rm -rf .next            # Remove build cache
npm run dev             # Start fresh

# Check package.json scripts:
# "dev": "next dev -p 3002"     ← Development mode
# "build": "next build"         ← Production build
# "start": "next start -p 3002" ← Production server
```

### **Port Conflicts**
```powershell
# Check what's using ports
netstat -ano | findstr :3001  # Backend API
netstat -ano | findstr :3002  # Frontend React
netstat -ano | findstr :6379  # Redis/Memurai
netstat -ano | findstr :5432  # PostgreSQL

# Kill process if needed:
taskkill /PID <process_id> /F

# Restart services if needed:
Restart-Service Memurai       # Redis
Get-Service postgresql* | Restart-Service  # PostgreSQL
```

---

## 👥 **Team Setup Sharing Checklist**

**Quick Onboarding for Team Members:**

- [ ] Install Node.js 18+, PostgreSQL 13+, Redis 6+
- [ ] Clone repository to local machine
- [ ] Run `npm install` in both `/src/backend` and `/src/frontend`
- [ ] Create local database: `ignis_web` with user `ignis_user`
- [ ] Copy environment files and configure credentials
- [ ] Run `npx prisma migrate dev` to setup database schema
- [ ] Start Redis server (verify with `redis-cli ping`)
- [ ] Start backend: `npm run dev` (check for BMad framework initialization)
- [ ] Start frontend: `npm start`
- [ ] Verify all services: `http://localhost:3001/health` (should show Redis & DB healthy)
- [ ] Run test suite: `npm test` (all tests should pass)

**Epic 1 Features to Validate:**
1. **Story 1.1:** ✅ Project structure and navigation
2. **Story 1.2:** ✅ Microsoft EntraID authentication flow
3. **Story 1.3:** ✅ GitHub/SharePoint/Ignis service configuration
4. **Story 1.4:** ✅ BMad agent selection and workflow execution

---

## 🎯 **Success Criteria**

Epic 1 is ready for manual testing when:

- ✅ All services start without errors
- ✅ BMad Framework loads 8 agents successfully
- ✅ Redis caching improves response times by 80%+
- ✅ All API endpoints respond within performance targets
- ✅ Test suites pass with >90% coverage
- ✅ Frontend connects to backend and displays BMad agents

**Ready for Epic 2 development!** 🚀

---

## 🔧 **Redis Setup & Monitoring Guide**

### **RedisInsight Integration (Optional GUI)**

**If you have RedisInsight installed:**
1. **Open RedisInsight Application**
2. **Add Database Connection:**
   - Host: `localhost`
   - Port: `6379`
   - Database Alias: `Epic1-BMad-Cache`
   - No authentication required
3. **Monitor Epic 1 Cache Keys:**
   - `bmad:agents:*` - Cached agent definitions
   - `bmad:templates:*` - Template system cache
   - `bmad:workflows:*` - Workflow definitions
   - `auth:*` - Authentication data
   - `config:*` - External service configs

### **Redis Performance Monitoring**
```powershell
# Test cache performance (if redis-cli available)
# redis-cli
# INFO memory
# INFO stats
# KEYS bmad:*
# EXIT

# Monitor via backend health endpoint
curl http://localhost:3001/health
# Look for: "redis":{"status":"healthy"}

# Performance test - First call (cache miss)
Measure-Command { Invoke-RestMethod http://localhost:3001/api/v1/bmad/agents }
# Should be ~200-400ms

# Performance test - Second call (cache hit)
Measure-Command { Invoke-RestMethod http://localhost:3001/api/v1/bmad/agents }
# Should be ~20-50ms (significant improvement!)
```

### **Redis Troubleshooting Commands**
```powershell
# Service management
Get-Service Memurai                    # Check status
Start-Service Memurai                  # Start service
Restart-Service Memurai                # Restart service
Stop-Service Memurai                   # Stop service

# Connection testing
Test-NetConnection localhost -Port 6379  # Test connection
netstat -ano | findstr :6379            # Check what's using port

# Reinstall if needed
choco uninstall redis-64 -y             # Remove
choco install redis-64 -y               # Reinstall

# Backend integration check
curl http://localhost:3001/health        # Should show redis.status=healthy
```

---

*Generated by BMad v6 Dev Agent (Amelia) - Epic 1 Implementation Guide*
*Updated: November 27, 2025 - Redis Integration Complete*