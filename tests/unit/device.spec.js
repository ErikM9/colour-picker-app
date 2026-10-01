import { isIOSDevice } from '../../src/scripts.js';

describe('isIOSDevice', () => {
  [
    ['an iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'iPhone', 5, true],
    ['an iPad', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', 'iPad', 5, true],
    ['an iPod', 'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)', 'iPod', 0, true],
    ['an iPad Pro, which reports itself as a Mac with touch', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 5, true],
    ['a Mac with two touch points, the first count that means touch', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 2, true],
    ['a Mac with one touch point', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 1, false],
    ['a Mac without touch', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 0, false],
    ['an Android phone', 'Mozilla/5.0 (Linux; Android 14; Pixel 8)', 'Linux armv8l', 5, false],
    ['a Windows laptop with touch', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32', 10, false]
  ].forEach(([device, userAgent, platform, touchPoints, expected]) => {
    it(`${expected ? 'recognises' : 'rules out'} ${device}`, () => {
      expect(isIOSDevice(userAgent, platform, touchPoints)).toBe(expected);
    });
  });
});