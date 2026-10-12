import { JSDOM } from 'jsdom';
import { generateDotStyle, createDotElement } from '../../src/scripts.js';

describe('generateDotStyle', () => {
  it('sits at the start of every range when Math.random returns 0', () => {
    spyOn(Math, 'random').and.returnValue(0);

    expect(generateDotStyle()).toEqual({
      left: '0%',
      top: '0%',
      animationDelay: '0s',
      animationDuration: '12s',
      size: '8px',
      opacity: 0.3
    });
  });

  it('sits in the middle of every range when Math.random returns 0.5', () => {
    spyOn(Math, 'random').and.returnValue(0.5);

    expect(generateDotStyle()).toEqual({
      left: '50%',
      top: '50%',
      animationDelay: '3s',
      animationDuration: '16s',
      size: '17px',
      opacity: 0.5
    });
  });
});

describe('createDotElement', () => {
  it('builds a floating-dot div that carries the whole style', () => {
    const { document } = new JSDOM('').window;
    const style = { left: '10%', top: '20%', animationDelay: '1s', animationDuration: '14s', size: '12px', opacity: 0.4 };

    const dot = createDotElement(style, document);

    expect(dot.tagName).toBe('DIV');
    expect(dot.className).toBe('floating-dot');
    expect(dot.style.left).toBe('10%');
    expect(dot.style.top).toBe('20%');
    expect(dot.style.animationDelay).toBe('1s');
    expect(dot.style.animationDuration).toBe('14s');
    expect(dot.style.width).toBe('12px');
    expect(dot.style.height).toBe('12px');
    expect(dot.style.opacity).toBe('0.4');
  });
});