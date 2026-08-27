# ylau674.github.io

Personal GitHub Pages site for Andy Lau's game guides and browser tools.

## Local structure

- `index.html` - landing page and table of contents
- `guides/children-of-mana.html`
- `guides/jump-super-stars.html`
- `guides/theme-park.html`
- `guides/goemon.html`

The existing PADI Scuba Dive Log remains in its own repository and is linked from the home page:

<https://ylau674.github.io/padi-scuba-dive-log/>

## Publish to GitHub Pages

Create a public GitHub repository named exactly `ylau674.github.io`, then run:

```bash
git init
git add .
git commit -m "Create personal GitHub Pages site"
git branch -M main
git remote add origin https://github.com/ylau674/ylau674.github.io.git
git push -u origin main
```

In GitHub, open **Settings -> Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save. The site will be available at:

<https://ylau674.github.io/>
