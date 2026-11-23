# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- GPL-3.0 license and a License section in the README (#1)
- `.gitignore` for OS, editor, environment and screen-capture files (#2)

### Fixed
- Audio never started in current browsers: a click-to-start overlay resumes the audio context and starts the mic, with a message when the mic is blocked or missing; Safari's missing legacy `getUserMedia` is shimmed (#5)
