# 🚀 Complete Deployment Guide for QuickClipAI

## Deployment Platforms You Can Use

### **Frontend Deployment Options**
1. **GitHub Pages** (Free, easiest)
2. **Vercel** (Free tier, best for Next.js)
3. **Netlify** (Free tier, drag & drop)
4. **Cloudflare Pages** (Free, fast)

### **Backend Deployment Options**
1. **Railway.app** (Easiest, $5/month minimum)
2. **Heroku** (Popular, paid tiers)
3. **Render.com** (Good free tier)
4. **DigitalOcean** (Affordable, $4/month)
5. **AWS** (Most scalable)

---

## 📍 STEP-BY-STEP DEPLOYMENT GUIDES

---

# 1️⃣ DEPLOY FRONTEND TO GITHUB PAGES (FREE)

### **Step 1: Enable GitHub Pages**
1. Go to your repo: `https://github.com/liamhodgson84-hash/quickclipai`
2. Click **Settings** (top right)
3. Left sidebar → **Pages**
4. Under "Source", select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

### **Step 2: Wait for Deployment**
- GitHub builds and deploys automatically
- Wait 2-3 minutes
- Your site appears at: `https://liamhodgson84-hash.github.io/quickclipai/`

### **Step 3: Access Your Website**
- Visit: `https://liamhodgson84-hash.github.io/quickclipai/`
- Share this URL with anyone

### **Update index.html for GitHub Pages**
Edit `index.html` line 1 to handle the subdirectory:
```html
<base href="/quickclipai/">
```

✅ **Cost: FREE**
✅ **SSL: Automatic HTTPS**
✅ **Custom Domain: Yes (see GoDaddy section)**

---

# 2️⃣ DEPLOY FRONTEND TO VERCEL (FREE)

### **Step 1: Create Vercel Account**
1. Go to https://vercel.com
2. Click **Sign Up**
3. Sign up with GitHub (easiest)
4. Authorize Vercel to access your repos

### **Step 2: Deploy Your Repository**
1. Click **Add New** → **Project**
2. Select your **quickclipai** repository
3. Click **Import**

