# IntellMeet Premium - Troubleshooting & FAQ Guide

## 🆘 Troubleshooting

### Development Setup Issues

#### Problem: Port 5173 (Client) Already in Use

**Solution:**
```bash
# Option 1: Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>

# Option 2: Use different port
cd client
npm run dev -- --port 5174
```

#### Problem: Port 5000 (Server) Already in Use

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>

# Or change server port in server/.env
PORT=5001
```

#### Problem: MongoDB Connection Failed

**Error Message**:
```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Start MongoDB service**:
   ```bash
   # Windows (if installed):
   net start MongoDB
   # or
   mongod

   # Mac (with Homebrew):
   brew services start mongodb-community

   # Linux:
   sudo systemctl start mongod
   ```

2. **Check MongoDB is running**:
   ```bash
   mongo --eval "db.adminCommand('ping')"
   ```

3. **Update connection string**:
   ```bash
   # Use MongoDB Atlas (cloud):
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/intellmeet
   ```

#### Problem: npm Dependencies Installation Failed

**Error Message**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

```bash
# Option 1: Use legacy peer deps flag
npm install --legacy-peer-deps

# Option 2: Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install

# Option 3: Use npm cache clean
npm cache clean --force
npm install
```

#### Problem: TypeScript Compilation Errors

**Solutions:**

1. **Check TypeScript version**:
   ```bash
   npx tsc --version
   ```

2. **Rebuild TypeScript**:
   ```bash
   npx tsc --noEmit
   ```

3. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules tsconfig.tsbuildinfo
   npm install
   npm run build
   ```

---

### Runtime Issues

#### Problem: WebSocket Connection Refused

**Error Message**:
```
WebSocket is closed before the connection is established
```

**Debugging Steps:**

1. **Check server is running**:
   ```bash
   curl http://localhost:5000/
   ```

2. **Verify Socket.IO path**:
   ```bash
   # Should return 0 (OK response)
   curl http://localhost:5000/socket.io/?transport=polling
   ```

3. **Check CORS configuration** in `server/index.js`:
   ```javascript
   cors: {
     origin: process.env.CLIENT_URL,
     credentials: true
   }
   ```

4. **Verify client URL in `.env`**:
   ```env
   VITE_SOCKET_URL=http://localhost:5000
   ```

#### Problem: API Endpoints Returning 404

**Solutions:**

1. **Check server is running**:
   ```bash
   ps aux | grep node
   ```

2. **Verify API URL in client `.env`**:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Check endpoint route exists** in `server/routes/`:
   ```bash
   grep -r "GET\|POST" server/routes/
   ```

4. **Verify routes are registered** in `server/index.js`:
   ```javascript
   app.use('/api/auth', require('./routes/auth'));
   app.use('/api/meetings', require('./routes/meetings'));
   // etc.
   ```

#### Problem: Authentication Token Expired

**Error Message**:
```
401 Unauthorized - Token expired
```

**Solutions:**

1. **Verify JWT_SECRET** is set:
   ```bash
   echo $JWT_SECRET  # or in server/.env
   ```

2. **Check token expiry time** in `server/utils/generateToken.js`:
   ```javascript
   expiresIn: process.env.JWT_EXPIRE || '7d'
   ```

3. **Implement token refresh**:
   - The client should automatically refresh expired tokens
   - Check `client/src/services/api.ts` has refresh interceptor

4. **Clear stored token** and re-login:
   ```javascript
   localStorage.removeItem('token');
   localStorage.removeItem('refreshToken');
   ```

#### Problem: Video/Audio Not Working in Meeting

**Debugging Steps:**

1. **Check browser permissions**:
   - Go to browser settings
   - Allow camera and microphone access
   - Refresh the page

2. **Verify WebRTC configuration**:
   - Check ICE servers in `.env`
   - Ensure STUN/TURN servers accessible

3. **Check console for errors**:
   - Open DevTools (F12)
   - Look for getUserMedia errors
   - Check Socket.IO connection status

4. **Test with local video first**:
   ```javascript
   navigator.mediaDevices.getUserMedia({ 
     video: true, 
     audio: true 
   });
   ```

#### Problem: Real-time Updates Not Working

**Debugging Steps:**

1. **Check Socket.IO is connected**:
   - Open DevTools
   - In Console: `console.log(socket.connected)`
   - Should print `true`

2. **Verify events are being emitted**:
   ```javascript
   // In browser console
   socket.on('*', (event, ...args) => {
     console.log('Event received:', event, args);
   });
   ```

3. **Check network tab** for WebSocket messages:
   - Open DevTools → Network
   - Filter by "WS"
   - Look for Socket.IO frames

4. **Restart Socket.IO connection**:
   ```javascript
   socket.disconnect();
   socket.connect();
   ```

---

### Build & Deployment Issues

#### Problem: Build Fails with Memory Error

**Error Message**:
```
JavaScript heap out of memory
```

**Solutions:**

```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json:
"build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
```

#### Problem: Docker Container Won't Start

**Solutions:**

1. **Check logs**:
   ```bash
   docker logs <container_id>
   ```

2. **Verify Docker image**:
   ```bash
   docker images | grep intellmeet
   ```

3. **Rebuild image**:
   ```bash
   docker build --no-cache -t intellmeet-server:latest ./server
   ```

4. **Check environment variables** in docker-compose:
   ```yaml
   environment:
     - MONGODB_URI=mongodb://mongodb:27017/intellmeet
     - JWT_SECRET=your_secret
     - NODE_ENV=production
   ```

#### Problem: Docker Compose Network Issues

**Solutions:**

```bash
# Check network
docker network ls

