#!/usr/bin/env python3
"""
Interactive menu wrapper for Crypto Tracker CLI
"""
import os
import sys
import subprocess
from typing import Optional

# ANSI color codes
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def clear_screen():
    """Clear terminal screen"""
    os.system('clear' if os.name != 'nt' else 'cls')

def print_banner():
    """Print application banner"""
    banner = f"""{Colors.CYAN}{Colors.BOLD}
╔═══════════════════════════════════════════════════════════╗
║          CRYPTO TRACKER CLI - Interactive Menu           ║
║              Powered by CoinGecko API                     ║
╠═══════════════════════════════════════════════════════════╣
║  {Colors.YELLOW}Coded by: {Colors.BOLD}kuasarkod{Colors.CYAN}{Colors.BOLD}  |  Discord: {Colors.YELLOW}{Colors.BOLD}kuasarkod{Colors.CYAN}{Colors.BOLD}         ║
╚═══════════════════════════════════════════════════════════╝
{Colors.END}"""
    print(banner)

def print_menu():
    """Display main menu"""
    menu = f"""
{Colors.BOLD}═══════════════════ MAIN MENU ═══════════════════{Colors.END}

{Colors.GREEN}[1]{Colors.END}  📊 List Top Cryptocurrencies
{Colors.GREEN}[2]{Colors.END}  🔍 Search Cryptocurrency
{Colors.GREEN}[3]{Colors.END}  📈 View Coin Details
{Colors.GREEN}[4]{Colors.END}  ⭐ Manage Favorites
{Colors.GREEN}[5]{Colors.END}  👁️  Watch Favorites (Real-time)
{Colors.GREEN}[6]{Colors.END}  💱 Convert Crypto
{Colors.GREEN}[7]{Colors.END}  🔥 Trending Coins
{Colors.GREEN}[8]{Colors.END}  ⚖️  Compare Two Coins
{Colors.GREEN}[9]{Colors.END}  🔔 Manage Price Alerts
{Colors.GREEN}[10]{Colors.END} 📤 Export Favorites to CSV
{Colors.GREEN}[11]{Colors.END} ⚙️  Settings & Preferences

{Colors.RED}[0]{Colors.END}  🚪 Exit

{Colors.BOLD}═════════════════════════════════════════════════{Colors.END}
"""
    print(menu)

def run_command(cmd: list, shell: bool = False) -> Optional[int]:
    """Execute a command and return exit code"""
    try:
        if shell:
            result = subprocess.run(' '.join(cmd), shell=True)
        else:
            result = subprocess.run(cmd)
        return result.returncode
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Operation cancelled.{Colors.END}")
        return 1
    except Exception as e:
        print(f"{Colors.RED}Error: {e}{Colors.END}")
        return 1

def get_input(prompt: str, default: str = "") -> str:
    """Get user input with optional default"""
    if default:
        user_input = input(f"{Colors.CYAN}{prompt} [{default}]: {Colors.END}").strip()
        return user_input if user_input else default
    return input(f"{Colors.CYAN}{prompt}: {Colors.END}").strip()

def pause():
    """Wait for user to press enter"""
    input(f"\n{Colors.YELLOW}Press ENTER to continue...{Colors.END}")

def list_coins():
    """List top cryptocurrencies"""
    clear_screen()
    print(f"{Colors.BOLD}📊 List Top Cryptocurrencies{Colors.END}\n")
    
    count = get_input("Number of coins to display", "50")
    currency = get_input("Currency (usd/eur/gbp/try)", "usd")
    sort_field = get_input("Sort by (market_cap/price/volume/change)", "market_cap")
    desc = get_input("Descending order? (y/n)", "y")
    
    cmd = ["crypto", "list", "-n", count, "-c", currency, "-s", sort_field]
    if desc.lower() == 'y':
        cmd.append("--desc")
    
    print()
    run_command(cmd)
    pause()

def search_coin():
    """Search for a cryptocurrency"""
    clear_screen()
    print(f"{Colors.BOLD}🔍 Search Cryptocurrency{Colors.END}\n")
    
    query = get_input("Enter coin name or symbol")
    if not query:
        print(f"{Colors.RED}Search query cannot be empty!{Colors.END}")
        pause()
        return
    
    currency = get_input("Currency for prices", "usd")
    
    print()
    run_command(["crypto", "search", query, "-c", currency])
    pause()

def view_details():
    """View detailed coin information"""
    clear_screen()
    print(f"{Colors.BOLD}📈 View Coin Details{Colors.END}\n")
    
    coin_id = get_input("Enter coin ID (e.g., bitcoin, ethereum)")
    if not coin_id:
        print(f"{Colors.RED}Coin ID cannot be empty!{Colors.END}")
        pause()
        return
    
    currency = get_input("Currency", "usd")
    
    print()
    run_command(["crypto", "detail", coin_id, "-c", currency])
    pause()

def manage_favorites():
    """Manage favorite coins"""
    while True:
        clear_screen()
        print(f"{Colors.BOLD}⭐ Manage Favorites{Colors.END}\n")
        print(f"{Colors.GREEN}[1]{Colors.END} View Favorites")
        print(f"{Colors.GREEN}[2]{Colors.END} Add to Favorites")
        print(f"{Colors.GREEN}[3]{Colors.END} Remove from Favorites")
        print(f"{Colors.RED}[0]{Colors.END} Back to Main Menu\n")
        
        choice = get_input("Select option")
        
        if choice == "1":
            currency = get_input("Currency", "usd")
            print()
            run_command(["crypto", "favorites", "-c", currency])
            pause()
        elif choice == "2":
            coin_id = get_input("Enter coin ID to add")
            if coin_id:
                print()
                run_command(["crypto", "add", coin_id])
                pause()
        elif choice == "3":
            coin_id = get_input("Enter coin ID to remove")
            if coin_id:
                print()
                run_command(["crypto", "remove", coin_id])
                pause()
        elif choice == "0":
            break