### **Step 3: Configure Project**
- Framework: **Other** (it's HTML/JS)
- Root Directory: **.** (root)
- Build Command: *(leave empty)*
- Output Directory: *.* (root)
- Environment Variables: *(skip for now)*

### **Step 4: Deploy**
1. Click **Deploy**
2. Wait 1-2 minutes
3. Get your URL: `https://quickclipai.vercel.app`

### **Step 5: Connect Custom Domain**
1. After deployment, click **Settings**
2. Left sidebar → **Domains**
3. Add your GoDaddy domain (see GoDaddy section below)

✅ **Cost: FREE ($20/month for Pro)**
✅ **SSL: Automatic HTTPS**
✅ **Custom Domain: Yes**
✅ **Auto-deploys on GitHub push**

---

# 3️⃣ DEPLOY FRONTEND TO NETLIFY (FREE)

### **Step 1: Create Netlify Account**
1. Go to https://netlify.com
2. Click **Sign up**
3. Choose **GitHub** signup
4. Authorize Netlify

### **Step 2: Deploy**
1. Click **Add new site** → **Import an existing project**
2. Select **GitHub**
3. Find and select **quickclipai**
4. Click **Deploy site**

### **Step 3: Configure**
- Branch to deploy: **main**
- Build command: *(leave blank)*
- Publish directory: **.** (root)

### **Step 4: Done!**
- Get random URL like: `https://quickclipai-abc123.netlify.app`
- Rename it: **Site settings** → **Change site name**

✅ **Cost: FREE**
✅ **SSL: Automatic HTTPS**
✅ **Custom Domain: Yes**

---

# 4️⃣ DEPLOY BACKEND TO RAILWAY (EASIEST)

### **Step 1: Create Railway Account**
1. Go to https://railway.app
2. Click **Dashboard** → **Sign Up**
3. Connect **GitHub account**
4. Authorize Railway

### **Step 2: Create New Project**
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Search and select **quickclipai**

### **Step 3: Configure**
1. Select **server** folder (if prompted)
2. Choose main branch
3. Railway auto-detects it's a Node.js project

### **Step 4: Add Environment Variables**
1. Go to **Variables** tab
2. Add each variable from `.env.example`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `STRIPE_SECRET_KEY`
   - `OPENAI_API_KEY`
   - `REDIS_URL` (Railway provides this)

### **Step 5: Deploy**
1. Click **Deploy**
2. Wait for build (2-3 minutes)
3. Get your API URL: `https://quickclipai.up.railway.app`

### **Step 6: Update Frontend**
Edit `js/app.js` line 1:
```javascript
const API_BASE_URL = 'https://quickclipai.up.railway.app/api';
```

Commit and push - Vercel/Netlify auto-redeploys!

✅ **Cost: FREE ($5/month minimum after free tier)**
✅ **Includes: Node.js, Redis, PostgreSQL**
✅ **Auto-deploys on GitHub push**
✅ **Easy environment variables**

---

# 5️⃣ DEPLOY BACKEND TO HEROKU (EASY)

### **Step 1: Create Heroku Account**
1. Go to https://heroku.com
2. Click **Sign up**
3. Fill out form and verify email

### **Step 2: Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh

# Windows - Download from heroku.com/devcenter/devcenter/articles/heroku-cli
```

### **Step 3: Login to Heroku**
```bash
heroku login
# Opens browser, click Authorize
```

### **Step 4: Create Heroku App**
```bash
cd server
heroku create quickclipai-api
```

### **Step 5: Add Redis Add-on**
```bash
heroku addons:create heroku-redis:premium-0
```

### **Step 6: Set Environment Variables**
```bash
heroku config:set FIREBASE_PROJECT_ID=your_project_id
heroku config:set FIREBASE_PRIVATE_KEY="your_key"
heroku config:set STRIPE_SECRET_KEY=sk_test_xxxxx
heroku config:set OPENAI_API_KEY=sk-xxxxx
```

### **Step 7: Deploy**
```bash
git push heroku main
```

### **Step 8: Check Logs**
```bash
heroku logs --tail
```

### **Step 9: Get Your API URL**
```bash
heroku apps:info
# Look for: "web_url"
# Should be: https://quickclipai-api.herokuapp.com
```

### **Step 10: Update Frontend**
```javascript
const API_BASE_URL = 'https://quickclipai-api.herokuapp.com/api';
```

✅ **Cost: FREE ($7/month after)**
✅ **Popular choice**
✅ **Easy CLI deployment**

---

# 6️⃣ DEPLOY BACKEND TO RENDER (FREE TIER)

### **Step 1: Create Render Account**
1. Go to https://render.com
2. Click **Sign up**
3. Choose **GitHub** signup
4. Authorize Render

### **Step 2: Create Web Service**
1. Dashboard → **New +** → **Web Service**
2. Select **quickclipai** repo
3. Choose **main** branch

### **Step 3: Configure**
- **Name:** quickclipai-api
- **Environment:** Node
- **Build Command:** `cd server && npm install`
- **Start Command:** `node src/server.js`
- **Region:** Pick closest to you

### **Step 4: Add Environment Variables**
Under "Advanced", add all from `.env.example`

### **Step 5: Create PostgreSQL Database (Optional)**
1. Click **New +** → **PostgreSQL**
2. Name it **quickclipai-db**
3. Connect to your Web Service

### **Step 6: Deploy**
1. Click **Create Web Service**
2. Wait for deployment (3-5 minutes)
3. Get URL: `https://quickclipai-api.onrender.com`

⚠️ **Note:** Free tier goes to sleep after 15 minutes. Upgrade for always-on.

✅ **Cost: FREE (paid upgrades available)**
✅ **Includes PostgreSQL**
✅ **GitHub auto-deploy**

---

# 7️⃣ DEPLOY WITH DOCKER TO DIGITALOCEAN ($4/month)

### **Step 1: Create DigitalOcean Account**
1. Go to https://digitalocean.com
2. Sign up
3. Add payment method

### **Step 2: Create Droplet (Virtual Server)**
1. Click **Create** → **Droplet**
2. Choose **Ubuntu 22.04**
3. Basic plan: **$4/month** (smallest)
4. Choose datacenter closest to you
5. Add SSH key (or use password)
6. Click **Create Droplet**

### **Step 3: Connect via SSH**
```bash
# Copy the IP address from DigitalOcean dashboard
ssh root@YOUR_IP_ADDRESS
```

### **Step 4: Install Dependencies**
```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **Step 5: Clone Your Repository**
```bash
git clone https://github.com/liamhodgson84-hash/quickclipai.git
cd quickclipai/server
```

### **Step 6: Create .env File**
```bash
nano .env
# Paste all your environment variables
# Press Ctrl+X, then Y, then Enter to save
```

### **Step 7: Start with Docker**
```bash
docker-compose up -d
```

### **Step 8: Get Your API URL**
```bash
# Your IP becomes your URL
# https://YOUR_IP_ADDRESS:5000/api
```

### **Step 9: Setup Firewall**
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5000/tcp  # API
ufw enable
```

✅ **Cost: $4/month**
✅ **Full control**
✅ **Docker pre-configured**

---

# 🌐 CONNECT TO GODADDY DOMAIN

## **Option A: Using GitHub Pages + GoDaddy**

### **Step 1: Buy Domain on GoDaddy**
1. Go to https://godaddy.com
2. Search for domain
3. Add to cart and purchase

### **Step 2: Find Your GitHub Pages IP**
In terminal:
```bash
nslookup liamhodgson84-hash.github.io
# You'll see an IP address, write it down
```

### **Step 3: Configure DNS on GoDaddy**
1. Log in to GoDaddy
2. Go to **My Products**
3. Click your domain → **Manage**
4. Click **DNS** tab
5. Under "A Records", find or add:
   - **Name:** @ (or leave blank)
   - **Value:** The IP from step 2
   - **TTL:** 1 hour
6. Add CNAME record:
   - **Name:** www
   - **Value:** liamhodgson84-hash.github.io
   - **TTL:** 1 hour

### **Step 4: Configure GitHub Pages**
1. Go to your repo → **Settings** → **Pages**
2. Under "Custom domain", enter: `yourdomain.com`
3. Click **Save**
4. Check **Enforce HTTPS**

### **Step 5: Wait & Verify**
- Wait 24 hours for DNS propagation
- Visit `https://yourdomain.com`
- Your site loads from GitHub Pages!

✅ **Cost: Domain only (~$10/year)**
✅ **Easy setup**
✅ **Free SSL certificate**

---

## **Option B: Using Vercel + GoDaddy (RECOMMENDED)**

### **Step 1: Deploy to Vercel (See Section 2️⃣ Above)**

### **Step 2: Buy GoDaddy Domain**
1. https://godaddy.com → Search domain
2. Purchase

### **Step 3: Add Domain to Vercel**
1. Vercel Dashboard → Your project
2. **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `yourdomain.com`
5. Click **Add**

### **Step 4: Get Nameservers**
Vercel shows you nameservers to use:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

### **Step 5: Update GoDaddy**
1. Log in to GoDaddy
2. **My Products** → Domain → **Manage**
3. **Nameservers** tab
4. Click **Change**
5. Paste Vercel's nameservers
6. Click **Save**

### **Step 6: Verify in Vercel**
1. Go back to Vercel
2. Click **Verify** next to your domain
3. Wait up to 24 hours
4. Once verified, green checkmark appears

### **Step 7: Done!**
- Visit `https://yourdomain.com`
- Loads from Vercel
- SSL certificate automatic

✅ **Cost: Domain only**
✅ **Easiest setup**
✅ **Best performance**
✅ **Automatic SSL**

---

## **Option C: Backend API + Frontend Domain**

### **Setup Frontend (Vercel + GoDaddy)**
Follow Option B above

### **Setup Backend (Railway/Heroku)**
Follow sections 4️⃣ or 5️⃣ above

### **Update API Connection**
Edit `js/app.js`:
```javascript
const API_BASE_URL = 'https://quickclipai-api.railway.app/api';
```

Or add subdomain for API:
1. GoDaddy DNS → Add CNAME record:
   - **Name:** api
   - **Value:** quickclipai-api.railway.app
2. Update JS:
   ```javascript
   const API_BASE_URL = 'https://api.yourdomain.com/api';
   ```

---

## 🎯 RECOMMENDED SETUP (BEST VALUE)

### **Free Option:**
- **Frontend:** GitHub Pages
- **Backend:** Railway (free tier)
- **Database:** Firebase (free tier)
- **Domain:** GoDaddy ($10/year)

### **Budget Option ($5-10/month):**
- **Frontend:** Vercel (free)
- **Backend:** Railway ($5/month)
- **Domain:** GoDaddy ($10/year)

### **Professional Option ($20+/month):**
- **Frontend:** Vercel Pro
- **Backend:** DigitalOcean ($5/month) + Docker
- **Database:** PostgreSQL on DigitalOcean
- **Domain:** GoDaddy ($10/year)

---

## 📊 COMPARISON TABLE

| Platform | Frontend | Backend | Cost | SSL | Ease |
|----------|----------|---------|------|-----|------|
| GitHub Pages + Railway + GoDaddy | ✅ | ✅ | ~$10/yr + $5/mo | ✅ | ⭐⭐⭐ |
| Vercel + Railway + GoDaddy | ✅ | ✅ | ~$10/yr + $5/mo | ✅ | ⭐⭐⭐⭐ |
| Netlify + Heroku + GoDaddy | ✅ | ✅ | ~$10/yr + $7/mo | ✅ | ⭐⭐⭐ |
| DigitalOcean ($4/mo) + GoDaddy | ✅ | ✅ | ~$10/yr + $4/mo | ✅ | ⭐⭐ |

---

## 🔧 TROUBLESHOOTING

### **Domain not connecting?**
- Wait 24 hours (DNS propagation)
- Check GoDaddy DNS settings
- Clear browser cache
- Try incognito window

### **API not responding?**
- Check backend is running: `curl https://your-api.com/health`
- Verify environment variables are set
- Check logs in deployment platform

### **HTTPS certificate not working?**
- Wait 24 hours
- Try different domain
- Contact platform support

---

## ✅ FINAL CHECKLIST

- [ ] Frontend deployed (GitHub Pages/Vercel/Netlify)
- [ ] Backend deployed (Railway/Heroku/DigitalOcean)
- [ ] Domain purchased (GoDaddy)
- [ ] DNS configured (A record or nameservers)
- [ ] API URL updated in frontend
- [ ] HTTPS working
- [ ] Firebase credentials configured
- [ ] Stripe keys configured
- [ ] OpenAI key configured
- [ ] Redis configured
- [ ] Email tests working

---

**Your QuickClipAI is live and ready for users! 🎉**