# Inspect network
docker network inspect intellmeet-network

# Recreate network
docker-compose down -v
docker-compose up -d

# Test connectivity
docker exec intellmeet-server ping mongodb
```

#### Problem: Nginx Returns 502 Bad Gateway

**Solutions:**

1. **Check upstream server is running**:
   ```bash
   curl http://localhost:5000
   ```

2. **Verify Nginx configuration**:
   ```bash
   sudo nginx -t
   ```

3. **Check Nginx logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Verify proxy_pass** in nginx.conf:
   ```nginx
   upstream backend {
       server localhost:5000;
   }
   
   location /api {
       proxy_pass http://backend;
   }
   ```

5. **Reload Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

---

### Performance Issues

#### Problem: Slow API Responses

**Diagnosis:**

1. **Check MongoDB indexes**:
   ```javascript
   db.collection('meetings').getIndexes();
   ```

2. **Check slow query logs**:
   ```bash
   # Enable in MongoDB
   db.setProfilingLevel(1, { slowms: 100 })
   ```

3. **Monitor server resources**:
   ```bash
   htop  # or Task Manager on Windows
   ```

**Solutions:**

- Add database indexes to frequently queried fields
- Implement caching with Redis
- Optimize query projections (select only needed fields)
- Implement pagination for large datasets

#### Problem: High Memory Usage

**Solutions:**

1. **Identify memory leaks**:
   ```bash
   node --inspect server/index.js
   ```

2. **Profile with DevTools**:
   - Open chrome://inspect
   - Connect to Node process
   - Take heap snapshots

3. **Implement connection pooling**:
   ```javascript
   // Mongoose connection pooling
   mongoose.connect(uri, {
     maxPoolSize: 10,
     minPoolSize: 5
   });
   ```

4. **Clear caches periodically**:
   ```javascript
   setInterval(() => {
     cache.clear();
   }, 3600000); // 1 hour
   ```

#### Problem: High CPU Usage

**Solutions:**

- Profile with `--prof` flag
- Use native modules for heavy computation
- Implement worker threads for CPU-intensive tasks
- Optimize algorithms and queries

---

### Security Issues

#### Problem: CORS Errors

**Error Message**:
```
Access to XMLHttpRequest from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solutions:**