def watch_favorites():
    """Watch favorites in real-time"""
    clear_screen()
    print(f"{Colors.BOLD}👁️  Watch Favorites (Real-time){Colors.END}\n")
    print(f"{Colors.YELLOW}Press Ctrl+C to stop watching{Colors.END}\n")
    
    interval = get_input("Refresh interval in seconds", "60")
    currency = get_input("Currency", "usd")
    
    print()
    run_command(["crypto", "watch", "-i", interval, "-c", currency])
    pause()

def convert_crypto():
    """Convert between cryptocurrencies"""
    clear_screen()
    print(f"{Colors.BOLD}💱 Convert Cryptocurrency{Colors.END}\n")
    
    amount = get_input("Amount")
    from_coin = get_input("From (e.g., btc)")
    to_coin = get_input("To (e.g., eth)")
    
    if amount and from_coin and to_coin:
        print()
        run_command(["crypto", "convert", amount, from_coin, to_coin])
        pause()
    else:
        print(f"{Colors.RED}All fields are required!{Colors.END}")
        pause()

def trending_coins():
    """Show trending coins"""
    clear_screen()
    print(f"{Colors.BOLD}🔥 Trending Coins{Colors.END}\n")
    
    run_command(["crypto", "trending"])
    pause()

def compare_coins():
    """Compare two coins"""
    clear_screen()
    print(f"{Colors.BOLD}⚖️  Compare Two Coins{Colors.END}\n")
    
    coin1 = get_input("First coin ID (e.g., bitcoin)")
    coin2 = get_input("Second coin ID (e.g., ethereum)")
    currency = get_input("Currency", "usd")
    
    if coin1 and coin2:
        print()
        run_command(["crypto", "compare", coin1, coin2, "-c", currency])
        pause()
    else:
        print(f"{Colors.RED}Both coin IDs are required!{Colors.END}")
        pause()

def manage_alerts():
    """Manage price alerts"""
    while True:
        clear_screen()
        print(f"{Colors.BOLD}🔔 Manage Price Alerts{Colors.END}\n")
        print(f"{Colors.GREEN}[1]{Colors.END} List All Alerts")
        print(f"{Colors.GREEN}[2]{Colors.END} Add Price Alert")
        print(f"{Colors.GREEN}[3]{Colors.END} Remove Price Alert")
        print(f"{Colors.RED}[0]{Colors.END} Back to Main Menu\n")
        
        choice = get_input("Select option")
        
        if choice == "1":
            print()
            run_command(["crypto", "alert", "list"])
            pause()
        elif choice == "2":
            coin_id = get_input("Coin ID")
            currency = get_input("Currency", "usd")
            alert_type = get_input("Type (above/below)")
            price = get_input("Price threshold")
            
            if coin_id and alert_type and price:
                print()
                run_command(["crypto", "alert", "add", coin_id, "-c", currency, "-t", alert_type, "-p", price])
                pause()
        elif choice == "3":
            coin_id = get_input("Coin ID")
            currency = get_input("Currency", "usd")
            alert_type = get_input("Type (above/below)")
            
            if coin_id:
                cmd = ["crypto", "alert", "remove", coin_id, "-c", currency]
                if alert_type:
                    cmd.extend(["-t", alert_type])
                print()
                run_command(cmd)
                pause()
        elif choice == "0":
            break

def export_favorites():
    """Export favorites to CSV"""
    clear_screen()
    print(f"{Colors.BOLD}📤 Export Favorites to CSV{Colors.END}\n")
    
    currency = get_input("Currency", "usd")
    output = get_input("Output file (leave empty for auto-generated)", "")
    
    cmd = ["crypto", "export", "-c", currency]
    if output:
        cmd.extend(["-o", output])
    
    print()
    run_command(cmd)
    pause()

def settings():
    """Settings and preferences"""
    clear_screen()
    print(f"{Colors.BOLD}⚙️  Settings & Preferences{Colors.END}\n")
    print(f"{Colors.YELLOW}Current configuration:{Colors.END}")
    print(f"  - Default currency: USD")
    print(f"  - Default sort: Market Cap")
    print(f"  - Cache TTL: 60 seconds")
    print(f"\n{Colors.CYAN}To change settings, edit .env file in project root{Colors.END}")
    pause()

def main():
    """Main application loop"""
    while True:
        clear_screen()
        print_banner()
        print_menu()
        
        choice = get_input("Select an option")
        
        if choice == "1":
            list_coins()
        elif choice == "2":
            search_coin()
        elif choice == "3":
            view_details()
        elif choice == "4":
            manage_favorites()
        elif choice == "5":
            watch_favorites()
        elif choice == "6":
            convert_crypto()
        elif choice == "7":
            trending_coins()
        elif choice == "8":
            compare_coins()
        elif choice == "9":
            manage_alerts()
        elif choice == "10":
            export_favorites()
        elif choice == "11":
            settings()
        elif choice == "0":
            clear_screen()
            print(f"{Colors.GREEN}Thank you for using Crypto Tracker CLI! 👋{Colors.END}\n")
            sys.exit(0)
        else:
            print(f"{Colors.RED}Invalid option! Please try again.{Colors.END}")
            pause()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        clear_screen()
        print(f"\n{Colors.YELLOW}Application terminated by user.{Colors.END}\n")
        sys.exit(0)
