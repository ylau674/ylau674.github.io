# ylau674.github.io

Personal GitHub Pages site for Andy Lau's game guides and browser tools.

## Local structure

- `index.html` - landing page and table of contents
- `guides/children-of-mana.html`
- `guides/jump-super-stars.html`
- `guides/theme-park.html`
- `guides/goemon.html`
- `guides/super-robot-w.html`
- `guides/zelda-phantom-hourglass.html`
- `guides/mecha-mg.html`
- `guides/f-zero-gx.html`
- `currency-compass/` - mobile-first currency converter and watchlist

Currency Compass includes a searchable catalog of 34 fiat currencies plus Bitcoin, configurable default currency and amount, persistent browser settings, and touch-friendly arrow controls for watchlist ordering.

## Published pages

- <https://ylau674.github.io/> - homepage and table of contents
- <https://ylau674.github.io/guides/children-of-mana.html>
- <https://ylau674.github.io/guides/jump-super-stars.html>
- <https://ylau674.github.io/guides/theme-park.html>
- <https://ylau674.github.io/guides/goemon.html>
- <https://ylau674.github.io/guides/super-robot-w.html>
- <https://ylau674.github.io/guides/zelda-phantom-hourglass.html>
- <https://ylau674.github.io/guides/mecha-mg.html>
- <https://ylau674.github.io/guides/f-zero-gx.html>
- <https://ylau674.github.io/currency-compass/> - Currency Compass converter
- <https://ylau674.github.io/padi-scuba-dive-log/> - separate project repository

Currency Compass uses ExchangeRate-API for fiat quotes and CoinGecko for Bitcoin quotes when live network access is available. It falls back to bundled indicative rates when a request fails.

The existing PADI Scuba Dive Log remains in its own repository and is linked from the home page:

<https://ylau674.github.io/padi-scuba-dive-log/>

## Publish to GitHub Pages

This repository is already configured to publish from the `main` branch. To update the site locally, run:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

In GitHub, open **Settings -> Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save. The site will be available at:

<https://ylau674.github.io/>