1. **Update CORS configuration** in `server/index.js`:
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true,
     optionsSuccessStatus: 200
   }));
   ```

2. **Verify CLIENT_URL** in `.env`:
   ```env
   CLIENT_URL=http://localhost:5173
   ```

3. **For multiple origins**:
   ```javascript
   cors({
     origin: ['http://localhost:5173', 'https://yourdomain.com'],
     credentials: true
   })
   ```

#### Problem: JWT Token Invalid/Expired

**Solutions:**

1. **Verify JWT_SECRET** matches on server and client:
   ```bash
   echo $JWT_SECRET
   ```

2. **Check token format** in requests:
   ```javascript
   // Authorization header should be:
   Authorization: Bearer <token>
   ```

3. **Verify token generation** in `server/utils/generateToken.js`:
   ```javascript
   jwt.sign(data, process.env.JWT_SECRET, {
     expiresIn: process.env.JWT_EXPIRE
   });
   ```

#### Problem: Sensitive Data in Logs

**Solutions:**

1. **Implement data masking**:
   ```javascript
   function maskSensitive(data) {
     const masked = { ...data };
     if (masked.password) masked.password = '***';
     if (masked.token) masked.token = '***';
     return masked;
   }
   ```

2. **Use environment variables**:
   ```bash
   # Never log these
   JWT_SECRET
   MONGODB_URI
   OPENAI_API_KEY
   ```

3. **Configure log levels**:
   ```javascript
   logger.setLevel(process.env.LOG_LEVEL || 'info');
   ```

---

## ❓ Frequently Asked Questions (FAQ)

### Setup & Installation

**Q: Do I need to install MongoDB locally?**
A: No, you can use MongoDB Atlas (cloud) or Docker. Set MONGODB_URI in .env to your MongoDB Atlas connection string.

**Q: How do I change the default port?**
A: Update `PORT` in `server/.env` and `VITE_SOCKET_URL` in `client/.env`.

**Q: Can I run this on Windows?**
A: Yes! All commands work on Windows. Use WSL for Unix commands or use Windows native equivalents.

**Q: How long does initial setup take?**
A: About 10-15 minutes for dependencies, database setup, and verification.

---

### Development

**Q: How do I add a new API endpoint?**
A: 
1. Create route in `server/routes/` (e.g., `newfeature.js`)
2. Create controller in `server/controllers/` (e.g., `newfeatureController.js`)
3. Register in `server/index.js`: `app.use('/api/newfeature', ...)`
4. Document in [API_REFERENCE.md](API_REFERENCE.md)

**Q: How do I add a new React component?**
A:
1. Create component in `client/src/components/`
2. Add TypeScript types to `client/src/types/index.ts`
3. Export from parent component or `index.ts`
4. Use in pages

**Q: How do I add real-time features with Socket.IO?**
A:
1. Add event listener in `useSocket.ts` hook
2. Emit event from server in `server/sockets/`
3. Handle in component using hook
4. Document in [API_REFERENCE.md](API_REFERENCE.md)

**Q: Where do I add business logic?**
A: In controllers (`server/controllers/`) for backend, in services (`client/src/services/`) for frontend.

---

### Database

**Q: How do I view my MongoDB data?**
A: Use MongoDB Compass (GUI) or mongo CLI:
```bash
mongo
use intellmeet
db.users.find()
```

**Q: How do I reset the database?**
A:
```bash
mongo
use intellmeet
db.dropDatabase()
```

**Q: How often should I backup?**
A: Daily for production, use automated backups via MongoDB Atlas or cron jobs.

**Q: Can I migrate from local MongoDB to Atlas?**
A: Yes, use `mongodump` and `mongorestore` or MongoDB Compass.

---

### Performance

**Q: How can I make the app faster?**
A:
- Enable caching (Redis)
- Add database indexes
- Optimize images and assets
- Use CDN for static files
- Implement pagination
- Use lazy loading for components

**Q: What's the expected load time?**
A: < 2 seconds initial load, < 200ms API responses.

**Q: How many concurrent users can it handle?**
A: Depends on deployment resources. With load balancing, can scale to 10,000+.

---

### Security

**Q: Is my data encrypted?**
A: Data in transit uses HTTPS/TLS. At rest, use MongoDB encryption. Environment secrets stored securely.

**Q: How do I secure the API?**
A: 
- Enable HTTPS
- Configure CORS properly
- Implement rate limiting
- Validate all inputs
- Use strong JWT secret
- Regular security audits

**Q: What if someone gets my JWT_SECRET?**
A: Rotate immediately:
1. Generate new secret
2. Update in .env
3. Invalidate all existing tokens
4. Force re-login

---

### Deployment

**Q: Which platform should I use?**
A: 
- **Easy**: Docker Compose on any server
- **Scalable**: Kubernetes or AWS ECS
- **Cloud**: AWS, Azure, Google Cloud
- **Quick**: Heroku, Railway, Render

**Q: How do I deploy to production?**
A: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

**Q: Do I need SSL certificates?**
A: Yes, for production. Use Let's Encrypt (free) or your certificate provider.

**Q: How do I update the app without downtime?**
A: Use blue-green deployment or rolling updates with load balancer.

---

### Maintenance

**Q: How do I update dependencies?**
A:
```bash
npm outdated
npm update
npm audit fix
```

**Q: How often should I update?**
A: Monthly for security updates, quarterly for feature updates.

**Q: How do I monitor the app?**
A: Use tools like New Relic, Datadog, or CloudWatch for monitoring.

**Q: What should I log?**
A: Errors, warnings, important business events, performance metrics.

---

### Troubleshooting

**Q: How do I debug issues?**
A:
1. Check browser console (F12)
2. Check server logs (terminal)
3. Check network tab
4. Check database directly
5. Use debugger tools

**Q: Where are the logs?**
A:
- Server: Terminal output + `logs/` directory
- Client: Browser Console (F12)
- Database: MongoDB logs

**Q: How do I report bugs?**
A: Create GitHub issue with:
- Description
- Steps to reproduce
- Expected vs actual behavior
- Console errors
- Environment info

---

## 🔧 Quick Reference

### Common Commands

```bash
# Development
npm run dev           # Start both client and server
cd client && npm run dev    # Client only
cd server && npm run dev    # Server only

