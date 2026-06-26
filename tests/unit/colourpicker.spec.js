import {
  convertHexToRgb,
  parseHexToRgbValues,
  convertHexToHsl,
  parseHexToHslValues,
  generateDotStyle,
  createDotElement,
  isIOSDevice,
} from '../../src/scripts.js';

describe('convertHexToRgb', () => {
  it('converts primary colours', () => {
    expect(convertHexToRgb('#ff0000')).toBe('rgb(255, 0, 0)');
    expect(convertHexToRgb('#00ff00')).toBe('rgb(0, 255, 0)');
    expect(convertHexToRgb('#0000ff')).toBe('rgb(0, 0, 255)');
  });
  it('converts white and black', () => {
    expect(convertHexToRgb('#ffffff')).toBe('rgb(255, 255, 255)');
    expect(convertHexToRgb('#000000')).toBe('rgb(0, 0, 0)');
  });
  it('converts mixed and uppercase hex', () => {
    expect(convertHexToRgb('#1a2b3c')).toBe('rgb(26, 43, 60)');
    expect(convertHexToRgb('#AABBCC')).toBe('rgb(170, 187, 204)');
  });
  it('converts gray', () => {
    expect(convertHexToRgb('#808080')).toBe('rgb(128, 128, 128)');
  });
});

describe('parseHexToRgbValues', () => {
  it('returns correct r/g/b object', () => {
    expect(parseHexToRgbValues('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHexToRgbValues('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseHexToRgbValues('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    expect(parseHexToRgbValues('#123456')).toEqual({ r: 18, g: 52, b: 86 });
  });
  it('is consistent with convertHexToRgb', () => {
    const { r, g, b } = parseHexToRgbValues('#1a2b3c');
    expect(convertHexToRgb('#1a2b3c')).toBe(`rgb(${r}, ${g}, ${b})`);
  });
});

describe('convertHexToHsl', () => {
  it('converts primary and secondary colours', () => {
    expect(convertHexToHsl('#ff0000')).toBe('hsl(0, 100%, 50%)');
    expect(convertHexToHsl('#00ff00')).toBe('hsl(120, 100%, 50%)');
    expect(convertHexToHsl('#0000ff')).toBe('hsl(240, 100%, 50%)');
    expect(convertHexToHsl('#ffff00')).toBe('hsl(60, 100%, 50%)');
    expect(convertHexToHsl('#00ffff')).toBe('hsl(180, 100%, 50%)');
    expect(convertHexToHsl('#ff00ff')).toBe('hsl(300, 100%, 50%)');
  });
  it('converts achromatic values', () => {
    expect(convertHexToHsl('#ffffff')).toBe('hsl(0, 0%, 100%)');
    expect(convertHexToHsl('#000000')).toBe('hsl(0, 0%, 0%)');
    expect(convertHexToHsl('#808080')).toBe('hsl(0, 0%, 50%)');
  });
  it('converts orange', () => {
    expect(convertHexToHsl('#ff8000')).toBe('hsl(30, 100%, 50%)');
  });
});

describe('parseHexToHslValues', () => {
  it('returns correct h/s/l object', () => {
    expect(parseHexToHslValues('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
    expect(parseHexToHslValues('#00ff00')).toEqual({ h: 120, s: 100, l: 50 });
    expect(parseHexToHslValues('#0000ff')).toEqual({ h: 240, s: 100, l: 50 });
    expect(parseHexToHslValues('#808080')).toEqual({ h: 0, s: 0, l: 50 });
  });
  it('is consistent with convertHexToHsl', () => {
    const { h, s, l } = parseHexToHslValues('#ff8000');
    expect(convertHexToHsl('#ff8000')).toBe(`hsl(${h}, ${s}%, ${l}%)`);
  });
});

describe('generateDotStyle', () => {
  it('returns well-formed style values within expected ranges', () => {
    for (let i = 0; i < 20; i++) {
      const s = generateDotStyle();
      const left = parseFloat(s.left);
      const top = parseFloat(s.top);
      const delay = parseFloat(s.animationDelay);
      const duration = parseFloat(s.animationDuration);
      const size = parseFloat(s.size);

      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThanOrEqual(100);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(100);
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThan(6);
      expect(duration).toBeGreaterThanOrEqual(12);
      expect(duration).toBeLessThanOrEqual(20);
      expect(size).toBeGreaterThanOrEqual(8);
      expect(size).toBeLessThanOrEqual(26);
      expect(s.opacity).toBeGreaterThanOrEqual(0.3);
      expect(s.opacity).toBeLessThanOrEqual(0.7);

      expect(s.left).toMatch(/^\d+(\.\d+)?%$/);
      expect(s.animationDelay).toMatch(/^\d+(\.\d+)?s$/);
      expect(s.animationDuration).toMatch(/^\d+(\.\d+)?s$/);
      expect(s.size).toMatch(/^\d+(\.\d+)?px$/);
    }
  });
  it('produces varied output across calls', () => {
    const seen = new Set();
    for (let i = 0; i < 10; i++) seen.add(JSON.stringify(generateDotStyle()));
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('createDotElement', () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = global.document;
    global.document = {
      createElement: function(tag) {
        const el = {
          tagName: tag.toUpperCase(),
          className: '',
          classList: {
            _classes: [],
            add(cls) { this._classes.push(cls); el.className = this._classes.join(' '); }
          },
          style: {}
        };
        return el;
      }
    };
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  it('returns a div with the floating-dot class', () => {
    const style = generateDotStyle();
    const el = createDotElement(style);
    expect(el.tagName).toBe('DIV');
    expect(el.classList._classes).toContain('floating-dot');
  });

  it('applies all style properties from the style object', () => {
    const style = generateDotStyle();
    const el = createDotElement(style);
    expect(el.style.left).toBe(style.left);
    expect(el.style.top).toBe(style.top);
    expect(el.style.animationDelay).toBe(style.animationDelay);
    expect(el.style.animationDuration).toBe(style.animationDuration);
    expect(el.style.width).toBe(style.size);
    expect(el.style.height).toBe(style.size);
    expect(parseFloat(el.style.opacity)).toBeCloseTo(style.opacity, 5);
  });

  it('produces independent elements for different styles', () => {
    const el1 = createDotElement(generateDotStyle());
    const el2 = createDotElement(generateDotStyle());
    expect(el1).not.toBe(el2);
  });
});

describe('isIOSDevice', () => {
  it('detects iPhone, iPad, iPod by user agent', () => {
    expect(isIOSDevice('iPhone', 'iPhone', 5)).toBe(true);
    expect(isIOSDevice('iPad', 'iPad', 5)).toBe(true);
    expect(isIOSDevice('iPod', 'iPod', 0)).toBe(true);
  });
  it('detects iPad Pro via MacIntel + touch points > 1', () => {
    expect(isIOSDevice('Safari', 'MacIntel', 5)).toBe(true);
  });
  it('returns false for MacIntel with 0 or 1 touch points', () => {
    expect(isIOSDevice('Safari', 'MacIntel', 0)).toBe(false);
    expect(isIOSDevice('Safari', 'MacIntel', 1)).toBe(false);
  });
  it('returns false for Android and Windows', () => {
    expect(isIOSDevice('Android', 'Linux', 5)).toBe(false);
    expect(isIOSDevice('Windows', 'Win32', 0)).toBe(false);
  });
});