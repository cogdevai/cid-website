# Host CID Website on GitHub Pages with Squarespace Domain

## Overview

This guide walks you through:
1. Setting up GitHub Pages (free hosting)
2. Connecting your Squarespace domain
3. Getting your site live at `yourdomain.com`

**Time needed:** ~15-20 minutes

---

## Part 1: Set Up GitHub Pages

### Step 1: Create a GitHub Account (if you don't have one)
1. Go to [github.com](https://github.com)
2. Click **Sign Up**
3. Follow the prompts to create your free account

### Step 2: Create a New Repository
1. Click the **+** icon in the top right corner
2. Select **New repository**
3. Fill in:
   - **Repository name:** `cid-website` (or any name you want)
   - **Description:** CID - Cognitive Intelligence Design (optional)
   - **Public:** ✅ Select this (required for free GitHub Pages)
   - **Add a README file:** ✅ Check this box
4. Click **Create repository**

### Step 3: Upload Your Website File
1. In your new repository, click **Add file** → **Upload files**
2. Drag and drop the `cid-website.html` file
3. **IMPORTANT:** Rename it to `index.html` before uploading, OR:
   - After uploading, click on the file
   - Click the pencil icon (edit)
   - Click on the filename and rename it to `index.html`
4. Scroll down and click **Commit changes**

### Step 4: Enable GitHub Pages
1. In your repository, click **Settings** (tab at the top)
2. Scroll down to **Pages** in the left sidebar (under "Code and automation")
3. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes, then refresh the page
6. You'll see: "Your site is live at `https://yourusername.github.io/cid-website/`"

🎉 **Your site is now live!** Test it at that URL.

---

## Part 2: Connect Your Squarespace Domain

### Step 5: Add Custom Domain in GitHub
1. Still in **Settings → Pages**
2. Under **Custom domain**, enter your domain: `www.yourdomain.com`
3. Click **Save**
4. Check ✅ **Enforce HTTPS** (may take a few minutes to become available)

### Step 6: Get GitHub's IP Addresses
You'll need these for Squarespace. GitHub Pages uses these IPs:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Step 7: Configure DNS in Squarespace

1. Log in to your **Squarespace** account
2. Go to **Settings** → **Domains**
3. Click on your domain name
4. Click **DNS Settings** or **Advanced DNS Settings**

#### Add A Records (for root domain: yourdomain.com)
Click **Add Record** and create these 4 records:

| Type | Host | Data/Points to |
|------|------|----------------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

#### Add CNAME Record (for www.yourdomain.com)
Click **Add Record**:

| Type | Host | Data/Points to |
|------|------|----------------|
| CNAME | www | yourusername.github.io |

**Replace `yourusername` with your actual GitHub username!**

### Step 8: Create CNAME File in GitHub
1. Go back to your GitHub repository
2. Click **Add file** → **Create new file**
3. Name it exactly: `CNAME` (all caps, no extension)
4. In the file contents, add your domain:
```
www.yourdomain.com
```
5. Click **Commit new file**

### Step 9: Wait for DNS Propagation
- DNS changes can take **15 minutes to 48 hours** to propagate
- Usually it's ready within **1-2 hours**
- You can check status at [dnschecker.org](https://dnschecker.org)

---

## Part 3: Verify Everything Works

### Test Your Site
After DNS propagates, test these URLs:
- ✅ `https://www.yourdomain.com` — should work
- ✅ `https://yourdomain.com` — should redirect to www (or work directly)
- ✅ `https://yourusername.github.io/cid-website/` — original GitHub URL still works

### Troubleshooting

**Site not loading?**
- Wait longer for DNS (can take up to 48 hours)
- Double-check A records and CNAME in Squarespace
- Make sure CNAME file exists in GitHub repo

**HTTPS not working?**
- Go to GitHub Settings → Pages
- Make sure "Enforce HTTPS" is checked
- If grayed out, wait 24 hours for certificate to generate

**404 Error?**
- Make sure your main file is named exactly `index.html`
- Check that GitHub Pages is enabled on `main` branch

---

## File Structure

Your GitHub repository should look like this:
```
cid-website/
├── index.html      ← Your website (renamed from cid-website.html)
└── CNAME           ← Contains: www.yourdomain.com
```

---

## Optional: Add More Files Later

If you want to add images, additional pages, or assets:

```
cid-website/
├── index.html
├── CNAME
├── about.html          ← Additional pages
├── contact.html
└── assets/
    ├── images/
    │   └── logo.png
    └── css/
        └── custom.css
```

---

## Quick Reference

| Service | What it does | Cost |
|---------|--------------|------|
| GitHub Pages | Hosts your website files | Free |
| Squarespace | Domain registration + DNS | Your existing plan |
| SSL Certificate | HTTPS security | Free (via GitHub) |

---

## Summary Checklist

- [ ] Created GitHub account
- [ ] Created repository
- [ ] Uploaded `index.html`
- [ ] Enabled GitHub Pages
- [ ] Added custom domain in GitHub settings
- [ ] Added 4 A records in Squarespace DNS
- [ ] Added CNAME record in Squarespace DNS
- [ ] Created CNAME file in GitHub repo
- [ ] Waited for DNS propagation
- [ ] Tested site at your domain
- [ ] Enabled HTTPS

---

## Need to Update Your Site?

1. Go to your GitHub repository
2. Click on `index.html`
3. Click the pencil icon (edit)
4. Make your changes
5. Click **Commit changes**
6. Site updates automatically in ~1 minute!

Or upload a new `index.html` file to replace the old one.

---

**Congratulations!** 🎉 Your stunning CID website is now live at your custom domain with free, reliable hosting!
