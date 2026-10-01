import { parseHexToRgbValues, convertHexToRgb, parseHexToHslValues, convertHexToHsl } from '../../src/scripts.js';

describe('HEX to RGB', () => {
  [
    ['#ff0000', 'rgb(255, 0, 0)'],
    ['#00ff00', 'rgb(0, 255, 0)'],
    ['#0000ff', 'rgb(0, 0, 255)'],
    ['#ffffff', 'rgb(255, 255, 255)'],
    ['#000000', 'rgb(0, 0, 0)'],
    ['#1a2b3c', 'rgb(26, 43, 60)'],
    ['#AABBCC', 'rgb(170, 187, 204)']
  ].forEach(([hex, rgb]) => {
    it(`converts ${hex} to ${rgb}`, () => {
      expect(convertHexToRgb(hex)).toBe(rgb);
    });
  });

  it('gives each channel as a number', () => {
    expect(parseHexToRgbValues('#123456')).toEqual({ r: 18, g: 52, b: 86 });
  });
});

describe('HEX to HSL', () => {
  /* The hue formula depends on which channel is largest, so each sector of the wheel gets a colour */
  [
    ['#ff0000', 'hsl(0, 100%, 50%)', 'red'],
    ['#ff8000', 'hsl(30, 100%, 50%)', 'orange'],
    ['#ffff00', 'hsl(60, 100%, 50%)', 'yellow'],
    ['#00ff00', 'hsl(120, 100%, 50%)', 'green'],
    ['#00ffff', 'hsl(180, 100%, 50%)', 'cyan'],
    ['#0000ff', 'hsl(240, 100%, 50%)', 'blue'],
    ['#ff00ff', 'hsl(300, 100%, 50%)', 'magenta'],
    ['#1a2b3c', 'hsl(210, 40%, 17%)', 'a dark slate']
  ].forEach(([hex, hsl, name]) => {
    it(`converts ${name} (${hex}) to ${hsl}`, () => {
      expect(convertHexToHsl(hex)).toBe(hsl);
    });
  });

  /* Saturation uses a different formula either side of 50% lightness, and at exactly 50% the two agree */
  it('works out saturation for a light colour above 50% lightness', () => {
    expect(convertHexToHsl('#ff8080')).toBe('hsl(0, 100%, 75%)');
  });

  it('works out saturation for a dark colour below 50% lightness', () => {
    expect(convertHexToHsl('#800000')).toBe('hsl(0, 100%, 25%)');
  });

  it('gives partial saturation for a muted colour', () => {
    expect(convertHexToHsl('#bf4040')).toBe('hsl(0, 50%, 50%)');
  });

  [
    ['#ffffff', 'hsl(0, 0%, 100%)'],
    ['#000000', 'hsl(0, 0%, 0%)'],
    ['#808080', 'hsl(0, 0%, 50%)']
  ].forEach(([hex, hsl]) => {
    it(`gives the grey ${hex} no hue or saturation`, () => {
      expect(convertHexToHsl(hex)).toBe(hsl);
    });
  });

  /* A hue just short of a full turn rounds up to 360, the boundary where the wheel starts again at 0 */
  it('wraps a hue that rounds up to 360 back round to 0', () => {
    expect(parseHexToHslValues('#ff0001')).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('keeps the last hue before the wrap at 359', () => {
    expect(convertHexToHsl('#ff0004')).toBe('hsl(359, 100%, 50%)');
  });
});