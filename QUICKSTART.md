# Quick Start Guide

Get your physics portfolio live in 5 minutes! ⚡

## 1. Install & Setup (1 minute)

```bash
npm install
```

## 2. Add Your Projects (2 minutes)

1. Create a folder in `/projects/` folder:
   ```bash
   mkdir projects/MyProject
   ```

2. Add your LaTeX file and images:
   ```
   projects/MyProject/
   ├── research.tex      (required)
   ├── figure1.png
   └── figure2.jpg
   ```

3. Your `.tex` file should look like:
   ```latex
   \title{\textbf{My Research Title}}
   
   \section*{Overview}
   Brief summary of your research. This appears on the project card.
   
   \section{Introduction}
   Your content here...
   
   \includegraphics{figure1.png}
   ```

## 3. Test Locally (1 minute)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your portfolio!

## 4. Deploy to GitHub (1 minute)

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Your site is live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

GitHub Actions will automatically build and deploy on every push to `main`!

---

## What's Included? ✅

- ✅ **React + TypeScript** - Modern development
- ✅ **LaTeX Rendering** - Beautiful equations with KaTeX
- ✅ **GitHub Pages Ready** - One-click deployment
- ✅ **Automatic Project Ingestion** - Add `.tex` files, they appear instantly
- ✅ **Responsive Design** - Looks great on all devices
- ✅ **Dark Theme** - Professional cosmic aesthetic
- ✅ **GitHub Actions** - Automatic deployment on push

---

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Manual deployment to GitHub Pages
npm run ingest       # Regenerate project index
npm run copy-assets  # Copy project images
```

---

## Troubleshooting

**Projects not showing?**
```bash
npm run ingest
npm run copy-assets
npm run build
```

**Images not loading?**
- Make sure images are in the same folder as `.tex` file
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`

**Build fails?**
```bash
rm -rf node_modules
npm install
npm run build
```

---

## Need Help?

1. **Setup questions** → Read `SETUP_GUIDE.md`
2. **Configuration details** → See `PROJECT_CONFIG.md`
3. **LaTeX examples** → Check `EXAMPLE_PROJECT.tex`
4. **Deployment checklist** → Use `DEPLOYMENT_CHECKLIST.md`

---

## Next Steps

1. ✅ Edit `/projects/*/` with your research
2. ✅ Run `npm run dev` and preview
3. ✅ Push to GitHub
4. ✅ Share your portfolio!

**Happy presenting! 🚀**
