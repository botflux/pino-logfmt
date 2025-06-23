# Agent Guidelines for pino-logfmt

## Commands
- **Test**: `npm test` (runs all tests with TZ=Europe/Paris using node:test)
- **Single test**: `node --test tests/transport.spec.js` (or specific test file)
- **Lint**: `npm run lint` (uses standard --fix)
- **Release**: `npm run release`

## Code Style
- **Language**: ES modules (type: "module" in package.json)
- **Linter**: JavaScript Standard Style
- **Imports**: Use ES6 imports with .js extensions for local files
- **Types**: JSDoc comments for type annotations, TypeScript definitions in typings/
- **Naming**: camelCase for variables/functions, snake_case conversion available via options
- **Error handling**: Use async/await, handle backpressure with once() events
- **Comments**: JSDoc format with @param and @returns tags

## Architecture
- Main transport in src/transport.js exports default async function
- Uses pino-abstract-transport for stream handling
- SonicBoom for non-blocking writes
- Node.js built-in test runner with assert for testing
- Test files create temp directories in var/ with UUIDs