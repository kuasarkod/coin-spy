# Crypto Tracker CLI - Usage Examples

## 🎯 Interactive Menu Mode (Easiest)

### Start the Menu
```bash
./start.sh
# Then select option [1] for Interactive Menu
```

**OR directly:**
```bash
./crypto-menu.py   # Python version (recommended)
./crypto-menu.sh   # Bash version
```

The menu will guide you through all features with numbered options and prompts.

---

## ⚡ Quick Actions Mode

```bash
./start.sh
# Then select option [2] for Quick Actions
```

Pre-configured shortcuts for common tasks:
- Top 10 coins
- Trending coins
- Bitcoin/Ethereum details
- Compare BTC vs ETH
- View favorites

---

## 💻 Direct CLI Commands

### List Cryptocurrencies

```bash
# Top 50 coins (default)
crypto list

# Top 10 coins in descending order
crypto list -n 10 --desc

# Top 25 coins in EUR, sorted by price
crypto list -n 25 -c eur -s price --desc

# Sort by 24h change
crypto list -n 20 -s change --desc
```

### Search & Details

```bash
# Search for a coin
crypto search bitcoin
crypto search eth

# View detailed information
crypto detail bitcoin
crypto detail ethereum -c eur

# Trending coins
crypto trending
```

### Favorites Management

```bash
# Add to favorites
crypto add bitcoin
crypto add ethereum
crypto add cardano

# View favorites
crypto favorites
crypto favorites -c try

# Remove from favorites
crypto remove cardano

# Watch favorites in real-time (updates every 60 seconds)
crypto watch
crypto watch -i 30 -c usd
```

### Conversions & Comparisons

```bash
# Convert cryptocurrencies
crypto convert 1 btc eth
crypto convert 0.5 eth btc
crypto convert 100 usdt btc

# Compare two coins side by side
crypto compare bitcoin ethereum
crypto compare bitcoin solana -c eur
```

### Price Alerts

```bash
# List all alerts
crypto alert list

# Add price alert (notify when Bitcoin goes above $110,000)
crypto alert add bitcoin -t above -p 110000

# Add alert for Ethereum below $3,500
crypto alert add ethereum -t below -p 3500 -c usd

# Remove alert
crypto alert remove bitcoin -t above
```

### Export Data

```bash
# Export favorites to CSV (auto-generated filename)
crypto export

# Export with custom filename
crypto export -o my-portfolio.csv

# Export in different currency
crypto export -c eur -o portfolio-eur.csv
```

---

## 🔧 Advanced Usage

### Custom Configuration

Create a `.env` file:
```bash
cp .env.example .env
nano .env
```

Edit settings:
```env
DEFAULT_CURRENCY=eur
DEFAULT_SORT=price
CACHE_TTL_SECONDS=120
```

### Chaining Commands

```bash
# Add multiple favorites at once
crypto add bitcoin && crypto add ethereum && crypto add solana

# Quick portfolio check
crypto favorites && crypto export
```

### Using with Watch/Cron

```bash
# Watch mode with custom interval
crypto watch -i 15 -c usd

# Export favorites every hour (add to crontab)
0 * * * * cd /home/kayra/Masaüstü/coinspy && crypto export -o /path/to/backup.csv
```

---

## 📊 Real-World Scenarios

### Scenario 1: Daily Portfolio Tracking
```bash
# Morning routine
./start.sh
# Select [2] Quick Actions
# Select [6] View My Favorites

# Or directly:
crypto favorites -c usd
```

### Scenario 2: Research New Coin
```bash
# Search and explore
crypto search solana
# Select from interactive list
# View 7-day chart and details

# Compare with similar coins
crypto compare solana ethereum
```

### Scenario 3: Set Price Alerts
```bash
# Monitor Bitcoin price
crypto alert add bitcoin -t above -p 110000
crypto alert add bitcoin -t below -p 100000

# Check alerts
crypto alert list

# Start watching (alerts will trigger)
crypto watch -i 60
```

### Scenario 4: Export for Tax/Accounting
```bash
# Export current portfolio
crypto export -c usd -o portfolio-2025-01.csv

# View in spreadsheet
libreoffice exports/portfolio-2025-01.csv
```

---

## 🎨 Tips & Tricks

### 1. Use Aliases
Add to `~/.bashrc` or `~/.zshrc`:
```bash
alias ct='crypto'
alias ctl='crypto list -n 10 --desc'
alias ctf='crypto favorites'
alias ctw='crypto watch -i 30'
alias ctt='crypto trending'
```

Then use:
```bash
ctl        # Quick top 10 list
ctf        # View favorites
ctw        # Watch mode
```

### 2. Quick Coin Check
```bash
# One-liner for quick price check
crypto detail bitcoin | grep "Current Price"
```

### 3. Background Watching
```bash
# Run watch mode in background with screen/tmux
screen -S crypto-watch
crypto watch -i 60
# Detach with Ctrl+A, D
# Reattach with: screen -r crypto-watch
```

### 4. Combine with Other Tools
```bash
# Pipe to grep for filtering
crypto list -n 50 | grep -i "bitcoin\|ethereum"

# Export and analyze with awk
crypto export -o data.csv
awk -F',' '{print $2, $4}' data.csv
```

---

## 🆘 Troubleshooting

### Rate Limit Errors
```bash
# Wait 60 seconds between requests
# Or use cached data by running same command again
crypto list  # Fetches from API
crypto list  # Uses cache (within 60s)
```

### No Favorites Found
```bash
# Add some favorites first
crypto add bitcoin
crypto add ethereum
crypto favorites
```

### Permission Denied
```bash
# Make scripts executable
chmod +x start.sh crypto-menu.py crypto-menu.sh
```

### Command Not Found
```bash
# Link globally
sudo npm link

# Or use direct path
node bin/index.js list
```

---

## 📚 Help & Documentation

```bash
# General help
crypto --help

# Command-specific help
crypto list --help
crypto detail --help
crypto alert --help
```

For more information, see [README.md](README.md)
