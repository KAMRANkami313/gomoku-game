# Gomoku — Five-in-a-Row vs Smart AI

**Live Demo:** https://gomoku-game-ruddy.vercel.app/

A polished, responsive Gomoku (Five-in-a-Row) game built with React and TypeScript. Play as Black against a smart AI opponent powered by heuristic evaluation, minimax search, alpha-beta pruning, tactical move detection, and candidate-move optimization.

The game supports multiple board sizes, AI difficulty levels, local two-player mode, persistent game statistics, replay mode, sound effects, dark mode, configurable animations, undo, move history, and keyboard-accessible controls.

---

## ✨ Features

### 🎮 Gameplay

- **Smart AI opponent** with three difficulty levels:
  - **Easy** — heuristic-based play with light randomness
  - **Medium** — 2-ply minimax search with tactical shortcuts
  - **Hard** — 4-ply minimax with alpha-beta pruning and move ordering

- **Two game modes**
  - Player vs AI
  - Local Player vs Player (PvP)

- **Three board sizes**
  - 9×9
  - 13×13
  - 15×15

- **Five-in-a-row win detection** across:
  - Horizontal lines
  - Vertical lines
  - Diagonal lines
  - Reverse diagonal lines

- **Animated winning-line highlight**
- **Last-move indicator** with an orange marker
- **Undo functionality**
  - Reverts the player's last move
  - Also reverts the AI response when playing against the AI

- **Move history** using standard Gomoku coordinates such as `A1–O15`

### 🤖 AI System

The AI combines several techniques to provide responsive and strategic gameplay:

- Pattern-based board evaluation
- Tactical win detection
- Immediate opponent-threat detection
- Candidate-move generation around existing stones
- Heuristic move ordering
- Minimax search
- Alpha-beta pruning
- Limited branching for practical performance
- Difficulty-specific search behavior
- Center-position preference on an empty board

The board engine is **size-agnostic**, allowing the same game logic and AI system to operate across all supported board sizes.

### 💾 Persistence & Statistics

- **Automatic game-state saving**
- Resume game state after refreshing the page
- Persistent game statistics
- Wins
- Losses
- Draws
- Win streaks
- Average moves per win
- Persistent user settings
- Board size
- Animation preference
- Theme preference
- Sound preference

### 🎨 User Experience

- **Light, dark, and system themes**
- Live synchronization with the operating system theme
- Synthesized sound effects using the **Web Audio API**
- No external audio files required
- Sound mute toggle
- Toast notifications for game events
- Configurable stone-placement animations
- Replay mode with:
  - Move-by-move navigation
  - Automatic playback

- Responsive layout for:
  - Mobile
  - Tablet
  - Desktop

- Keyboard accessibility
- Escape key support for closing dialogs
- Settings dialog with board-size and animation controls

---

## 🧠 How the AI Works

The AI is designed around a combination of tactical checks and search-based decision making.

### 1. Tactical Shortcuts

Before performing a deeper search, the AI checks for immediate tactical opportunities:

1. Can the AI win immediately?
2. Does the opponent have an immediate winning move?
3. If so, win or block before continuing with normal search.

This prevents unnecessary search when an obvious tactical move exists.

### 2. Heuristic Evaluation

The board is evaluated using Gomoku patterns such as:

- Five in a row
- Open four
- Four
- Open three
- Three
- Open two
- Two
- Single stones

Open-ended patterns receive higher scores because they provide stronger future opportunities.

### 3. Candidate Move Generation

Instead of evaluating every empty cell on the board, the engine generates candidate moves near existing stones.

This significantly reduces the number of positions that need to be considered during search.

### 4. Minimax Search

Medium and Hard difficulty use minimax search to evaluate possible future positions.

The search alternates between:

- Maximizing the AI's position
- Minimizing the opponent's position

### 5. Alpha-Beta Pruning

Hard difficulty uses alpha-beta pruning to eliminate branches that cannot improve the final decision.

This allows deeper strategic search without evaluating every possible branch.

### 6. Move Ordering and Branch Limiting

Candidate moves are scored heuristically and ordered before minimax explores them.

The search considers the strongest candidates first and limits the number of branches explored, keeping the AI responsive while maintaining strong tactical play.

---

## 🏗️ Architecture

The project follows a modular architecture that separates game logic from React UI concerns.

### Core Game Logic

Located in `src/lib/`.

Responsible for:

- Board representation
- Move validation
- Win detection
- Candidate generation
- AI evaluation
- Minimax search
- Statistics
- Game-state serialization
- Local storage
- Sound generation

The core game logic does not depend on React.

### React Hooks

Located in `src/hooks/`.

Custom hooks manage application state and coordinate the game engine with the UI.

Examples include:

- Game state orchestration
- Theme management
- Sound preferences
- Statistics tracking
- Settings
- Toast notifications
- Game persistence
- Replay navigation

### UI Components

Located in `src/components/`.

The UI is divided into focused components for:

- Board rendering
- Game controls
- Statistics
- Mode selection
- Theme controls
- Sound controls
- Settings
- Replay controls
- Toast notifications

This keeps responsibilities separated and makes the application easier to maintain and extend.

---

## 🛠️ Tech Stack

| Technology          | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| **Vite**            | Development server and production build tooling |
| **React 19**        | User interface                                  |
| **TypeScript**      | Type-safe application development               |
| **Vitest**          | Unit and integration testing                    |
| **Testing Library** | React component and hook testing                |
| **lucide-react**    | Interface icons                                 |
| **CSS**             | Custom design system and responsive styling     |
| **Web Audio API**   | Synthesized game sound effects                  |
| **localStorage**    | Persistent game state, settings, and statistics |

No UI framework is used; the interface is built with custom CSS and CSS variables.

