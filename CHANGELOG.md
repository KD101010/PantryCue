# Changelog

## 0.6.0

### Added

- 36 original recipes, bringing the base catalog to 110 meals
- Dietary recipe adaptation with explicit specialty-product requirements
- Dietary-fit labels and safety notes in recipe details
- Detailed Cooking Mode setup, equipment, heat, rack, timing, temperature, and serving guidance
- Barcode scanning through ZXing with live camera, photo, and manual-entry paths
- Regression tests for gluten-free spaghetti, dairy-free matching, pork-free filtering, dietary variants, barcode labels, catalog integrity, and Cooking Mode guidance
- Pull request production-build validation in GitHub Actions

### Fixed

- Compatible recipes disappearing when gluten-free or dairy-free preferences were selected
- Gluten-free spaghetti not matching a fully stocked gluten-free pantry
- White ingredient text disappearing on white Cooking Mode cards
- Cooking Mode ignoring the serving count selected on the recipe screen
- Browser barcode support depending on the unavailable `BarcodeDetector` API
- Barcode normalization dropping important gluten-free, dairy-free, or vegan labels
- Optional ingredients appearing as if they were available
- Generic and dietary versions of the same food being incorrectly deduplicated

### Changed

- Pinned production and development dependency versions
- Added a committed lockfile and changed CI installs to `npm ci`
- Updated GitHub Actions to Node.js 24
- Renamed the photo action to **Photo + confirm** so the beta behavior is clear
