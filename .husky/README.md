# Git Hooks Setup

This directory contains Git hooks configured using [Husky](https://typicode.github.io/husky/) to
maintain code quality and consistency.

## Available Hooks

### 1. Pre-commit (`pre-commit`)

Runs before each commit to ensure code quality:

- **Prettier**: Formats staged files automatically
- **ESLint**: Lints and fixes JavaScript/TypeScript/Svelte files
- **Rustfmt**: Formats Rust files in `src-tauri/`

**What it checks:**

- `*.{js,ts,svelte}` files → Prettier + ESLint
- `*.{json,css,md}` files → Prettier formatting
- `*.rs` files → Rust formatting

### 2. Commit Message (`commit-msg`)

Enforces [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

Examples:
✅ feat: add user authentication
✅ fix: resolve memory leak in editor
✅ feat(vault): implement vault creation
✅ docs: update API documentation
✅ style: fix code formatting
✅ refactor: reorganize component structure
✅ test: add unit tests for vault service
✅ chore: update dependencies
```

**Allowed types:**

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (dependencies, build config, etc.)
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Revert previous commits

### 3. Pre-push (`pre-push`)

Runs tests before pushing to remote:

- Executes `bun run test`
- Prevents push if any tests fail
- Ensures only working code reaches the repository

## Configuration

The hooks are configured in:

- **Husky config**: `.husky/` directory
- **Lint-staged config**: `package.json` → `lint-staged` section

### Lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{js,ts,svelte}": ["prettier --write", "eslint --fix"],
    "*.{json,css,md}": ["prettier --write"],
    "*.rs": ["rustfmt"]
  }
}
```

## Usage

### Normal Development

Just commit as usual - the hooks run automatically:

```bash
git add .
git commit -m "feat: add new feature"  # Hooks run automatically
git push  # Tests run before push
```

### Skipping Hooks (Emergency Only)

If you need to bypass hooks (not recommended for normal development):

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

### Manual Quality Checks

You can run quality checks manually:

```bash
# Check formatting and linting
bun run quality:check

# Fix formatting and linting issues
bun run quality:fix

# Run specific tools
bun run format:check    # Check formatting
bun run format          # Fix formatting
bun run lint:check      # Check linting
bun run lint            # Fix linting issues
```

## Troubleshooting

### Hook Not Running

If hooks aren't running, ensure they're executable:

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### Husky Not Initialized

If you cloned the repository and hooks aren't working:

```bash
bun run prepare  # This runs 'husky' command
```

### Formatting Issues

If you get formatting errors:

```bash
# Auto-fix all formatting issues
bun run format

# Check what needs formatting
bun run format:check
```

### Linting Issues

If you get ESLint errors:

```bash
# Auto-fix all linting issues
bun run lint

# Check what needs linting
bun run lint:check
```

### Commit Message Issues

Ensure your commit messages follow the conventional commit format:

```bash
# ❌ Bad
git commit -m "update stuff"

# ✅ Good
git commit -m "feat: add user authentication system"
```

## Benefits

1. **Consistency**: Ensures all code follows the same style
2. **Quality**: Catches issues before they reach the repository
3. **Automation**: Reduces manual work and human error
4. **Team Alignment**: Everyone follows the same standards
5. **Clean History**: Meaningful commit messages help with debugging and releases

## Disabling (Not Recommended)

To temporarily disable all hooks:

```bash
git config core.hooksPath /dev/null
```

To re-enable:

```bash
git config core.hooksPath .husky
```

**Note**: Only disable hooks when absolutely necessary. They exist to maintain code quality and
prevent issues.
