# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Gallery start screen with a looping preview, name and description per sketch; clicking a card starts it (#20)
- Input picker in the overlay (default mic, other audio inputs, or an audio file), drag and drop an audio file anywhere, and a "Play an audio file instead" start option, so the sketches work without a mic (#17)
- Performance keys: `←`/`→` and `1`–`4` switch sketches, `F` fullscreen, `H` hides the UI and cursor, `Space` freezes the frame; a fading overlay shows the sketch name, an input level meter and the keys (#17)
- Input sensitivity control: `+`/`-` adjust the mic gain in 2 dB steps (default +20 dB), shown in a fading label and remembered across sketches (#13)
- GPL-3.0 license and a License section in the README (#1)
- `.gitignore` for OS, editor, environment and screen-capture files (#2)

### Changed
- Single-page player: `index.html` plays every sketch (`#name` or `?sketch=name`) from one p5 instance in instance mode, with one shared mic, so switching never re-prompts. Code is now ES modules in `src/`, vendored libraries are in `vendor/`, and the old per-sketch pages redirect (#15)
- `polygons` and `mountains` rewritten as original code, inspired by but no longer copied from Jason Sigal's unlicensed p5-music-viz demos; shared original `polygon()` helper; MIT notice added for the Nature of Code code in `coverage` (#8)
- p5.js 0.5.11 → 1.11.13 and p5.sound 0.3.2 → 1.0.1. The mic is now opened without the browser's echo cancellation, noise suppression and auto-gain, so the sketches react to the raw signal (#11)

### Removed
- `p5.dom` (part of p5 core), `html5shiv`, `normalize.css` and the IE conditional comments (#11)

### Fixed
- Audio never started in current browsers: a click-to-start overlay resumes the audio context and starts the mic, with a message when the mic is blocked or missing; Safari's missing legacy `getUserMedia` is shimmed (#5)
- Sketch defects: `conical` and `coverage` now resize with the window (`mountains` since #8), `conical`'s off-centre composition scales with the window, every page has its own meta description, and leaked globals and dead code are removed (#6)
