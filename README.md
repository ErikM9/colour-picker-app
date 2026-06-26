# Colour Picker

![CI](https://github.com/ErikM9/colour-picker-app/actions/workflows/ci.yml/badge.svg)

Colour picker with real-time HEX, RGB, and HSL conversion and one-click copy.

## Run it

```bash
npm install
npm run serve
```

## Testing

Unit tests with Jasmine, E2E tests with Nightwatch.js.

```bash
npm test           # unit tests
npm run test:e2e   # e2e tests (needs npm run serve first)
```

### Why these tools?

- **Jasmine** — BDD-style `describe`/`it` syntax, zero config needed beyond `jasmine.json`. A natural fit for the pure conversion functions (hex→RGB, hex→HSL math).
- **Nightwatch.js** — WebDriver-based, which matters here because `<input type="color">` can't be typed into normally. Tests set the colour via `browser.execute()` to inject a JS event directly, and Nightwatch handles the timing and assertions cleanly around that.

### What's tested

**Unit (20 tests)**
- HEX → RGB conversion and parsing
- HEX → HSL conversion and parsing
- Floating dot style generation and element creation
- iOS device detection

**E2E (32 specs - 91 total assertions)**
- Page load and structure
- Default colour state
- Colour change updates (all three format displays)
- Floating dot recolouring
- Copy button behaviour and revert timeout
- Accessibility (aria-labels, live region, heading, role attributes)
- Responsive design

## CI

GitHub Actions runs both test suites on push.