# Building
npm run build         # Build for production
npm run preview       # Preview production build

# Testing
npm test             # Run tests
npm run lint         # Run linter

# Database
mongodump            # Backup database
mongorestore         # Restore database

# Docker
docker-compose up    # Start containers
docker-compose down  # Stop containers
docker-compose logs  # View logs

# Deployment
docker push registry/app:1.0.0
docker pull registry/app:1.0.0
```

### Environment Variables Checklist

**Server (.env)**
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] NODE_ENV
- [ ] OPENAI_API_KEY

**Client (.env)**
- [ ] VITE_API_URL
- [ ] VITE_SOCKET_URL

### Port Mapping

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Nginx | 80/443 | http(s)://yourdomain.com |

---

## 📞 Getting Help

### Documentation
- [QUICK_START.md](QUICK_START.md) - Setup guide
- [API_REFERENCE.md](API_REFERENCE.md) - API docs
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment
- [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) - Design

### Resources
- GitHub Issues - Report bugs
- Email - support@intellmeet.com
- Documentation - See all .md files
- Code Comments - Inline documentation

### Before Asking for Help
- [ ] Checked documentation
- [ ] Searched existing issues
- [ ] Checked error logs
- [ ] Tried suggested solutions
- [ ] Gathered error messages
- [ ] Noted environment details

---

**Last Updated**: 2026-05-11
**Version**: 1.0.0 Premium
**Status**: Production Ready ✅
