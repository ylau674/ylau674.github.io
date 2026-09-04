# Currency Compass

A simple, mobile-first currency converter with a configurable home currency, a watchlist, country flags, real-time amount conversion, and reference rates.

The catalog includes 34 major fiat and regional currencies plus Bitcoin. Fiat quotes come from ExchangeRate-API and Bitcoin quotes come from CoinGecko when online.

Watchlist order, selected currencies, default currency, and the current amount are saved in the browser with `localStorage`, so they persist across refreshes on the same device and browser.

The app uses the supplied `ryougae_dollar_yen.png` artwork for its 32x32 tab favicon and 180x180 Apple touch icon for iPhone home-screen shortcuts. A top-right `10s` toggle can automatically refresh rates every ten seconds and remembers its setting.

## Run

Open `index.html` directly in a browser. The page uses the Frankfurter API for current exchange rates and falls back to indicative bundled rates when offline.
