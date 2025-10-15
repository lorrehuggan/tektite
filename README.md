# Tektite - Privacy-First Markdown Knowledge Base

[![Lint](https://github.com/lorrehuggan/tektite/actions/workflows/lint.yml/badge.svg)](https://github.com/lorrehuggan/tektite/actions/workflows/lint.yml)

A privacy-first, local-first Markdown knowledge base for individuals and teams. Designed for speed,
offline functionality, and large-scale vaults (10,000+ notes).

## 🚀 Features

### Core Knowledge Management

- **📝 Markdown-First**: Native Markdown editing with live preview
- **🔗 Bidirectional Links**: Connect ideas with `[[wiki-style]]` links
- **🔙 Backlinks**: Automatic discovery of reverse connections
- **📊 Graph View**: Visual network of your knowledge connections
- **⚡ Lightning Search**: Full-text search across thousands of notes
- **📁 Large Vaults**: Optimized for 10,000+ notes without performance loss

### Privacy & Control

- **🔒 Privacy-First**: Your data stays on your device
- **💾 Local-First**: Full offline functionality
- **🚫 No Cloud Lock-in**: Own your data completely
- **🔐 Secure**: No telemetry or data collection

### Technical Excellence

- **⚡ Native Performance**: Built with Tauri for desktop-class speed
- **🎨 Modern UI**: Clean, distraction-free interface
- **🔧 Extensible**: Plugin architecture for customization
- **📱 Cross-Platform**: Windows, macOS, and Linux support

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

## 🏗️ Architecture

Built with modern technologies for performance and maintainability:

- **Frontend**: SvelteKit 2 + TypeScript 5 + Tailwind CSS
- **Backend**: Tauri v2 + Rust (native performance)
- **Storage**: Local file system with efficient indexing
- **Search**: Full-text search engine optimized for large datasets
- **Rendering**: Native Markdown parsing with syntax highlighting

## 📁 Project Structure

```
tektite/
├── src/
│   ├── app/           # Application code with aliases
│   │   ├── components/ # @/components - Reusable UI components
│   │   ├── features/   # @/features - Feature-specific modules
│   │   │   ├── editor/ # Markdown editor functionality
│   │   │   ├── search/ # Full-text search engine
│   │   │   ├── graph/  # Graph view and link analysis
│   │   │   └── vault/  # Vault management and file operations
│   │   ├── lib/        # @/lib - Shared utilities and stores
│   │   ├── styles/     # @/styles - Tailwind CSS styles
│   │   └── utils/      # @/utils - Helper functions
│   ├── routes/        # SvelteKit routes
│   └── app.html       # Main HTML template
├── src-tauri/         # Rust backend code
│   ├── src/           # Tauri application logic
│   │   ├── commands/  # Tauri commands (file operations, search)
│   │   ├── search/    # Search engine implementation
│   │   └── vault/     # Vault management
│   └── Cargo.toml     # Rust dependencies
├── .vscode/           # VS Code settings
├── eslint.config.js   # Modern ESLint configuration
├── prettier.config.js # Prettier with plugins
└── PATH_ALIASES.md    # Path alias documentation
```

## 🎯 Use Cases

### For Individuals

- **Personal Knowledge Base**: Organize thoughts, ideas, and learning
- **Research Notes**: Connect concepts across different domains
- **Project Documentation**: Keep project notes and documentation linked
- **Daily Journaling**: Reflect and connect daily experiences

### For Teams

- **Shared Knowledge**: Collaborative knowledge base with local-first sync
- **Documentation**: Technical documentation with cross-references
- **Research Collaboration**: Share insights while maintaining privacy
- **Meeting Notes**: Connected meeting notes and action items

## 🎨 Code Quality

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

## 🗺️ Roadmap

### Phase 1: Core Foundation ✅

- [x] Basic Markdown editing
- [x] File system operations
- [x] Project structure and tooling

### Phase 2: Knowledge Features 🚧

- [ ] Bidirectional linking with `[[]]` syntax
- [ ] Backlinks panel
- [ ] Full-text search engine
- [ ] Graph view visualization

### Phase 3: Advanced Features 📋

- [ ] Plugin system
- [ ] Themes and customization
- [ ] Export and import
- [ ] Mobile companion app

### Phase 4: Collaboration 🔮

- [ ] Local-first sync
- [ ] Team sharing
- [ ] Conflict resolution
- [ ] Access controls

## 📖 Documentation

- [`.githooks/pre-commit.example`](.githooks/pre-commit.example) - Git pre-commit hook setup
- [API Documentation](docs/api.md) - Tauri command API reference
- [Plugin Development](docs/plugins.md) - Guide for creating plugins
- [Architecture Overview](docs/architecture.md) - Technical architecture details

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Ensure code passes quality checks: `bun run quality:check`
2. Format and lint before committing: `bun run quality:fix`
3. Consider setting up the pre-commit hook for automatic checks

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Tektite**: Where knowledge connects. Privacy-first, local-first, built for scale.
