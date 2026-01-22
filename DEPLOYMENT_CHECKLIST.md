# Deployment Checklist

Before deploying to GitHub Pages, ensure:

## Pre-Deployment

- [ ] All projects are in `/projects/` folder with `.tex` files
- [ ] All images are in project folders alongside `.tex` files
- [ ] All image references in `.tex` use relative paths (no leading `/`)
- [ ] Tested locally with `npm run dev`
- [ ] Built successfully with `npm run build`
- [ ] No console errors in browser dev tools
- [ ] All project links work correctly

## GitHub Setup

- [ ] Created GitHub repository
- [ ] Repository is public (required for GitHub Pages free tier)
- [ ] Main branch is set as default
- [ ] GitHub Pages is enabled in repository settings
- [ ] Source is set to "Deploy from a branch"
- [ ] Branch is set to `main` with `/root` folder

## Deployment

### Option A: GitHub Actions (Automatic)

- [ ] `.github/workflows/deploy.yml` exists
- [ ] Workflow file has correct triggers
- [ ] Code is committed and pushed to `main`
- [ ] Check "Actions" tab to see workflow run
- [ ] Wait for green checkmark (deployment successful)
- [ ] Access `https://yourusername.github.io/repo-name/`

### Option B: Manual Deployment

- [ ] Git configured with credentials
- [ ] Run: `npm run deploy`
- [ ] Check `gh-pages` branch was created
- [ ] GitHub Pages settings point to `gh-pages` branch
- [ ] Site accessible after 1-2 minutes

## Post-Deployment

- [ ] All pages load correctly
- [ ] Navigation works (Home and project links)
- [ ] Images display properly
- [ ] Equations render correctly
- [ ] Responsive design works on mobile
- [ ] Dark theme looks good
- [ ] All animations work smoothly

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 errors | Check base URL in `vite.config.ts` |
| Images not loading | Verify in `/public/assets/` folder |
| Build fails | Run `npm install` and `npm run copy-assets` |
| Workflow errors | Check `.github/workflows/deploy.yml` syntax |
| Site blank | Check console for JavaScript errors |

## Custom Domain

- [ ] Domain purchased and configured
- [ ] DNS records point to GitHub Pages IPs
- [ ] `CNAME` file in `/public/` with domain name
- [ ] `.github/workflows/deploy.yml` has `cname:` field filled
- [ ] DNS propagation complete (up to 48 hours)

## Performance Optimization

- [ ] Images optimized (< 1MB each)
- [ ] Large images scaled down
- [ ] No unnecessary dependencies
- [ ] Build size is reasonable (< 5MB)
- [ ] Lazy loading for images working

---

**Deployment Status:** Ready ✅
