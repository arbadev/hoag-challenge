# Development Commands

## Package Manager
This project uses **pnpm** as the package manager. All commands can be run with either `pnpm` or `npm`.

## Core Development Commands

### Start Development Server
```bash
pnpm dev
# or
npm run dev
```
Starts the development server with Hot Module Replacement (HMR) at http://localhost:5173

### Build for Production
```bash
pnpm build
# or
npm run build
```
Creates an optimized production build in the `build/` directory

### Start Production Server
```bash
pnpm start
# or
npm run start
```
Runs the production server from the built files

### Type Checking
```bash
pnpm typecheck
# or
npm run typecheck
```
Generates React Router types and runs TypeScript type checking

## Package Management

### Install Dependencies
```bash
pnpm install
```

### Add New Dependency
```bash
pnpm add <package-name>
```

### Add Dev Dependency
```bash
pnpm add -D <package-name>
```

## Common System Commands (macOS/Darwin)

### Git Commands
- `git status` - Check current branch and changes
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote

### File Navigation
- `ls -la` - List all files with details
- `cd <directory>` - Change directory
- `pwd` - Print working directory

### File Operations
- `mkdir <name>` - Create directory
- `touch <file>` - Create file
- `rm <file>` - Remove file
- `rm -rf <directory>` - Remove directory

### Search Commands
- `grep -r "pattern" .` - Search for pattern in files
- `find . -name "*.tsx"` - Find files by name pattern