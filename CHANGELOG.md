# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- GPL-3.0 license and a License section in the README (#1)
- `.gitignore` for OS, editor, environment and screen-capture files (#2)

### Changed
- `polygons` and `mountains` rewritten as original code, inspired by but no longer copied from Jason Sigal's unlicensed p5-music-viz demos; shared original `polygon()` helper; MIT notice added for the Nature of Code code in `coverage` (#8)
- p5.js 0.5.11 → 1.11.13 and p5.sound 0.3.2 → 1.0.1. The mic is now opened without the browser's echo cancellation, noise suppression and auto-gain, so the sketches react to the raw signal (#11)

### Removed
- `p5.dom` (part of p5 core), `html5shiv`, `normalize.css` and the IE conditional comments (#11)

### Fixed
- Audio never started in current browsers: a click-to-start overlay resumes the audio context and starts the mic, with a message when the mic is blocked or missing; Safari's missing legacy `getUserMedia` is shimmed (#5)
- Sketch defects: `conical` and `coverage` now resize with the window (`mountains` since #8), `conical`'s off-centre composition scales with the window, every page has its own meta description, and leaked globals and dead code are removed (#6)
