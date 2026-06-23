# IntellMeet Premium - Deployment Guide

## 🚀 Overview

This guide covers deploying IntellMeet Premium to production environments. The application supports multiple deployment strategies:
- Traditional VM/Server deployment
- Docker containerization
- Kubernetes orchestration
- Cloud platforms (AWS, Azure, Google Cloud)
- Serverless functions (API layer only)

## 📋 Prerequisites

- Node.js 18+ LTS
- MongoDB 5.0+ (managed or self-hosted)
- Docker & Docker Compose (for containerized deployment)
- SSL/TLS certificates
- Domain name
- Basic Unix/Linux knowledge

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer / CDN                     │
│                     (Nginx / CloudFlare)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────┐      ┌───▼────┐      ┌───▼────┐
    │ Client │      │ Client │      │ Client │
    │Instance│      │Instance│      │Instance│
    └────────┘      └────────┘      └────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────────┐  ┌───▼────────┐  ┌───▼────────┐
    │  Server    │  │  Server    │  │  Server    │
    │ Instance 1 │  │ Instance 2 │  │ Instance 3 │
    └────────────┘  └────────────┘  └────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────────┐  ┌───▼────────┐  ┌───▼───────┐
    │ MongoDB    │  │   Redis    │  │    S3     │
    │ Cluster    │  │   Cache    │  │  Storage  │
    └────────────┘  └────────────┘  └───────────┘
```

## 🐳 Docker Deployment

### 1. Build Docker Images

```bash
# Build client image
docker build -t intellmeet-client:latest ./client

# Build server image
docker build -t intellmeet-server:latest ./server

# Tag for registry
docker tag intellmeet-client:latest your-registry/intellmeet-client:1.0.0
docker tag intellmeet-server:latest your-registry/intellmeet-server:1.0.0

# Push to registry
docker push your-registry/intellmeet-client:1.0.0
docker push your-registry/intellmeet-server:1.0.0
```

### 2. Docker Compose Setup

```bash
# Copy and edit docker-compose file
cp docker-compose.yml docker-compose.prod.yml

# Edit environment variables in docker-compose.prod.yml
nano docker-compose.prod.yml

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### 3. Environment Variables in Docker

Create `.env.prod` file:

```env
# Database
MONGODB_URI=mongodb://mongodb:27017/intellmeet
# or MongoDB Atlas:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/intellmeet

# JWT
JWT_SECRET=your_production_jwt_secret_min_32_chars

# Node Environment
NODE_ENV=production

# Server Config
PORT=5000
CLIENT_URL=https://yourdomain.com

# CORS
CORS_ORIGIN=https://yourdomain.com

# OpenAI
OPENAI_API_KEY=sk-your_api_key

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_key
```

## ☁️ AWS Deployment

### EC2 with Load Balancer

