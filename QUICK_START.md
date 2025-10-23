# 🚀 Crypto Tracker CLI - Quick Start Guide

## 📦 Installation (One-Time Setup)

```bash
cd /home/kayra/Masaüstü/coinspy
npm install
sudo npm link
chmod +x start.sh crypto-menu.py crypto-menu.sh
```

---

## 🎯 3 Ways to Use

### 1️⃣ Interactive Launcher (EASIEST - Recommended for Everyone)

```bash
./start.sh
```

**What you get:**
- Main menu with 3 modes
- Quick actions (Top 10, Trending, etc.)
- Interactive menu with guided prompts
- Direct CLI access

**Best for:** First-time users, quick checks

---

### 2️⃣ Interactive Menu (EASY - Recommended for Beginners)

```bash
./crypto-menu.py
# OR
npm run menu
```

**What you get:**
- Numbered menu (1-11)
- All features with step-by-step prompts
- No need to remember commands
- Colorful, user-friendly interface

**Best for:** Regular use, exploring features

---

### 3️⃣ Direct CLI Commands (ADVANCED - For Power Users)

```bash
crypto <command> [options]
```

**What you get:**
- Full control with command-line arguments
- Fast execution
- Scriptable and automatable
- Can be used in aliases/scripts

**Best for:** Advanced users, automation, scripting

---

## ⚡ Most Common Commands

### Quick View
```bash
crypto list -n 10 --desc     # Top 10 coins
crypto trending              # Trending coins
crypto detail bitcoin        # Bitcoin details
```

### Favorites
```bash
crypto add bitcoin           # Add to favorites
crypto favorites             # View favorites
crypto watch                 # Watch in real-time
```

### Compare & Convert
```bash
crypto compare bitcoin ethereum    # Compare coins
crypto convert 1 btc eth          # Convert
```

### Alerts
```bash
crypto alert add bitcoin -t above -p 110000
crypto alert list
```

---

## 📋 NPM Scripts

```bash
npm run launcher    # Start interactive launcher
npm run menu        # Start Python menu
npm run menu:sh     # Start Bash menu
npm start           # Direct CLI (shows help)
```

---

## 🎨 Desktop Integration

**Double-click to run:**
```bash
crypto-tracker.desktop
```

Copy to applications folder:
```bash
cp crypto-tracker.desktop ~/.local/share/applications/
```

---

## 💡 Pro Tips

### Create Aliases (Add to ~/.bashrc)
```bash
alias ct='crypto'
alias ctm='cd /home/kayra/Masaüstü/coinspy && ./crypto-menu.py'
alias cts='cd /home/kayra/Masaüstü/coinspy && ./start.sh'
alias ctl='crypto list -n 10 --desc'
alias ctf='crypto favorites'
```

Then use:
```bash
cts     # Quick start
ctm     # Quick menu
ctl     # Top 10 list
ctf     # View favorites
```

---

## 🆘 Need Help?

```bash
crypto --help                # General help
crypto <command> --help      # Command help
cat USAGE_EXAMPLES.md        # Detailed examples
cat README.md                # Full documentation
```

---

## 🎯 Recommended Workflow

### For Beginners:
1. Run `./start.sh`
2. Select option `[1]` Interactive Menu
3. Explore features using numbered options

### For Regular Users:
1. Run `./crypto-menu.py` directly
2. Use quick favorites: `crypto favorites`
3. Set up watch mode: `crypto watch`

### For Power Users:
1. Use direct commands: `crypto list`, `crypto detail bitcoin`
2. Create aliases for common tasks
3. Set up cron jobs for exports

---

## 📊 Example Session

```bash
# Start the launcher
./start.sh

# Select [2] Quick Actions
# Select [1] Show Top 10 Coins
# ✅ View top cryptocurrencies

# Then select [6] View My Favorites
# ⚠️ No favorites yet

# Exit and add favorites
crypto add bitcoin
crypto add ethereum
crypto add solana

# View favorites
crypto favorites

# Watch in real-time
crypto watch -i 30
```

---

## 🔥 Most Popular Features

1. **📊 List** - `crypto list -n 10 --desc`
2. **⭐ Favorites** - `crypto favorites`
3. **📈 Details** - `crypto detail bitcoin`
4. **🔥 Trending** - `crypto trending`
5. **⚖️ Compare** - `crypto compare bitcoin ethereum`
6. **👁️ Watch** - `crypto watch`

---

**Ready to start? Run:**
```bash
./start.sh
```

**Questions? Check:**
- `USAGE_EXAMPLES.md` - Detailed examples
- `README.md` - Full documentation
- `crypto --help` - Command reference
