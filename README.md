# Crypto Tracker CLI

Professional command-line cryptocurrency tracker powered by the CoinGecko API. Built with Node.js and designed for real-time monitoring, price alerts, conversions, exporting, and more.

**Coded by:** [kuasarkod](https://discord.com/users/kuasarkod) | **Discord:** kuasarkod

## 🚀 Quick Start

```bash
./start.sh
```

This launches an interactive launcher with three modes:
1. **Interactive Menu** - User-friendly numbered menu (best for beginners)
2. **Quick Actions** - One-click access to common tasks
3. **Direct CLI** - Full command-line access for advanced users

## Features

- **Rich CLI**: Command-based workflow using `commander` with contextual help for every command.
- **Colorful UX**: Styled terminal output via `chalk`, `ora`, `cli-table3`, and `figlet` banner.
- **Real-time Data**: Fetches market data, trending coins, detailed stats, and ASCII price charts.
- **Favorites & Alerts**: Persist favorite coins, watch in real-time, and configure price alerts with system notifications.
- **Utilities**: Currency conversion, coin comparison, CSV export, offline caching, and retry with rate limiting.
- **Configurable**: Multi-currency support, user preferences, environment variables, and local data storage with `conf`.

## Prerequisites

- Node.js **>= 18.0.0**
- npm (bundled with Node.js)

## Installation

```bash
# Navigate to project directory
cd /home/kayra/Masaüstü/coinspy

# Install dependencies
npm install

# Optional: copy environment variables template
cp .env.example .env

# Link globally to use the `crypto` command everywhere (requires sudo)
sudo npm link

# Make scripts executable
chmod +x start.sh crypto-menu.py crypto-menu.sh
```

**That's it! Now you can run:**
```bash
./start.sh          # Interactive launcher (recommended)
./crypto-menu.py    # Direct menu access
crypto --help       # CLI commands
```

## Environment Variables

Configure overrides in `.env`:

```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
DEFAULT_CURRENCY=usd
DEFAULT_SORT=market_cap
CACHE_TTL_SECONDS=60
REQUEST_TIMEOUT_MS=10000
```

## Usage

### Option 1: Interactive Menu (Recommended for Beginners)

Run the interactive menu for a user-friendly experience:

```bash
# Python version (recommended)
./crypto-menu.py

# OR Bash version
./crypto-menu.sh
```

The menu provides numbered options for all features with guided prompts.

### Option 2: Direct CLI Commands

After global installation, run:

```bash
crypto --help
```

Displays the ASCII banner and overall help. Use `crypto <command> --help` for detailed options per command.

### Commands Overview

- **`crypto list [options]`**: List top cryptocurrencies.
  ```bash
  crypto list --number 25 --currency eur --sort price --desc
  ```
  Displays Rank, Name, Symbol, Price, 24h Change, Market Cap, Volume in a table.

- **`crypto search <coin>`**: Search by name or symbol with interactive selection and detail preview.

- **`crypto detail <coin-id>`**: Show detailed metrics, 7-day ASCII chart, and description.
  ```bash
  crypto detail bitcoin --currency usd
  ```

- **`crypto add <coin-id>` / `crypto remove <coin-id>`**: Manage favorites.

- **`crypto favorites [options]`**: List favorites in a table.

- **`crypto watch [options]`**: Live refresh of favorite coins with alerts and notifications.
  ```bash
  crypto watch --interval 30 --currency try
  ```

- **`crypto convert <amount> <from> <to>`**: Convert between assets.
  ```bash
  crypto convert 1 btc eth
  ```

- **`crypto trending`**: Show trending coins from CoinGecko.

- **`crypto compare <coin1> <coin2> [options]`**: Side-by-side comparison table.

- **`crypto export [options]`**: Export favorites to CSV (`exports/` directory by default).

- **`crypto alert <add|remove|list>`**: Manage price alerts with thresholds and types.
  ```bash
  crypto alert add bitcoin --type above --price 75000
  crypto alert list
  ```

## Favorite Coins & Preferences

Favorites, alerts, and user preferences are stored locally via the `conf` package. Currency and sort selections persist between runs.

## Offline Cache & Rate Limiting

- Responses are cached for **60 seconds** to reduce API calls.
- Automatic retry logic (up to 3 attempts) and rate limiting comply with CoinGecko usage.
- If CoinGecko is unreachable, the CLI serves the latest cached offline data when available.

## Examples

```
██████╗ ██████╗ ██╗   ██╗██████╗ ████████╗ ██████╗ ███████╗██████╗
██╔══██╗██╔══██╗██║   ██║██╔══██╗╚══██╔══╝██╔═████╗██╔════╝██╔══██╗
██████╔╝██████╔╝██║   ██║██████╔╝   ██║   ██║██╔██║█████╗  ██████╔╝
██╔══██╗██╔══██╗██║   ██║██╔═══╝    ██║   ████╔╝██║██╔══╝  ██╔══██╗
██║  ██║██║  ██║╚██████╔╝██║        ██║   ╚██████╔╝███████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝

┌─────┬──────────┬────────┬───────────┬────────────┬───────────┬─────────┐
│Rank │Name      │Symbol  │Price      │24h Change  │Market Cap │Volume   │
├─────┼──────────┼────────┼───────────┼────────────┼───────────┼─────────┤
│1    │Bitcoin   │BTC     │$65,432.10 │+2.50%      │1.3T       │36.4B    │
│2    │Ethereum  │ETH     │$3,456.78  │-0.82%      │414B       │18.2B    │
└─────┴──────────┴────────┴───────────┴────────────┴───────────┴─────────┘
```

## CoinGecko API Usage

Endpoints utilized:

- `/coins/markets`
- `/coins/{id}`
- `/coins/{id}/market_chart`
- `/search`
- `/search/trending`
- `/simple/price`

Respect CoinGecko rate limits (50 calls/minute). Excessive usage may result in rate limiting per their policy.

## Development Scripts

```bash
npm run start   # Launch CLI
npm run dev     # Launch in development mode
npm test        # Placeholder for future tests
```

## Troubleshooting

- **API errors**: Check network connectivity and CoinGecko status. The CLI retries automatically and falls back to cached data when possible.
- **Unsupported currency**: Only `usd`, `eur`, `gbp`, and `try` are supported by default; others fall back to USD.
- **Notifications**: `node-notifier` may require an OS notification service. Optional and non-blocking.

## License

MIT License. See [LICENSE](LICENSE) if provided.
