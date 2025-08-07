# 🔥 Firebase Hosting Setup Guide

## 🎯 Target URL: `https://certificate-imageprocessing.web.app`

## 📋 Step-by-Step Setup:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. **Create a project** → `certificate-imageprocessing`
3. **Continue** → **Continue** → **Create project**

### 2. Enable Hosting
1. **Hosting** (left menu) → **Get started**
2. **Continue** → **Continue** → **Continue**

### 3. Install Firebase CLI (Local)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### 4. Configure Project
- **Project:** certificate-imageprocessing  
- **Public directory:** . (current directory)
- **Single-page app:** Yes
- **Overwrite index.html:** No

### 5. Deploy
```bash
firebase deploy
```

## 🤖 Auto Deploy Setup:

### 1. Generate Service Account
1. **Project Settings** → **Service accounts**
2. **Generate new private key** → Download JSON
3. Copy JSON content

### 2. Add GitHub Secret
1. **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret:**
   - Name: `FIREBASE_SERVICE_ACCOUNT_CERTIFICATE_IMAGEPROCESSING`
   - Value: [Paste JSON content]

### 3. Enable GitHub Actions
- Push any change → Auto deploy to Firebase

## 🎉 Result:
**Live URL:** https://certificate-imageprocessing.web.app

## ✅ Benefits:
- 🆓 **Free** (1GB storage, 10GB/month transfer)
- ⚡ **Fast** (Google CDN)
- 🔒 **HTTPS** automatic
- 🌍 **Global** deployment
- 📱 **Mobile-friendly**
- 🔄 **Auto deploy** from GitHub

---
🤖 Generated with [Claude Code](https://claude.ai/code)