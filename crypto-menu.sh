#!/bin/bash

# Interactive menu wrapper for Crypto Tracker CLI
# Colors
CYAN='\033[96m'
GREEN='\033[92m'
YELLOW='\033[93m'
RED='\033[91m'
BLUE='\033[94m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Clear screen
clear_screen() {
    clear
}

# Print banner
print_banner() {
    echo -e "${CYAN}${BOLD}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║          CRYPTO TRACKER CLI - Interactive Menu           ║"
    echo "║              Powered by CoinGecko API                     ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo -e "║  ${YELLOW}Coded by: ${BOLD}kuasarkod${CYAN}${BOLD}  |  Discord: ${YELLOW}${BOLD}kuasarkod${CYAN}${BOLD}         ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Print main menu
print_menu() {
    echo -e "${BOLD}═══════════════════ MAIN MENU ═══════════════════${NC}\n"
    echo -e "${GREEN}[1]${NC}  📊 List Top Cryptocurrencies"
    echo -e "${GREEN}[2]${NC}  🔍 Search Cryptocurrency"
    echo -e "${GREEN}[3]${NC}  📈 View Coin Details"
    echo -e "${GREEN}[4]${NC}  ⭐ Manage Favorites"
    echo -e "${GREEN}[5]${NC}  👁️  Watch Favorites (Real-time)"
    echo -e "${GREEN}[6]${NC}  💱 Convert Crypto"
    echo -e "${GREEN}[7]${NC}  🔥 Trending Coins"
    echo -e "${GREEN}[8]${NC}  ⚖️  Compare Two Coins"
    echo -e "${GREEN}[9]${NC}  🔔 Manage Price Alerts"
    echo -e "${GREEN}[10]${NC} 📤 Export Favorites to CSV"
    echo -e "${GREEN}[11]${NC} ⚙️  Settings & Preferences\n"
    echo -e "${RED}[0]${NC}  🚪 Exit\n"
    echo -e "${BOLD}═════════════════════════════════════════════════${NC}"
}

# Pause function
pause() {
    echo -e "\n${YELLOW}Press ENTER to continue...${NC}"
    read -r
}

# Get input with default
get_input() {
    local prompt="$1"
    local default="$2"
    local value
    
    if [ -n "$default" ]; then
        echo -ne "${CYAN}${prompt} [${default}]: ${NC}"
        read -r value
        echo "${value:-$default}"
    else
        echo -ne "${CYAN}${prompt}: ${NC}"
        read -r value
        echo "$value"
    fi
}

# List coins
list_coins() {
    clear_screen
    echo -e "${BOLD}📊 List Top Cryptocurrencies${NC}\n"
    
    count=$(get_input "Number of coins to display" "50")
    currency=$(get_input "Currency (usd/eur/gbp/try)" "usd")
    sort_field=$(get_input "Sort by (market_cap/price/volume/change)" "market_cap")
    desc=$(get_input "Descending order? (y/n)" "y")
    
    cmd="crypto list -n $count -c $currency -s $sort_field"
    if [ "$desc" = "y" ] || [ "$desc" = "Y" ]; then
        cmd="$cmd --desc"
    fi
    
    echo ""
    eval "$cmd"
    pause
}

# Search coin
search_coin() {
    clear_screen
    echo -e "${BOLD}🔍 Search Cryptocurrency${NC}\n"
    
    query=$(get_input "Enter coin name or symbol" "")
    if [ -z "$query" ]; then
        echo -e "${RED}Search query cannot be empty!${NC}"
        pause
        return
    fi
    
    currency=$(get_input "Currency for prices" "usd")
    
    echo ""
    crypto search "$query" -c "$currency"
    pause
}

# View details
view_details() {
    clear_screen
    echo -e "${BOLD}📈 View Coin Details${NC}\n"
    
    coin_id=$(get_input "Enter coin ID (e.g., bitcoin, ethereum)" "")
    if [ -z "$coin_id" ]; then
        echo -e "${RED}Coin ID cannot be empty!${NC}"
        pause
        return
    fi
    
    currency=$(get_input "Currency" "usd")
    
    echo ""
    crypto detail "$coin_id" -c "$currency"
    pause
}

# Manage favorites submenu
manage_favorites() {
    while true; do
        clear_screen
        echo -e "${BOLD}⭐ Manage Favorites${NC}\n"
        echo -e "${GREEN}[1]${NC} View Favorites"
        echo -e "${GREEN}[2]${NC} Add to Favorites"
        echo -e "${GREEN}[3]${NC} Remove from Favorites"
        echo -e "${RED}[0]${NC} Back to Main Menu\n"
        
        choice=$(get_input "Select option" "")
        
        case $choice in
            1)
                currency=$(get_input "Currency" "usd")
                echo ""
                crypto favorites -c "$currency"
                pause
                ;;
            2)
                coin_id=$(get_input "Enter coin ID to add" "")
                if [ -n "$coin_id" ]; then
                    echo ""
                    crypto add "$coin_id"
                    pause
                fi
                ;;
            3)
                coin_id=$(get_input "Enter coin ID to remove" "")
                if [ -n "$coin_id" ]; then
                    echo ""
                    crypto remove "$coin_id"
                    pause
                fi
                ;;
            0)
                break
                ;;
        esac
    done
}

