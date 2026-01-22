# Setup Guide for GitHub Pages Deployment

## Prerequisites

- Node.js 18+ installed
- GitHub repository created
- Git configured locally

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your projects:**
   - Create folders in `/projects/` (e.g., `Project-1/`)
   - Add `.tex` files and images to each project folder
   - Files are automatically indexed on build

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment Options

### Option A: GitHub Actions (Automatic - Recommended)

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

3. **GitHub Actions will automatically:**
   - Build the project
   - Deploy to GitHub Pages
   - Update on every push to `main` branch

4. **Access your site:**
   - `https://yourusername.github.io/your-repo/`

### Option B: Manual Deployment with gh-pages

1. **Configure git credentials:**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Access your site:**
   - `https://yourusername.github.io/your-repo/`

## Custom Domain Setup

1. **Update repository base URL** in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/',  // For custom domain
     // ... rest of config
   })
   ```

2. **Add domain to `public/CNAME`:**
   ```
   yourdomain.com
   ```

3. **Update GitHub Actions** in `.github/workflows/deploy.yml`:
   ```yaml
   cname: yourdomain.com
   ```

4. **Configure DNS** with your domain provider to point to GitHub Pages

## Project Structure

```
projects/
├── Project-Name-1/
│   ├── Project_1.tex          # Main LaTeX file
│   ├── image1.png             # Images
│   └── image2.pdf
├── Project-Name-2/
│   ├── Project_2.tex
│   └── figures/
│       └── diagram.png
```

## Supported LaTeX Commands

### Text Formatting
- `\textbf{text}` - Bold
- `\textit{text}` - Italic
- `\texttt{text}` - Monospace

### Sections
- `\section{Title}`
- `\subsection{Title}`
- `\subsubsection{Title}`

### Math
- Inline: `$E=mc^2$`
- Display: `\[E=mc^2\]` or `$$E=mc^2$$`
- Environments: `equation`, `align`, `gather`, `eqnarray`

### Lists
- `\begin{itemize}` ... `\end{itemize}`
- `\begin{enumerate}` ... `\end{enumerate}`

### Figures and Images
- `\includegraphics{imagename.png}`
- `\begin{figure}...\end{figure}`
- `\caption{...}`

## Troubleshooting

### Projects not showing up
- Ensure `.tex` files are directly in project folders
- Run: `npm run ingest` to regenerate index
- Check `projectIndex.json` in `/projects` folder

### Images not loading
- Verify images are in the same folder as `.tex` file
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`
- Run: `npm run copy-assets` to copy images

### Build errors
- Clear `node_modules`: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist`
- Try: `npm run build`

### Deployment issues
- Check GitHub Pages settings (Settings → Pages → Source: Deploy from branch)
- Verify `gh-pages` branch exists and is set as deployment source
- Ensure `main` branch contains all changes

## Environment Variables

Create `.env` file (copy from `.env.example`):
```
VITE_BASE_URL=/
```

For subdirectory deployment, set:
```
VITE_BASE_URL=/your-repo-name/
```

Then update `vite.config.ts`:
```typescript
base: process.env.VITE_BASE_URL || '/',
```

## Performance Tips

1. **Optimize images:**
   - Compress before adding to projects
   - Use `.webp` format for better compression
   - Size large images to ~1200px width

2. **LaTeX best practices:**
   - Keep equations readable
   - Use proper naming in `\label{}`
   - Reference with `\ref{}` or `\eqref{}`

3. **Project organization:**
   - Group related images in subfolders
   - Use descriptive filenames
   - Keep `.tex` files well-documented

## Support

For issues or questions:
1. Check README.md for feature documentation
2. Review example projects in `/projects/` folder
3. Check GitHub Issues for known problems
4. Review LaTeX documentation for syntax issues

---

Happy deploying! 🚀
