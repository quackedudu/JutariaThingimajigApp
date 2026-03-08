# 🎲 Jutaria Thingimajig App 🇲🇾

A stunning digital companion app for **Jutaria Billionaire**, the Malaysian Monopoly-style board game! Track player finances, manage properties, and enhance your physical board game experience with beautiful visuals and automated gameplay mechanics.

![Made with React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 💰 **Money Management**
- Real-time player balance tracking
- Automated rent collection when landing on owned properties
- Money transfer system between players
- Starting bonus (RM 20,000) when passing Start for the first time
- Manual money adjustments for bank transactions

### 🏘️ **Property System**
- Two-stage purchase system: Land → Building
- 22 Malaysian city properties (Kuala Lumpur, Penang, Johor Bahru, and more!)
- Visual property ownership indicators with player colors
- Sell properties back to the bank (50% refund)
- Color-coded property groups

### 🎮 **Game Mechanics**
- Interactive dice roller with smooth animations
- Turn-based gameplay with auto-advancing turns in Round 1
- Turn order determination via dice roll
- 40-position game board matching the physical board
- Special tiles: Start, Tax, Chance, and Fate events

### 🎪 **Random Events**
- Chance and Fate tiles with unique events
- Lucky and unlucky scenarios
- Instant money adjustments (+/- amounts)
- Themed event cards with emojis and descriptions

### 📊 **Player Stats & Rankings**
- Real-time net worth calculation (cash + property value)
- Player ranking system with medals (🥇🥈🥉)
- Bankruptcy detection
- Property portfolio breakdown
- Detailed game history log (last 50 transactions)

### 💾 **Data Management**
- Auto-save functionality to localStorage
- Load saved games and continue playing
- Transaction history tracking
- No data loss on page refresh

### 🎨 **Beautiful UI/UX**
- Malaysian-inspired color scheme (blue, gold, purple)
- Gradient backgrounds with pattern overlays
- Glassmorphic design elements
- Smooth animations and transitions
- Mobile-optimized touch-friendly interface
- Backdrop blur effects and shadows
- Visual feedback with toast notifications

---

## 🎯 How to Play

### Setup
1. **Enter Player Names**: Add 2-8 players with unique names
2. **Set Starting Money**: Default is RM 15,000 (customizable)
3. **Determine Turn Order**: Each player rolls dice, highest goes first

### Gameplay
1. **Roll the Dice**: Current player rolls to move around the board
2. **Land on Properties**: 
   - Buy available land if you have enough money
   - Build on land you already own
   - Pay rent if landing on opponent's property
3. **Special Tiles**:
   - **Start (Position 0)**: Collect RM 20,000 bonus (first time only)
   - **Positions 10, 20, 30**: Trigger random Chance/Fate events
4. **Manage Your Empire**:
   - View all properties in the Properties tab
   - Transfer money in the Transfer tab
   - Check player rankings in the Players tab

### Winning
The player with the highest net worth wins! Watch out for bankruptcy when your cash and property values hit zero.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage for auto-save
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bootleg-billionaire.git

# Navigate to project directory
cd bootleg-billionaire

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Quick Start
1. Open the app in your browser
2. Add player names
3. Roll for turn order
4. Start playing!

---

## 📱 Screenshots

### Game Setup
Beautiful gradient backgrounds with Malaysian cityscape imagery and glassmorphic cards.

### Game Board
Interactive board with property cards, player positions, and purchase options.

### Turn Order
Animated dice rolling to determine who goes first.

### Players Tab
Rankings, net worth, and property breakdowns for each player.

### Properties Tab
Manage all properties, buy land, build, or sell back to the bank.

### Random Events
Chance and Fate cards with lucky/unlucky outcomes.

---

## 🎲 Game Rules

### Property Ownership
1. **Buy Land First**: Must purchase land before building
2. **Build Property**: Only on land you own
3. **One Purchase Per Turn**: Can only buy once per turn in Round 1
4. **Automatic Turn End**: Turn ends after purchase in Round 1

### Money Flow
- **Starting Cash**: RM 15,000 (default)
- **Pass Start Bonus**: RM 20,000 (first time only)
- **Rent**: Automatic deduction when landing on owned properties
- **Sell Back**: 50% refund of total investment (land + property)

### Rounds
- **Round 1**: Ends when all players pass Start for the first time
- **Round 2+**: Manual turn ending, strategic gameplay

### Bankruptcy
- Occurs when both cash and net worth reach zero
- Bankrupt players cannot continue but remain visible in rankings

---

## 📋 Property List

| City | Position | Land Price | Property Price | Rent | Color |
|------|----------|------------|----------------|------|-------|
| Kuala Lumpur | 1 | RM 1,000 | RM 1,000 | RM 200 | Red |
| Penang | 3 | RM 900 | RM 900 | RM 180 | Red |
| Johor Bahru | 6 | RM 1,100 | RM 1,100 | RM 220 | Orange |
| Ipoh | 8 | RM 800 | RM 800 | RM 160 | Orange |
| ... and 18 more Malaysian cities! | | | | | |

---

## 🎨 Design Features

### Color Palette
- **Primary**: Blue gradient (Tailwind blue-600 to indigo-600)
- **Accent**: Gold/Yellow for premium elements
- **Secondary**: Purple gradients for special screens
- **Success**: Green for positive actions
- **Danger**: Red for negative events

### Visual Elements
- Custom SVG pattern overlays
- Backdrop blur and glassmorphism
- Gradient borders and shadows
- Shimmer button animations
- Smooth page transitions
- Toast notifications for user feedback

---

## 🔄 Auto-Save System

The app automatically saves your game state to browser localStorage after every action:
- Player balances
- Property ownership
- Current turn
- Game history
- Turn order

Simply refresh the page or close and reopen to continue where you left off!

---

## 📝 Development Notes

### File Structure
```
/
├── App.tsx                    # Main app component
├── components/
│   ├── BackgroundPattern.tsx  # Pattern overlay component
│   ├── BoardDisplay.tsx       # Board visualization
│   ├── DiceRoller.tsx        # Dice rolling UI
│   ├── GameBoard.tsx         # Main board view
│   ├── GameHeader.tsx        # Header with player info
│   ├── GameSetup.tsx         # Initial setup screen
│   ├── MoneyTransfer.tsx     # Transfer interface
│   ├── PlayerList.tsx        # Player stats view
│   ├── PropertyManager.tsx   # Property management
│   ├── Toaster.tsx           # Toast notifications
│   └── TurnOrderSetup.tsx    # Turn order screen
├── utils/
│   └── events.ts             # Random event generator
└── styles/
    └── globals.css           # Global styles
```

### Key Components
- **Player Interface**: Tracks money, properties, position, and status
- **Property Interface**: Manages ownership, pricing, and rent
- **Game History**: Logs all transactions for transparency
- **Event System**: Random events on special tiles

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Inspired by **Jutaria Billionaire**, the Malaysian Monopoly game
- Built with modern web technologies
- Designed for mobile-first experience
- Enhanced with beautiful UI patterns and animations

---

## 📞 Support

Having issues or questions? 
- Open an issue on GitHub
- Check existing issues for solutions
- Read the game rules section above

---

<div align="center">

### 🎲 Roll the dice and build your Malaysian property empire! 🏠

Made with ❤️ in Malaysia 🇲🇾

**[Play Now](#) • [Report Bug](#) • [Request Feature](#)**

</div>

