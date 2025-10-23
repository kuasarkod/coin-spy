#!/bin/bash

# Quick Start Script for Crypto Tracker CLI
# This script provides easy access to both menu and direct commands

CYAN='\033[96m'
GREEN='\033[92m'
YELLOW='\033[93m'
RED='\033[91m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo -e "${CYAN}${BOLD}"
cat << "EOF"
   ____ ______   ______ _____ ___    _____ ____      _    ____ _  _______ ____  
  / ___|  _ \ \ / /  _ \_   _/ _ \  |_   _|  _ \    / \  / ___| |/ / ____|  _ \ 
 | |   | |_) \ V /| |_) || || | | |   | | | |_) |  / _ \| |   | ' /|  _| | |_) |
 | |___|  _ < | | |  __/ | || |_| |   | | |  _ <  / ___ \ |___| . \| |___|  _ < 
  \____|_| \_\|_| |_|    |_| \___/    |_| |_| \_\/_/   \_\____|_|\_\_____|_| \_\
                                                                                
EOF
echo -e "${NC}"
echo -e "${BOLD}Welcome to Crypto Tracker CLI!${NC}"
echo -e "${YELLOW}Coded by ${BOLD}kuasarkod${NC}${YELLOW} | Discord: ${BOLD}kuasarkod${NC}\n"
echo -e "Choose how you want to use the application:\n"
echo -e "${GREEN}[1]${NC} 🎯 Interactive Menu (Easy - Recommended)"
echo -e "${GREEN}[2]${NC} ⚡ Quick Actions"
echo -e "${GREEN}[3]${NC} 💻 Direct CLI Mode"
echo -e "${RED}[0]${NC} 🚪 Exit\n"

echo -ne "${CYAN}Select option: ${NC}"
read -r choice

case $choice in
    1)
        echo -e "\n${GREEN}Starting interactive menu...${NC}\n"
        sleep 1
        if command -v python3 &> /dev/null; then
            python3 crypto-menu.py
        else
            ./crypto-menu.sh
        fi
        ;;
    2)
        clear
        echo -e "${BOLD}⚡ Quick Actions${NC}\n"
        echo -e "${GREEN}[1]${NC} 📊 Show Top 10 Coins"
        echo -e "${GREEN}[2]${NC} 🔥 Show Trending Coins"
        echo -e "${GREEN}[3]${NC} 📈 Bitcoin Details"
        echo -e "${GREEN}[4]${NC} 📈 Ethereum Details"
        echo -e "${GREEN}[5]${NC} ⚖️  Compare Bitcoin vs Ethereum"
        echo -e "${GREEN}[6]${NC} ⭐ View My Favorites"
        echo -e "${RED}[0]${NC} 🔙 Back\n"
        
        echo -ne "${CYAN}Select quick action: ${NC}"
        read -r quick_choice
        
        echo ""
        case $quick_choice in
            1) crypto list -n 10 --desc ;;
            2) crypto trending ;;
            3) crypto detail bitcoin ;;
            4) crypto detail ethereum ;;
            5) crypto compare bitcoin ethereum ;;
            6) crypto favorites ;;
            0) exec "$0" ;;
            *) echo -e "${RED}Invalid option!${NC}" ;;
        esac
        
        echo -e "\n${YELLOW}Press ENTER to continue...${NC}"
        read -r
        exec "$0"
        ;;
    3)
        clear
        echo -e "${GREEN}Direct CLI Mode${NC}\n"
        echo -e "You can now use ${BOLD}crypto${NC} commands directly."
        echo -e "Examples:"
        echo -e "  ${CYAN}crypto list -n 10${NC}"
        echo -e "  ${CYAN}crypto detail bitcoin${NC}"
        echo -e "  ${CYAN}crypto trending${NC}"
        echo -e "\nType ${BOLD}crypto --help${NC} for all available commands.\n"
        echo -e "Type ${BOLD}exit${NC} to quit.\n"
        
        # Start interactive shell
        bash
        ;;
    0)
        echo -e "\n${GREEN}Goodbye! 👋${NC}\n"
        exit 0
        ;;
    *)
        echo -e "\n${RED}Invalid option!${NC}"
        sleep 1
        exec "$0"
        ;;
esac
