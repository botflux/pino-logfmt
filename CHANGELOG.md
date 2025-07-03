# Changelog

## 1.0.1

### Patch Changes

- d5e13fd: Add v0 to v1 explainer in the readme

## 1.0.0

### Major Changes

- 55693be: Migrate from commander to node:util's parseArgs (drop supports for Node.js 14 and 16)
- 55693be: Drop support for Node.js 14, 16 and 18.
- 55693be: Migrate to node:test from mocha and chai (thus dropping support for Node.js 14, 16 and 18).

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.1](https://github.com/botflux/pino-logfmt/compare/v0.0.4...v0.1.1) (2024-10-18)

## Docs

- update supported Node.js version list ([08e3a86](https://github.com/botflux/pino-logfmt/commit/08e3a86f8168dee995ee5877aebb2a27952aa8ca))

## CI

- test nodejs 23 ([570211b](570211b59a032a96344dddd42b3e0486dfcc46bf))

## [0.1.0](https://github.com/botflux/pino-logfmt/compare/v0.0.4...v0.1.0) (2024-10-13)

## CI

- stop testing nodejs 21 to test nodejs 22

## [0.0.4](https://github.com/botflux/pino-logfmt/compare/v0.0.3...v0.0.4) (2024-04-07)

### Features

- introduce new `escapeMutlilineStrings` option ([18111c0](https://github.com/botflux/pino-logfmt/commit/18111c0607f2ca25be41d9040066c6b2415bcfa1))

## [0.0.3](https://github.com/botflux/pino-logfmt/compare/v0.0.2...v0.0.3) (2024-03-20)

## [0.0.2](https://github.com/botflux/pino-logfmt/compare/v0.0.1...v0.0.2) (2024-03-20)

### Bug Fixes

- remove idea files ([994f8d1](https://github.com/botflux/pino-logfmt/commit/994f8d13f0fb3eee0b802724937a6fa7f3e00acf))

## [0.0.1](https://github.com/botflux/pino-logfmt/compare/v0.0.0...v0.0.1) (2024-03-20)

### Bug Fixes

- remove test logs from tarball ([ca53951](https://github.com/botflux/pino-logfmt/commit/ca5395119b70836d004b6a92ba6836e806d18154))

## 0.0.0 (2024-03-20)

### Features

- add --time-format ([ac68eb9](https://github.com/botflux/pino-logfmt/commit/ac68eb97c86b12a0adb67ca9a73f8c680b44de8e))
- add a binary to run the transport on stdin ([95a8f0c](https://github.com/botflux/pino-logfmt/commit/95a8f0c17580336c8f807b7d36dc44de57284c16))
- add an option to flatten nested metadata ([b24ed08](https://github.com/botflux/pino-logfmt/commit/b24ed08793917f9689cbbb2c52aa147696d4616f))
- add optional case conversion ([eab9c7c](https://github.com/botflux/pino-logfmt/commit/eab9c7c267232d52ab6b31e86bef8e06a6161cf8))
- allow to pass custom levels ([d234ab9](https://github.com/botflux/pino-logfmt/commit/d234ab96582508330e65070066380480d9127a2f))
- create a basic logfmt transport ([473ba27](https://github.com/botflux/pino-logfmt/commit/473ba27cf81e63e1dfd53520f8af1f8c5f6d6427))
- enable custom levels trough the CLI ([d4ff92a](https://github.com/botflux/pino-logfmt/commit/d4ff92a6971855cac3a09099c389dc2632211fc6))
- support custom date formats ([12dca4a](https://github.com/botflux/pino-logfmt/commit/12dca4aa5784399a03878d4e1a39d5d508484c97))

### Bug Fixes

- add shebang to be able to run the js binary ([635c55c](https://github.com/botflux/pino-logfmt/commit/635c55ccb6c6f40174a9287a0cefb6a4dc3619a3))
