# Tektite - Tauri + SvelteKit + TypeScript

[![Lint](https://github.com/YOUR_USERNAME/tektite/actions/workflows/lint.yml/badge.svg)](https://github.com/lorrehuggan/tektite/actions/workflows/lint.yml)

Modern desktop application built with Tauri, SvelteKit, and TypeScript featuring comprehensive code
quality tooling.

## 🚀 Features

- **Modern Stack**: Tauri v2 + SvelteKit 2 + TypeScript 5
- **Code Quality**: ESLint 9 + Prettier 3 with automatic formatting
- **Path Aliases**: Clean imports with `@/` shortcuts
- **Tailwind CSS**: Utility-first styling with class sorting
- **Import Organization**: Automatic import sorting and organization
- **VS Code Integration**: Seamless development experience

## 🛠️ Development Setup

### Prerequisites

- [Rust](https://rustup.rs/) (for Tauri)
- [Bun](https://bun.sh/) (package manager)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Install recommended VS Code extensions (automatic prompt)

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run tauri        # Tauri-specific commands

# Code Quality
bun run lint         # Fix linting issues
bun run lint:check   # Check for linting issues
bun run format       # Format all files
bun run format:check # Check formatting
bun run quality:fix  # Format and lint together
bun run quality:check # Check both formatting and linting

# TypeScript
bun run check        # TypeScript type checking
bun run check:watch  # Watch mode type checking
```

## 📁 Project Structure

```
tektite/
├── src/
│   ├── app/           # Application code with aliases
│   │   ├── components/ # @/components
│   │   ├── features/   # @/features
│   │   ├── lib/        # @/lib
│   │   ├── styles/     # @/styles (includes Tailwind)
│   │   └── utils/      # @/utils
│   ├── routes/        # SvelteKit routes
│   └── app.html       # Main HTML template
├── src-tauri/         # Rust backend code
├── .vscode/           # VS Code settings
├── eslint.config.js   # Modern ESLint configuration
├── prettier.config.js # Prettier with plugins
└── PATH_ALIASES.md    # Path alias documentation
```

## 🎨 Code Style

This project enforces consistent code style through automated tooling:

### ESLint Rules

- TypeScript-first with strict type checking
- Svelte-specific rules for best practices
- No console statements in production
- Consistent variable naming and usage

### Prettier Formatting

- 80-character line limit
- 2-space indentation
- Double quotes for strings
- Trailing commas where valid
- Automatic import sorting
- Tailwind class sorting

### Import Organization

Imports are automatically sorted in this order:

1. Node modules (`svelte`, `@tauri-apps/*`)
2. Type imports
3. Local aliases (`@/lib`, `@/utils`, etc.)
4. Relative imports (`./`, `../`)

## 📋 Path Aliases

Clean imports using path aliases:

```typescript
// Instead of: ../../../app/utils/helper
// Instead of: ../../app/components/Button.svelte
import Button from "@/components/Button.svelte";
// Instead of: ../app/styles/component.css
import "@/styles/component.css";
import { helper } from "@/utils/helper";
```

Available aliases:

- `@/components` → `./src/app/components`
- `@/features` → `./src/app/features`
- `@/lib` → `./src/app/lib`
- `@/styles` → `./src/app/styles`
- `@/utils` → `./src/app/utils`

## 🔧 Recommended IDE Setup

**Required Extensions:**

- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

**Code Quality Extensions:**

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

The project includes VS Code settings for automatic formatting on save, ESLint auto-fixing, and
import organization.

## 📖 Documentation

- [`.githooks/pre-commit.example`](.githooks/pre-commit.example) - Git pre-commit hook setup

## 🤝 Contributing

1. Ensure code passes quality checks: `bun run quality:check`
2. Format and lint before committing: `bun run quality:fix`
3. Consider setting up the pre-commit hook for automatic checks

## 📄 License

MIT
