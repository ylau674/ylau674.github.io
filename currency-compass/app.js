const currencies = {
  USD: { name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  EUR: { name: "Euro", flag: "🇪🇺", symbol: "€" },
  GBP: { name: "British Pound", flag: "🇬🇧", symbol: "£" },
  JPY: { name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  AUD: { name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  CAD: { name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  CHF: { name: "Swiss Franc", flag: "🇨🇭", symbol: "CHF" },
  CNY: { name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
  HKD: { name: "Hong Kong Dollar", flag: "🇭🇰", symbol: "HK$" },
  NZD: { name: "New Zealand Dollar", flag: "🇳🇿", symbol: "NZ$" },
  SGD: { name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  SEK: { name: "Swedish Krona", flag: "🇸🇪", symbol: "kr" },
  INR: { name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  BRL: { name: "Brazilian Real", flag: "🇧🇷", symbol: "R$" },
  MXN: { name: "Mexican Peso", flag: "🇲🇽", symbol: "MX$" },
  KRW: { name: "South Korean Won", flag: "🇰🇷", symbol: "₩" },
  RUB: { name: "Russian Ruble", flag: "🇷🇺", symbol: "₽" },
  TRY: { name: "Turkish Lira", flag: "🇹🇷", symbol: "₺" },
  PLN: { name: "Polish Zloty", flag: "🇵🇱", symbol: "zł" },
  THB: { name: "Thai Baht", flag: "🇹🇭", symbol: "฿" },
  IDR: { name: "Indonesian Rupiah", flag: "🇮🇩", symbol: "Rp" },
  MYR: { name: "Malaysian Ringgit", flag: "🇲🇾", symbol: "RM" },
  PHP: { name: "Philippine Peso", flag: "🇵🇭", symbol: "₱" },
  VND: { name: "Vietnamese Dong", flag: "🇻🇳", symbol: "₫" },
  AED: { name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
  SAR: { name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
  ILS: { name: "Israeli Shekel", flag: "🇮🇱", symbol: "₪" },
  NOK: { name: "Norwegian Krone", flag: "🇳🇴", symbol: "kr" },
  DKK: { name: "Danish Krone", flag: "🇩🇰", symbol: "kr" },
  CZK: { name: "Czech Koruna", flag: "🇨🇿", symbol: "Kč" },
  HUF: { name: "Hungarian Forint", flag: "🇭🇺", symbol: "Ft" },
  RON: { name: "Romanian Leu", flag: "🇷🇴", symbol: "lei" },
  BGN: { name: "Bulgarian Lev", flag: "🇧🇬", symbol: "лв" },
  ISK: { name: "Icelandic Krona", flag: "🇮🇸", symbol: "kr" },
  BTC: { name: "Bitcoin", flag: "₿", symbol: "₿" }
};

const fallbackRates = { USD: 1, EUR: 0.856, GBP: 0.749, JPY: 157.2, AUD: 1.52, CAD: 1.38, CHF: 0.80, CNY: 7.12, HKD: 7.85, NZD: 1.75, SGD: 1.29, SEK: 9.45, INR: 83.5, BRL: 5.45, MXN: 19.2, KRW: 1380, RUB: 89, TRY: 34, PLN: 3.9, THB: 34.5, IDR: 15600, MYR: 4.3, PHP: 57.5, VND: 24500, AED: 3.67, SAR: 3.75, ILS: 3.7, NOK: 10.7, DKK: 6.4, CZK: 22.5, HUF: 360, RON: 4.6, BGN: 1.67, ISK: 137, BTC: 0.0000167 };
const settingsKey = "currency-compass-settings";
let base = "USD";
let selected = ["EUR", "GBP", "JPY", "AUD"];
let autoRefresh = false;
let rates = { ...fallbackRates };

const baseSelect = document.querySelector("#base-currency");
const amountInput = document.querySelector("#amount");
const rateList = document.querySelector("#rate-list");
const optionList = document.querySelector("#currency-options");
const amountSymbol = document.querySelector("#amount-symbol");
const amountCode = document.querySelector("#amount-code");
const updatedLabel = document.querySelector("#updated-label");
const statusLabel = document.querySelector("#status-label");
const searchInput = document.querySelector("#currency-search-input");
const autoRefreshButton = document.querySelector("#auto-refresh");
let refreshTimer;

function restoreSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(settingsKey));
    if (!saved || typeof saved !== "object") return;
    if (typeof saved.base === "string" && currencies[saved.base]) base = saved.base;
    if (Array.isArray(saved.selected)) {
      selected = saved.selected.filter(code => currencies[code] && code !== base);
    }
    if (typeof saved.amount === "string" && Number(saved.amount) >= 0) amountInput.value = saved.amount;
    if (typeof saved.autoRefresh === "boolean") autoRefresh = saved.autoRefresh;
  } catch {
    // Ignore unavailable or malformed browser storage and keep defaults.
  }
}

function saveSettings() {
  try {
    localStorage.setItem(settingsKey, JSON.stringify({ base, selected, amount: amountInput.value, autoRefresh }));
  } catch {
    // The converter remains usable when browser storage is unavailable.
  }
}

function renderBaseOptions() {
  baseSelect.innerHTML = Object.entries(currencies).map(([code, currency]) =>
    `<option value="${code}" ${code === base ? "selected" : ""}>${currency.flag}  ${code} · ${currency.name}</option>`
  ).join("");
}

function renderOptions() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    optionList.innerHTML = `<p class="search-hint">Search the currency catalog to add a destination.</p>`;
    return;
  }
  const matches = Object.entries(currencies).filter(([code, currency]) => {
    return code !== base && !selected.includes(code) && `${code} ${currency.name}`.toLowerCase().includes(query);
  });
  optionList.innerHTML = matches.map(([code, currency]) => {
    return `<button class="currency-option" data-code="${code}" aria-label="Add ${currency.name}" title="Add to watchlist"><span class="flag">${currency.flag}</span><span class="option-copy"><strong>${currency.name}</strong><small>${code}</small></span><span class="add-icon" aria-hidden="true">+</span></button>`;
  }).join("") || `<p class="search-hint">No currencies match “${searchInput.value.trim()}”.</p>`;
}

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function formatUpdatedAt(date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  }).format(date);
}

function renderRates() {
  const amount = Math.max(0, Number(amountInput.value) || 0);
  document.querySelector("#currency-count").textContent = `${selected.length} ${selected.length === 1 ? "currency" : "currencies"}`;
  rateList.innerHTML = selected.map((code, index) => {
    const currency = currencies[code];
    const rate = rates[code] ?? 0;
    return `<article class="rate-card" data-code="${code}" style="animation-delay: ${index * 45}ms"><button class="move-button move-down" data-move="down" data-code="${code}" aria-label="Move ${currency.name} down" title="Move down" ${index === selected.length - 1 ? "disabled" : ""}>↓</button><span class="flag" aria-hidden="true">${currency.flag}</span><div><div class="currency-name">${currency.name}</div><div class="rate-reference">1 ${base} = ${formatNumber(rate, rate < 10 ? 4 : 2)} ${code}</div></div><div class="converted-amount">${currency.symbol}${formatNumber(amount * rate)}</div><button class="move-button move-up" data-move="up" data-code="${code}" aria-label="Move ${currency.name} up" title="Move up" ${index === 0 ? "disabled" : ""}>↑</button><button class="remove-button" data-remove="${code}" aria-label="Remove ${currency.name}" title="Remove currency">×</button></article>`;
  }).join("") || `<p class="rate-reference">Add a currency below to start your watchlist.</p>`;
}

function render() {
  amountSymbol.textContent = currencies[base].symbol;
  amountCode.textContent = base;
  renderRates();
  renderOptions();
  saveSettings();
}

function setAutoRefresh(enabled) {
  autoRefresh = enabled;
  autoRefreshButton.setAttribute("aria-pressed", String(autoRefresh));
  autoRefreshButton.classList.toggle("is-active", autoRefresh);
  clearInterval(refreshTimer);
  if (autoRefresh) refreshTimer = setInterval(fetchRates, 10000);
  saveSettings();
}

async function fetchRates() {
  statusLabel.textContent = "Updating...";
  try {
    const quoteBase = base === "BTC" ? "USD" : base;
    const [exchangeResponse, bitcoinResponse] = await Promise.all([
      fetch(`https://open.er-api.com/v6/latest/${quoteBase}`),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    ]);
    if (!exchangeResponse.ok || !bitcoinResponse.ok) throw new Error("Rate request failed");
    const exchangeData = await exchangeResponse.json();
    const bitcoinData = await bitcoinResponse.json();
    if (exchangeData.result !== "success" || !bitcoinData.bitcoin?.usd) throw new Error("Rate data unavailable");
    const bitcoinUsd = bitcoinData.bitcoin.usd;
    rates = base === "BTC"
      ? { BTC: 1, ...Object.fromEntries(Object.entries(exchangeData.rates).map(([code, rate]) => [code, rate * bitcoinUsd])) }
      : { [base]: 1, ...exchangeData.rates, BTC: exchangeData.rates.USD / bitcoinUsd };
    statusLabel.textContent = "Live rates";
    updatedLabel.textContent = `Updated ${formatUpdatedAt(new Date())} · 1 ${base} reference rate`;
  } catch {
    const baseUsdRate = fallbackRates[base] || 1;
    rates = Object.fromEntries(Object.keys(currencies).map(code => [code, (fallbackRates[code] || 1) / baseUsdRate]));
    statusLabel.textContent = "Offline rates";
    updatedLabel.textContent = `Showing indicative rates · update attempted ${formatUpdatedAt(new Date())}`;
  }
  renderRates();
}

baseSelect.addEventListener("change", () => {
  const previousBase = base;
  base = baseSelect.value;
  selected = [previousBase, ...selected.filter(code => code !== base && code !== previousBase)];
  renderBaseOptions();
  render();
  fetchRates();
});
amountInput.addEventListener("input", () => {
  saveSettings();
  renderRates();
});
optionList.addEventListener("click", event => {
  const button = event.target.closest("button[data-code]");
  if (!button || button.disabled) return;
  selected.unshift(button.dataset.code);
  searchInput.value = "";
  render();
});
searchInput.addEventListener("input", renderOptions);
autoRefreshButton.addEventListener("click", () => setAutoRefresh(!autoRefresh));
rateList.addEventListener("click", event => {
  const button = event.target.closest("button[data-remove]");
  if (button) {
    selected = selected.filter(code => code !== button.dataset.remove);
    render();
    return;
  }
  const moveButton = event.target.closest("button[data-move]");
  if (!moveButton || moveButton.disabled) return;
  const currentIndex = selected.indexOf(moveButton.dataset.code);
  const nextIndex = moveButton.dataset.move === "up" ? currentIndex - 1 : currentIndex + 1;
  [selected[currentIndex], selected[nextIndex]] = [selected[nextIndex], selected[currentIndex]];
  render();
});

restoreSettings();
renderBaseOptions();
render();
setAutoRefresh(autoRefresh);
fetchRates();
