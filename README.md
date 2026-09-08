# Gomoku — Five-in-a-Row vs Smart AI

A strategic Gomoku (Five-in-a-Row) game where you play black against a smart AI opponent powered by minimax search with alpha-beta pruning.

## Features

- **Strategic AI opponent** with three difficulty levels:
  - **Easy** — heuristic play with light randomness (beatable)
  - **Medium** — 2-ply minimax search with tactical shortcuts
  - **Hard** — 4-ply minimax with alpha-beta pruning and move ordering

- **Accurate win detection** in all four directions (horizontal, vertical, both diagonals)

- **Winning-line highlight** — the five stones that form the win are outlined in green

- **Last-move marker** — orange dot shows the most recent move

- **Move history** with standard Gomoku notation (A1–O15)

- **Persistent scoreboard** — tracks wins, losses, and draws across games

- **Undo** — reverts your last move and the AI's response

- **Toast notifications** for win/loss/draw events

- **Smooth stone-placement animation**

- **Fully responsive** — works on mobile and desktop

## Tech Stack

- **Vite** — fast dev server and build tool
- **React 19** — UI library
- **TypeScript** — type-safe development
- **Vitest** + **@testing-library/react** — unit and component testing
- **lucide-react** — icon library
- **CSS** — custom design system with CSS variables (no UI framework)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
git clone https://github.com/KAMRANSKI313/gomoku-game.git

cd gomoku-game

npm install
```

### Run the dev server

```bash
npm run dev
```

Open http://localhost:5173/ in your browser.

### Run tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm test -- --watch
```

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
gomoku-game/

├── src/
│   ├── lib/                    # Pure game logic (no React)
│   │   ├── types.ts            # Type definitions + constants
│   │   ├── logic.ts            # Move validation, win detection, candidate moves
│   │   ├── ai.ts               # Minimax + alpha-beta + pattern heuristic
│   │   ├── logic.test.ts       # Logic tests
│   │   └── ai.test.ts          # AI tests
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGomoku.ts        # Game state orchestration
│   │   ├── useGomoku.test.ts   # Hook tests
│   │   ├── useToast.ts         # Toast notifications
│   │   └── useToast.test.ts    # Toast tests
│   │
│   ├── components/             # React UI components
│   │   ├── GomokuBoard.tsx     # SVG board renderer
│   │   ├── GomokuBoard.test.tsx
│   │   ├── GamePanel.tsx       # Side panel (status, scores, controls, history)
│   │   └── ToastContainer.tsx  # Toast notifications UI
│   │
│   ├── styles/                 # CSS files
│   │   ├── app.css             # Design tokens + app layout
│   │   ├── game.css            # Game layout + panel styles
│   │   ├── board.css           # Board animations
│   │   └── toast.css            # Toast styles
│   │
│   ├── test-setup.ts            # Vitest cleanup setup
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # App entry point
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Architecture

The project follows a modular, separation-of-concerns architecture:

1. **Pure logic layer (`src/lib/`)** — game types, rules, and AI. No React dependencies. Fully testable in isolation.

2. **State orchestration layer (`src/hooks/`)** — React hooks that manage game state (`useGomoku`) and UI state (`useToast`). The `useGomoku` hook owns board state, turn flow, AI move scheduling, undo, restart, and score tracking.

3. **Presentation layer (`src/components/`)** — pure components that receive props and render. No state management (all state lives in hooks). `GomokuBoard` renders the SVG board; `GamePanel` renders the side panel; `ToastContainer` renders notifications.

## How the AI Works

The AI uses a pattern-based heuristic combined with minimax search:

1. **Pattern scoring** — each board position is evaluated by detecting stone shapes:
   - Open four (unstoppable) → 1,000,000 points
   - Four (one end blocked) → 100,000 points
   - Open three (threatens to become open four) → 10,000 points
   - Three → 1,000 points
   - Open two → 100 points
   - Two → 10 points

2. **Tactical shortcuts** — before running the expensive search:
   - If the AI can win immediately, it does
   - If the opponent threatens to win next move, it blocks

3. **Minimax with alpha-beta pruning** — searches the game tree to the configured depth:
   - Easy: depth 0 (heuristic only + randomness)
   - Medium: depth 2
   - Hard: depth 4

4. **Move ordering** — candidates are sorted by heuristic score so alpha-beta prunes more aggressively.

5. **Candidate pruning** — only cells within a 1–2 cell radius of existing stones are considered, reducing the search space from 225 to ~20–40 cells.

## Testing

The project has 93 automated tests across 6 test files:

| File                   | Tests | What it covers                                          |
| ---------------------- | ----: | ------------------------------------------------------- |
| `logic.test.ts`        |    18 | Move validation, win detection, candidate moves         |
| `ai.test.ts`           |    17 | Win finding, blocking, strategic play, board evaluation |
| `useGomoku.test.ts`    |    20 | Game state, turn flow, undo, restart, difficulty        |
| `useToast.test.ts`     |     5 | Toast show, auto-dismiss, manual dismiss                |
| `GomokuBoard.test.tsx` |    13 | Board rendering, stones, clicks, markers, highlight     |
| `GamePanel.test.tsx`   |    19 | Status banner, scoreboard, controls, history            |

## License

MIT

```

```