---

## 📁 Project Structure

```text
gomoku-game/
├── src/
│   ├── lib/
│   │   ├── types.ts
│   │   ├── logic.ts
│   │   ├── ai.ts
│   │   ├── stats.ts
│   │   ├── sound.ts
│   │   ├── gameState.ts
│   │   └── storage.ts
│   │
│   ├── hooks/
│   │   ├── useGomoku.ts
│   │   ├── useTheme.ts
│   │   ├── useSound.ts
│   │   ├── useStats.ts
│   │   ├── useSettings.ts
│   │   ├── useToast.ts
│   │   ├── useGamePersistence.ts
│   │   └── useReplay.ts
│   │
│   ├── components/
│   │   ├── GomokuBoard.tsx
│   │   ├── GamePanel.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── ModeSelector.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── SoundToggle.tsx
│   │   ├── SettingsDialog.tsx
│   │   ├── ReplayBar.tsx
│   │   └── ToastContainer.tsx
│   │
│   └── styles/
│       ├── app.css
│       ├── game.css
│       ├── board.css
│       └── toast.css
│
├── .github/
│   └── workflows/
│
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### Core Modules

| Module         | Responsibility                                                     |
| -------------- | ------------------------------------------------------------------ |
| `types.ts`     | Types, constants, board creation, and board utilities              |
| `logic.ts`     | Move validation, win detection, game status, candidate moves       |
| `ai.ts`        | Heuristic evaluation, tactical checks, minimax, alpha-beta pruning |
| `stats.ts`     | Game statistics calculation                                        |
| `sound.ts`     | Web Audio API sound synthesis                                      |
| `gameState.ts` | Game-state serialization and deserialization                       |
| `storage.ts`   | Persistent localStorage abstraction                                |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or later
- npm 9 or later

### Installation

Clone the repository:

```bash
git clone https://github.com/KAMRANkami313/gomoku-game.git
cd gomoku-game
```

Install dependencies:

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open the local development URL shown by Vite, typically:

```text
http://localhost:5173/
```

---

## 🧪 Testing

The project includes automated unit, hook, and component tests.

Run the complete test suite:

```bash
npm test
```

The current test suite contains:

- **19 test files**
- **210 automated tests**
- **210 passing tests**

The tests cover core game logic, AI behavior, React hooks, board rendering, game controls, statistics, settings, replay functionality, and UI components.

---

## 🏭 Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

---

## 🎯 Supported Board Sizes

The game supports three board configurations:

| Board     | Use Case                             |
| --------- | ------------------------------------ |
| **9×9**   | Smaller and faster games             |
| **13×13** | Balanced gameplay                    |
| **15×15** | Standard full-size Gomoku experience |

The game engine derives its dimensions from the active board rather than relying on a fixed board size, allowing the core logic to work across all supported configurations.

---

## 🎮 Game Modes

### Player vs AI

You play as Black while the AI controls the opposing player.

Choose between:

- Easy
- Medium
- Hard

### Local PvP

Two players can play against each other locally on the same device.

The same board, move history, win detection, statistics, and game controls are available in PvP mode.

---

## 🔄 Replay Mode

Completed games can be reviewed using Replay Mode.

Replay provides:

- Move-by-move navigation
- Previous and next move controls
- Automatic playback
- Review of completed game sequences

This makes it possible to analyze previous games and understand how the match developed.

---

## 💾 Data Persistence

The application uses browser `localStorage` to persist relevant game information.

Persisted data includes:

- Current game state
- Game statistics
- Theme preference
- Sound preference
- Board size
- Animation preference

Refreshing the browser does not automatically remove these saved preferences and statistics.

---

## ♿ Accessibility

Accessibility is considered throughout the interface.

The application includes:

- Keyboard-accessible controls
- Escape key support for dialogs
- Accessible button labels
- Focus-aware dialog interactions
- Responsive layouts
- Theme support
- Clear visual game-state indicators

---

## 📱 Responsive Design

The interface is designed to work across different screen sizes:

- Mobile phones
- Tablets
- Laptops
- Desktop displays

The board and game controls adapt to available screen space while maintaining usable interaction areas.

---

## 🌐 Deployment

The application is deployed as a production web application and is available at:

**https://gomoku-game-ruddy.vercel.app/**

---

## 📌 Key Design Decisions

### Size-Agnostic Game Engine

The game engine derives board dimensions from the actual board state instead of assuming a single fixed size.

This allows the same game logic to support:

```text
9×9
13×13
15×15
```

without duplicating game rules.

### Modular Separation

Game logic is kept separate from React components.

This makes the core engine easier to:

- Test
- Maintain
- Extend
- Reuse

### Practical AI Search

The AI does not blindly search every possible board position.

Instead, it combines:

```text
Tactical Checks
      ↓
Candidate Generation
      ↓
Heuristic Scoring
      ↓
Move Ordering
      ↓
Minimax Search
      ↓
Alpha-Beta Pruning
      ↓
Selected Move
```

This provides a practical balance between strategic strength and browser performance.

---

## 📊 Project Highlights

- React 19 application
- Strict TypeScript architecture
- Three configurable board sizes
- Three AI difficulty levels
- Minimax with alpha-beta pruning
- Tactical win/block detection
- Heuristic pattern evaluation
- Candidate move pruning
- PvP and AI game modes
- Replay system
- Persistent statistics
- Persistent settings
- Dark/light/system themes
- Web Audio API sound effects
- Responsive UI
- Keyboard accessibility
- Automated test coverage
- 204 passing tests
- Production deployment on Vercel

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Muhammad Kamran**

GitHub: https://github.com/KAMRANkami313

Live Project: https://gomoku-game-ruddy.vercel.app/
