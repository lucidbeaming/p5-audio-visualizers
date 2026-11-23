# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- GPL-3.0 license and a License section in the README (#1)
- `.gitignore` for OS, editor, environment and screen-capture files (#2)

### Changed
- `polygons` and `mountains` rewritten as original code, inspired by but no longer copied from Jason Sigal's unlicensed p5-music-viz demos; shared original `polygon()` helper; MIT notice added for the Nature of Code code in `coverage` (#8)

### Fixed
- Audio never started in current browsers: a click-to-start overlay resumes the audio context and starts the mic, with a message when the mic is blocked or missing; Safari's missing legacy `getUserMedia` is shimmed (#5)
- Sketch defects: `conical` and `coverage` now resize with the window (`mountains` since #8), `conical`'s off-centre composition scales with the window, every page has its own meta description, and leaked globals and dead code are removed (#6)