1. **Launch EC2 Instances**
   ```bash
   # Choose Ubuntu 22.04 LTS AMI
   # Instance type: t3.medium (minimum)
   # Security group: Allow ports 80, 443, 22
   # Enable auto-scaling group
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y nodejs npm mongodb-org nginx certbot python3-certbot-nginx

   # Start services
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

3. **Deploy Application**
   ```bash
   git clone https://github.com/yourusername/intellmeet.git
   cd intellmeet/server
   npm install --production
   npm run build

   cd ../client
   npm install --production
   npm run build
   ```

4. **Configure Nginx**
   ```nginx
   upstream backend {
       server localhost:5000;
   }

   server {
       server_name yourdomain.com;
       
       listen 80;
       return 301 https://$server_name$request_uri;
   }

   server {
       server_name yourdomain.com;
       listen 443 ssl http2;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       # Frontend
       location / {
           root /var/www/intellmeet/client/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # WebSocket
       location /socket.io {
           proxy_pass http://backend;
           proxy_http_version 1.1;
           proxy_buffering off;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

5. **SSL Certificate**
   ```bash
   sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
   ```

6. **Start Services**
   ```bash
   sudo pm2 start ecosystem.config.js
   sudo systemctl restart nginx
   ```

### RDS for MongoDB

```bash
# Use MongoDB Atlas or AWS DocumentDB (MongoDB compatible)
# Update MONGODB_URI in environment variables
MONGODB_URI=mongodb+srv://user:pass@your-cluster.mongodb.net/intellmeet
```

### S3 for Recordings

```bash
# Create S3 bucket
aws s3 mb s3://intellmeet-recordings

# Create IAM policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::intellmeet-recordings/*"
    }
  ]
}

# Add credentials to environment
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=intellmeet-recordings
```

## 🔵 Azure Deployment

### App Service

```bash
# Create resource group
az group create --name intellmeet-rg --location eastus

# Create app service plan
az appservice plan create \
  --name intellmeet-plan \
  --resource-group intellmeet-rg \
  --sku B2 \
  --is-linux

# Create web app
az webapp create \
  --resource-group intellmeet-rg \
  --plan intellmeet-plan \
  --name intellmeet-app \
  --runtime "NODE|18-lts"
```

### Configuration

```bash
# Set environment variables
az webapp config appsettings set \
  --name intellmeet-app \
  --resource-group intellmeet-rg \
  --settings \
    NODE_ENV=production \
    MONGODB_URI="mongodb+srv://..." \
    JWT_SECRET="your_secret" \
    OPENAI_API_KEY="sk-..."

# Deploy from Git
az webapp up \
  --name intellmeet-app \
  --resource-group intellmeet-rg \
  --runtime "NODE|18-lts"
```

### Azure Cosmos DB

```bash
# Create Cosmos DB
az cosmosdb create \
  --name intellmeet-db \
  --resource-group intellmeet-rg \
  --kind MongoDB

# Get connection string
az cosmosdb keys list \
  --name intellmeet-db \
  --resource-group intellmeet-rg \
  --type connection-strings
```

## 🌐 Google Cloud Platform

### Cloud Run

```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/intellmeet-server

# Deploy to Cloud Run
gcloud run deploy intellmeet-server \
  --image gcr.io/PROJECT_ID/intellmeet-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="...",JWT_SECRET="..."

# Configure custom domain
gcloud run domain-mappings create \
  --service=intellmeet-server \
  --domain=yourdomain.com
```

### Firestore

```bash
# Use Firestore as alternative to MongoDB
# Update application code to use Firestore SDK
npm install @google-cloud/firestore
```

## 🔐 Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] DDoS protection enabled
- [ ] WAF rules configured
- [ ] Logging enabled
- [ ] Monitoring alerts set up
- [ ] Backup strategy configured
- [ ] Disaster recovery plan documented

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 monit
pm2 logs

# Using New Relic
npm install newrelic
# Add to top of server/index.js:
# require('newrelic');
```

### Log Aggregation

```bash
# Using ELK Stack
docker run -d -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker run -d -p 5601:5601 docker.elastic.co/kibana/kibana:8.0.0

# Or use CloudWatch, Stackdriver, etc.
```

### Error Tracking

```bash
# Using Sentry
npm install @sentry/node
# Configure in index.js:
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "YOUR_DSN" });
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: |
          docker build -t intellmeet-client ./client
          docker build -t intellmeet-server ./server
      
      - name: Push to registry
        run: |
          docker push your-registry/intellmeet-client:${{ github.sha }}
          docker push your-registry/intellmeet-server:${{ github.sha }}
      
      - name: Deploy to production
        run: |
          # SSH to server and pull new images
          ssh user@prod-server 'docker-compose pull && docker-compose up -d'
```

## 📈 Scaling Strategy

### Horizontal Scaling

1. **Load Balancer** (Nginx, HAProxy, Cloud LB)
   ```bash
   # Add multiple server instances behind load balancer
   ```

2. **Database Replication**
   ```bash
   # Configure MongoDB replication set
   # Min 3 nodes for high availability
   ```

3. **Session Store** (Redis)
   ```bash
   # Move sessions to Redis for horizontal scaling
   ```

4. **Message Queue** (RabbitMQ, Kafka)
   ```bash
   # For async operations and decoupling
   ```

### Vertical Scaling

- Increase instance size (CPU, RAM)
- Optimize database indexes
- Enable caching
- Compress assets

## 🆘 Troubleshooting

### Connection Issues

```bash
# Check if services are running
sudo systemctl status nginx
sudo systemctl status mongodb

# Check ports
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :27017

# Check logs
tail -f /var/log/nginx/error.log
journalctl -u mongodb -f
```

### Performance Issues

```bash
# Check CPU/Memory
htop

# Check database performance
mongo
> db.collection.find().explain("executionStats")

# Check slow queries
# Enable profiling in MongoDB
```

### WebSocket Issues

```bash
# Check socket connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
     -H "Sec-WebSocket-Key: 1234567890" \
     http://localhost:5000/socket.io/
```

## 📦 Backup & Recovery

### MongoDB Backup

```bash
# Dump database
mongodump --uri="mongodb://localhost:27017/intellmeet" \
          --out=/backup/mongodump-$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb://localhost:27017/intellmeet" \
             /backup/mongodump-20230511

# Automated backups
0 2 * * * mongodump --uri="mongodb://localhost:27017/intellmeet" \
                    --out=/backup/mongodump-$(date +\%Y\%m\%d)
```

### Application Backup

```bash
# Backup application code
tar -czf intellmeet-backup-$(date +%Y%m%d).tar.gz /var/www/intellmeet/

# Upload to S3
aws s3 cp intellmeet-backup-$(date +%Y%m%d).tar.gz s3://intellmeet-backups/
```

## 🔄 Rollback Procedure

```bash
# Tag current version
git tag v1.0.0
git push origin v1.0.0

# Rollback steps
1. Stop current services
2. Restore previous database backup
3. Deploy previous application version
4. Run health checks
5. Verify functionality
```

## 📞 Support & Documentation

- **Documentation**: See QUICK_START.md, ARCHITECTURE_GUIDE.md
- **Issues**: Report on GitHub
- **Email**: support@intellmeet.com
- **Status Page**: https://status.intellmeet.com

## ✅ Post-Deployment

- [ ] Run smoke tests
- [ ] Verify all API endpoints
- [ ] Check monitoring dashboards
- [ ] Review logs for errors
- [ ] Test user workflows
- [ ] Verify SSL certificate
- [ ] Test backup/restore
- [ ] Document any issues
- [ ] Create incident response plan
- [ ] Schedule post-launch review

---

**Last Updated**: 2026-05-11
**Version**: 1.0.0 Premium
**Status**: Production Ready ✅
