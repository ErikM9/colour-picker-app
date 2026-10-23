# Colour Picker

![CI](https://github.com/ErikM9/colour-picker-app/actions/workflows/ci.yml/badge.svg)

A simple colour picker which shows the chosen colour as HEX, RGB and HSL and lets you copy any of the three with one click.

**Live demo:** [erikm9.github.io/colour-picker-app](https://erikm9.github.io/colour-picker-app/)

## Run it

```bash
npm install
npm run serve
```

Then open http://localhost:3000.

## Testing

I used Jasmine for the unit tests and Nightwatch.js for the end-to-end tests. jsdom 30 asks for Node 22.22.2 or newer, and 24.15 or newer on Node 24.

```bash
npm test                  # unit tests
npm run test:coverage     # unit tests with coverage (fails below 90%)
npm run test:e2e          # e2e tests in headless Chrome
npm run test:e2e:headed   # the same run in a visible window
npm run test:e2e:firefox  # e2e tests in Firefox
npm run test:all          # coverage run followed by the e2e suite
```

The e2e suite serves `src/` on port 3500 by itself, so you don't need to start a server first. Screenshots of failed tests end up in `tests_output/screenshots/`.

### Why these tools?

I chose the testing tools for my smaller projects so I could learn how various testing tools work, and each project ended up with a different set. For the Colour Picker I went with Jasmine, jsdom, c8 and Nightwatch.js.

- Jasmine comes with its own assertions, spies and mock clock, so pinning `Math.random` for the floating dots and stepping through the countdown on the copy buttons needed no extra libraries. It also runs the specs in random order, so no test can quietly depend on another.
- jsdom runs the real page markup without a browser, so the copy buttons, the announcements and the colour updates are unit tested as well.
- c8 measures the coverage of the unit tests straight from V8, so there is no build step, and it fails the run when coverage drops below 90%.
- Nightwatch.js drives Chrome and Firefox through WebDriver. Its page objects keep every locator and action in one place, and axe scans and screenshots of failed tests come built in.

### The native picker and the clipboard

WebDriver can't reach the browser's own colour picker, so the specs set the colour by firing the same `input` and `change` events the picker does, and count the clicks which would open it.

Reading the real clipboard back from a test needs browser-specific permissions, so the specs swap in a clipboard which records what it was given and then check the exact text. A second set of tests takes the Clipboard API away entirely and checks that the fallback copy selects the right text.

### What's tested

**Unit (68 tests, 99% of statements)**
- HEX to RGB and HSL conversion, with a colour for each sector of the hue wheel
- Boundaries: lightness either side of 50%, greys and a hue which rounds up to 360
- iOS detection, including the touch-point count which tells an iPad apart from a Mac
- The styles of the floating dots, with `Math.random` pinned
- Copying through the Clipboard API, the selection fallback and a failed copy
- The page itself: colour updates, announcements, the colour circle, the countdown of the copy buttons and Enter/Space on the circle and on a copy button

**End-to-end (32 tests)**
- Page load and the starting colour
- Opening the picker with a click and colour changes in all three formats, including the hue boundary
- Copying each format, the fallback and the confirmation
- Keyboard: tab order, the focus ring, opening the picker with Enter, copying with Enter and Space, focus after copying
- Accessibility: an axe scan, a labelled native colour input, focusable controls with a button role, a status region and the colour circle under a contrast theme (in Chrome only, as only its DevTools can turn one on)
- Responsive layout at phone and tablet sizes

## CI

GitHub Actions runs the unit tests with coverage and the e2e suite in Chrome and Firefox on every push and pull request to `main`. A push to `main` which passes them is then deployed to GitHub Pages, straight from `src/`.