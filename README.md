# Colour Picker

![CI](https://github.com/ErikM9/colour-picker-app/actions/workflows/ci.yml/badge.svg)

Colour picker with real-time HEX, RGB, and HSL conversion and one-click copy.

## Run it

```bash
npm install
npm run serve
```

Then open http://localhost:3000.

## Testing

Unit tests with Jasmine, end-to-end tests with Nightwatch.js.

```bash
npm test                  # unit tests
npm run test:coverage     # unit tests with coverage (fails below 90%)
npm run test:e2e          # e2e tests in headless Chrome
npm run test:e2e:headed   # the same run in a visible window
npm run test:e2e:firefox  # e2e tests in Firefox
npm run test:all          # coverage run followed by the e2e suite
```

The e2e suite serves `src/` on port 3500 itself, so there is no need to start a server first. Screenshots of failures land in `tests_output/screenshots/`.

### Why these tools?

- **Jasmine** — BDD-style `describe`/`it` syntax with built-in spies and a mock clock, which covers the random dot styles and the copy button's countdown without extra libraries. Specs run in random order, so no test can quietly depend on another.
- **jsdom** — Runs the real page markup headlessly, so the copy buttons, announcements and colour updates are unit tested too.
- **c8** — Coverage from V8's built-in instrumentation, with no build step.
- **Nightwatch.js** — WebDriver-based, with first-class page objects and built-in axe scans. `<input type="color">` can't be typed into, so specs set the colour by firing the same `input` and `change` events the native picker does.

### How copying is tested

A headless browser has no clipboard to read back, so the specs swap in a clipboard that records what it was given, and assert on the exact text. A second path takes the Clipboard API away entirely and checks that the fallback copy selects the right text.

### What's tested

**Unit (66 specs, 99% of statements)**
- HEX to RGB and HSL conversion, with a colour for each sector of the hue wheel
- Boundaries: lightness either side of 50%, greys, and a hue that rounds up to 360
- iOS detection, including the touch-point count that separates an iPad Pro from a Mac
- Floating dot styles, with `Math.random` pinned
- Copying through the Clipboard API, the selection fallback, and failure
- The page itself: colour updates, announcements, the colour circle, the copy buttons' countdown, and Enter and Space on every control

**E2E (30 specs)**
- Page load and the starting colour
- Colour changes across formats, including the hue boundary
- Copying each format, the fallback path, and the confirmation
- Keyboard: tab order, the focus ring, opening the picker and copying with Enter and Space, focus after copying
- Accessibility: an axe scan, a labelled native colour input, focusable button-role controls, a status region
- Responsive layout at phone and tablet sizes

## CI

GitHub Actions runs the unit tests with coverage, and the e2e suite in Chrome and Firefox, on every push and pull request.