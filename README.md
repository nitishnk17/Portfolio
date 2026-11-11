# Nitish Kumar — Portfolio

A modern, high-performance, aesthetic portfolio website built with clean HTML5, CSS3 (Design Tokens, Bento Grids, Glassmorphism, Ambient Glow), and lightweight Vanilla JavaScript. Zero build step, zero frameworks, lightning-fast load times.

```
portfolio-site/
├── index.html       → Semantic HTML structure & content
├── style.css        → Modern design system, dark/light theme tokens, bento grid layout & animations
└── script.js        → Dark/Light theme switcher, project category filters, toast notifications & scroll animations
```

---

## ✨ Features & Aesthetics

- 🎨 **Modern Dark-First & Light Mode**: Smooth theme switching with ambient glow effects, frosted glassmorphism navbar, and `localStorage` persistence.
- ⚡ **Bento Grid Architecture**: High-impact metrics showcase (`2.47×` Cerify speedup, `5.57×` MPI scaling, `AIR 351` GATE CS, `Top 5` Query Engine).
- 🏷️ **Interactive Project Filter**: Filter systems projects across *Parallel & Distributed*, *Systems & Compilers*, and *Hardware & SIMD*.
- 📋 **One-Click Clipboard Copy**: Click "Copy Email" to copy directly to clipboard with animated toast notification.
- 📱 **Fully Responsive**: Optimized for ultra-wide desktops, laptops, tablets, and mobile devices.

---

## 🚀 Run Locally

Open `index.html` directly in your browser, or start a lightweight local web server:

```bash
cd portfolio-site
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

---

## 🌐 Publish & Deploy

### Option 1: GitHub Pages (Free & Recommended)

1. Create a repository named `nitishnk17.github.io` on GitHub.
2. Initialize and push the files:
   ```bash
   cd portfolio-site
   git init
   git add .
   git commit -m "Initial commit: Aesthetic portfolio site"
   git branch -M main
   git remote add origin https://github.com/nitishnk17/nitishnk17.github.io.git
   git push -u origin main
   ```
3. In GitHub repo settings, go to **Settings → Pages** and ensure **Source** is set to `main` branch, `/ (root)` folder.
4. Your site will be live at: **`https://nitishnk17.github.io`**

### Option 2: Vercel / Netlify

- **Netlify**: Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag-and-drop the `portfolio-site` folder.
- **Vercel**: Run `npx vercel` inside the `portfolio-site` directory.

