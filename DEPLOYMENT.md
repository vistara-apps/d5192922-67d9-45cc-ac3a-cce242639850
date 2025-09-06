# PeerLink Deployment Guide

This guide covers deploying PeerLink to production with all required services and configurations.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/peerlink-base-miniapp)

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] Vercel account (or preferred hosting platform)
- [ ] Supabase project with database setup
- [ ] Privy app configured
- [ ] Pinata account for IPFS storage
- [ ] Neynar API key for Farcaster integration
- [ ] Base RPC endpoint (Alchemy, QuickNode, etc.)
- [ ] Domain name (optional but recommended)

### Environment Variables
- [ ] All required environment variables configured
- [ ] Production URLs updated
- [ ] API keys secured and validated
- [ ] Database connection tested

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd peerlink-base-miniapp

# Install dependencies
npm install

# Build and test locally
npm run build
npm run start
```

### 2. Configure Environment Variables

Create a production environment file:

```bash
# Production Environment Variables
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_production_privy_app_id
PRIVY_APP_SECRET=your_production_privy_secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# External APIs
NEYNAR_API_KEY=your_neynar_api_key
PINATA_JWT=your_pinata_jwt_token

# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

### 3. Database Setup

Run the database migration in your Supabase project:

```sql
-- Run the complete database setup from README.md
-- This includes all tables, indexes, and RLS policies
```

### 4. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_PRIVY_APP_ID production
vercel env add PRIVY_APP_SECRET production
# ... add all other environment variables
```

### 5. Configure Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS records as instructed by Vercel
```

### 6. Post-Deployment Configuration

#### Update Privy Settings
1. Add your production domain to Privy allowed origins
2. Update redirect URLs to use production domain
3. Test Farcaster login flow

#### Update Supabase Settings
1. Add production domain to allowed origins
2. Configure RLS policies for production
3. Test database connections

#### Configure Pinata
1. Update CORS settings for production domain
2. Test file upload functionality
3. Configure pinning policies

## 🔒 Security Configuration

### Environment Variables Security
- Use Vercel's encrypted environment variables
- Never commit secrets to version control
- Rotate API keys regularly
- Use different keys for staging and production

### Database Security
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

### API Security
- Enable rate limiting on API routes
- Validate all inputs with Zod schemas
- Use HTTPS only in production
- Implement proper CORS policies

## 📊 Monitoring & Analytics

### Error Tracking
```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

### Performance Monitoring
- Enable Vercel Analytics
- Monitor Core Web Vitals
- Track API response times
- Monitor database performance

### User Analytics
```typescript
// Example analytics tracking (privacy-compliant)
import { track } from '@/lib/analytics';

// Track user actions
track('tutoring_session_created', {
  subject: session.subject,
  price: session.price,
});
```

## 🧪 Testing in Production

### Smoke Tests
```bash
# Test critical user flows
curl https://your-domain.com/api/health
curl https://your-domain.com/api/users
```

### User Acceptance Testing
- [ ] User registration and login
- [ ] Wallet connection
- [ ] Tutoring session creation
- [ ] Resource upload and download
- [ ] Payment processing
- [ ] Farcaster Frame integration

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear Next.js cache
rm -rf .next
npm run build
```

#### Environment Variable Issues
```bash
# Verify environment variables are set
vercel env ls

# Test environment variables locally
npm run dev
```

#### Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     https://your-project.supabase.co/rest/v1/users
```

#### API Integration Issues
```bash
# Test Privy integration
curl -X POST https://auth.privy.io/api/v1/sessions \
     -H "privy-app-id: YOUR_APP_ID"

# Test Neynar API
curl -H "api_key: YOUR_NEYNAR_KEY" \
     https://api.neynar.com/v2/user/bulk?fids=1
```

### Performance Issues
- Enable Next.js bundle analyzer
- Optimize images with next/image
- Implement proper caching strategies
- Use Vercel Edge Functions for API routes

## 📈 Scaling Considerations

### Database Scaling
- Monitor Supabase usage and upgrade plan as needed
- Implement database connection pooling
- Consider read replicas for heavy read workloads
- Optimize queries with proper indexing

### API Scaling
- Implement caching with Redis (Upstash)
- Use Vercel Edge Functions for global distribution
- Implement proper rate limiting
- Consider API versioning for future updates

### Storage Scaling
- Monitor Pinata usage and upgrade plan
- Implement file compression for uploads
- Consider CDN for frequently accessed files
- Implement cleanup for unused files

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check Supabase logs for database issues
4. Open an issue on GitHub with deployment details
5. Join our Discord for community support

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database properly set up with RLS
- [ ] SSL certificate configured
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] User acceptance testing passed
- [ ] Documentation updated
- [ ] Team trained on production procedures

---

🎉 **Congratulations!** Your PeerLink Base Mini App is now live in production!