# Watch favorites
watch_favorites() {
    clear_screen
    echo -e "${BOLD}👁️  Watch Favorites (Real-time)${NC}\n"
    echo -e "${YELLOW}Press Ctrl+C to stop watching${NC}\n"
    
    interval=$(get_input "Refresh interval in seconds" "60")
    currency=$(get_input "Currency" "usd")
    
    echo ""
    crypto watch -i "$interval" -c "$currency"
    pause
}

# Convert crypto
convert_crypto() {
    clear_screen
    echo -e "${BOLD}💱 Convert Cryptocurrency${NC}\n"
    
    amount=$(get_input "Amount" "")
    from_coin=$(get_input "From (e.g., btc)" "")
    to_coin=$(get_input "To (e.g., eth)" "")
    
    if [ -n "$amount" ] && [ -n "$from_coin" ] && [ -n "$to_coin" ]; then
        echo ""
        crypto convert "$amount" "$from_coin" "$to_coin"
        pause
    else
        echo -e "${RED}All fields are required!${NC}"
        pause
    fi
}

# Trending coins
trending_coins() {
    clear_screen
    echo -e "${BOLD}🔥 Trending Coins${NC}\n"
    
    crypto trending
    pause
}

# Compare coins
compare_coins() {
    clear_screen
    echo -e "${BOLD}⚖️  Compare Two Coins${NC}\n"
    
    coin1=$(get_input "First coin ID (e.g., bitcoin)" "")
    coin2=$(get_input "Second coin ID (e.g., ethereum)" "")
    currency=$(get_input "Currency" "usd")
    
    if [ -n "$coin1" ] && [ -n "$coin2" ]; then
        echo ""
        crypto compare "$coin1" "$coin2" -c "$currency"
        pause
    else
        echo -e "${RED}Both coin IDs are required!${NC}"
        pause
    fi
}

# Manage alerts submenu
manage_alerts() {
    while true; do
        clear_screen
        echo -e "${BOLD}🔔 Manage Price Alerts${NC}\n"
        echo -e "${GREEN}[1]${NC} List All Alerts"
        echo -e "${GREEN}[2]${NC} Add Price Alert"
        echo -e "${GREEN}[3]${NC} Remove Price Alert"
        echo -e "${RED}[0]${NC} Back to Main Menu\n"
        
        choice=$(get_input "Select option" "")
        
        case $choice in
            1)
                echo ""
                crypto alert list
                pause
                ;;
            2)
                coin_id=$(get_input "Coin ID" "")
                currency=$(get_input "Currency" "usd")
                alert_type=$(get_input "Type (above/below)" "")
                price=$(get_input "Price threshold" "")
                
                if [ -n "$coin_id" ] && [ -n "$alert_type" ] && [ -n "$price" ]; then
                    echo ""
                    crypto alert add "$coin_id" -c "$currency" -t "$alert_type" -p "$price"
                    pause
                fi
                ;;
            3)
                coin_id=$(get_input "Coin ID" "")
                currency=$(get_input "Currency" "usd")
                alert_type=$(get_input "Type (above/below)" "")
                
                if [ -n "$coin_id" ]; then
                    cmd="crypto alert remove $coin_id -c $currency"
                    if [ -n "$alert_type" ]; then
                        cmd="$cmd -t $alert_type"
                    fi
                    echo ""
                    eval "$cmd"
                    pause
                fi
                ;;
            0)
                break
                ;;
        esac
    done
}

# Export favorites
export_favorites() {
    clear_screen
    echo -e "${BOLD}📤 Export Favorites to CSV${NC}\n"
    
    currency=$(get_input "Currency" "usd")
    output=$(get_input "Output file (leave empty for auto-generated)" "")
    
    cmd="crypto export -c $currency"
    if [ -n "$output" ]; then
        cmd="$cmd -o $output"
    fi
    
    echo ""
    eval "$cmd"
    pause
}

# Settings
settings() {
    clear_screen
    echo -e "${BOLD}⚙️  Settings & Preferences${NC}\n"
    echo -e "${YELLOW}Current configuration:${NC}"
    echo "  - Default currency: USD"
    echo "  - Default sort: Market Cap"
    echo "  - Cache TTL: 60 seconds"
    echo -e "\n${CYAN}To change settings, edit .env file in project root${NC}"
    pause
}

# Main loop
main() {
    while true; do
        clear_screen
        print_banner
        print_menu
        
        choice=$(get_input "Select an option" "")
        
        case $choice in
            1) list_coins ;;
            2) search_coin ;;
            3) view_details ;;
            4) manage_favorites ;;
            5) watch_favorites ;;
            6) convert_crypto ;;
            7) trending_coins ;;
            8) compare_coins ;;
            9) manage_alerts ;;
            10) export_favorites ;;
            11) settings ;;
            0)
                clear_screen
                echo -e "${GREEN}Thank you for using Crypto Tracker CLI! 👋${NC}\n"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option! Please try again.${NC}"
                pause
                ;;
        esac
    done
}

# Run main
main
