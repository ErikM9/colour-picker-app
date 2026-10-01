import { loadPage, settle } from './support/page.js';

describe('Colour picker page', () => {
  describe('on load', () => {
    it('shows the starting red in all three formats', () => {
      expect(loadPage().values()).toEqual({ hex: '#ff0000', rgb: 'rgb(255, 0, 0)', hsl: 'hsl(0, 100%, 50%)' });
    });

    it('paints the circle and all 52 background dots in that red', () => {
      const page = loadPage();

      expect(page.circle.style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(page.dots().length).toBe(52);
      expect(page.dots().every((dot) => dot.style.backgroundColor === 'rgb(255, 0, 0)')).toBeTrue();
    });

    it('has nothing to announce yet', () => {
      expect(loadPage().status.textContent).toBe('');
    });
  });

  describe('choosing a colour', () => {
    it('updates every format, the circle and the dots as the colour moves', () => {
      const page = loadPage();

      page.chooseColour('#1a2b3c', { commit: false });

      expect(page.values()).toEqual({ hex: '#1a2b3c', rgb: 'rgb(26, 43, 60)', hsl: 'hsl(210, 40%, 17%)' });
      expect(page.circle.style.backgroundColor).toBe('rgb(26, 43, 60)');
      expect(page.dots().every((dot) => dot.style.backgroundColor === 'rgb(26, 43, 60)')).toBeTrue();
    });

    it('stays quiet for screen readers while the colour is still moving', () => {
      const page = loadPage();

      page.chooseColour('#00ff00', { commit: false });

      expect(page.status.textContent).toBe('');
    });

    it('announces the colour once it has been chosen', () => {
      const page = loadPage();

      page.chooseColour('#00ff00');

      expect(page.status.textContent).toBe('Colour set to #00ff00');
    });
  });

  describe('colour circle', () => {
    it('opens the native picker when clicked', () => {
      const page = loadPage();
      spyOn(page.input, 'click');

      page.click(page.circle);

      expect(page.input.click).toHaveBeenCalledTimes(1);
    });

    ['Enter', ' '].forEach((key) => {
      it(`opens the native picker from the keyboard with ${key === ' ' ? 'Space' : key}`, () => {
        const page = loadPage();
        spyOn(page.input, 'click');

        page.press(page.circle, key);

        expect(page.input.click).toHaveBeenCalledTimes(1);
      });
    });

    it('ignores other keys', () => {
      const page = loadPage();
      spyOn(page.input, 'click');

      page.press(page.circle, 'Tab');

      expect(page.input.click).not.toHaveBeenCalled();
    });

    it('does not open the picker from the touch that comes before a tap', () => {
      const page = loadPage();
      spyOn(page.input, 'click');

      page.circle.dispatchEvent(new page.window.Event('touchstart', { bubbles: true }));

      expect(page.input.click).not.toHaveBeenCalled();
    });

    it('leaves opening the picker to the input itself on iOS', () => {
      const page = loadPage({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', platform: 'iPhone', maxTouchPoints: 5 });
      spyOn(page.input, 'click');

      page.click(page.circle);

      expect(page.input.click).not.toHaveBeenCalled();
    });
  });

  describe('copy buttons', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    ['hex', 'rgb', 'hsl'].forEach((format) => {
      it(`copies the ${format.toUpperCase()} value on show`, async () => {
        const page = loadPage();
        page.chooseColour('#00ff00');

        page.click(page.copyButton(format));
        await settle();

        expect(page.written).toEqual([page.values()[format]]);
      });
    });

    ['Enter', ' '].forEach((key) => {
      it(`copies from the keyboard with ${key === ' ' ? 'Space' : key}`, async () => {
        const page = loadPage();

        page.press(page.copyButton('rgb'), key);
        await settle();

        expect(page.written).toEqual(['rgb(255, 0, 0)']);
        expect(page.copyButton('rgb').textContent).toBe('Done!');
      });
    });

    it('confirms the copy on the button and to screen readers', async () => {
      const page = loadPage();

      page.click(page.copyButton('hex'));
      await settle();

      expect(page.copyButton('hex').textContent).toBe('Done!');
      expect(page.status.textContent).toBe('HEX value copied');
    });

    it('goes back to Copy a second and a half later', async () => {
      const page = loadPage();
      page.click(page.copyButton('hex'));
      await settle();

      jasmine.clock().tick(1499);
      expect(page.copyButton('hex').textContent).toBe('Done!');

      jasmine.clock().tick(1);
      expect(page.copyButton('hex').textContent).toBe('Copy');
    });

    it('starts the countdown again when clicked a second time', async () => {
      const page = loadPage();
      page.click(page.copyButton('hex'));
      await settle();
      jasmine.clock().tick(1000);

      page.click(page.copyButton('hex'));
      await settle();
      jasmine.clock().tick(1000);

      expect(page.copyButton('hex').textContent).toBe('Done!');
    });

    it('copies a selection when the Clipboard API is missing', async () => {
      const page = loadPage({ clipboard: 'missing' });

      page.click(page.copyButton('rgb'));
      await settle();

      expect(page.selectionCopies).toEqual(['rgb(255, 0, 0)']);
      expect(page.copyButton('rgb').textContent).toBe('Done!');
    });

    it('owns up when nothing could be copied', async () => {
      const page = loadPage({ clipboard: 'missing', copySucceeds: false });

      page.click(page.copyButton('hsl'));
      await settle();

      expect(page.copyButton('hsl').textContent).toBe('Failed');
      expect(page.status.textContent).toBe('The HSL value could not be copied');
    });
  });
});