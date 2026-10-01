import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { initColourPicker } from '../../../src/scripts.js';

const indexHtml = readFileSync(new URL('../../../src/index.html', import.meta.url), 'utf8');

/* Lets the asynchronous copy handler finish before a test looks at the page */
export const settle = async (ticks = 3) => {
  for (let i = 0; i < ticks; i += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
};

/* A clipboard that records what was written, one that refuses, or none at all */
export function fakeClipboard(behaviour = 'working') {
  const written = [];

  if (behaviour === 'missing') return { clipboard: undefined, written };

  const writeText = behaviour === 'working'
    ? async (text) => { written.push(text); }
    : async () => { throw new Error('Write permission denied'); };

  return { clipboard: { writeText }, written };
}

/* Stands in for execCommand, which jsdom lacks, recording the text selected at the moment of the copy */
export function recordSelectionCopies(doc, { succeeds = true } = {}) {
  const copies = [];

  doc.execCommand = (command) => {
    if (command === 'copy') {
      const field = doc.activeElement;
      copies.push(field?.value?.slice(field.selectionStart, field.selectionEnd) ?? '');
    }
    return succeeds;
  };

  return copies;
}

/* Boots the real page markup in jsdom and starts the picker on it */
export function loadPage({
  clipboard = 'working',
  copySucceeds = true,
  userAgent = 'Mozilla/5.0 (X11; Linux x86_64)',
  platform = 'Linux x86_64',
  maxTouchPoints = 0
} = {}) {
  const dom = new JSDOM(indexHtml, { url: 'http://localhost:3000' });
  const { window } = dom;
  const { document } = window;
  const { clipboard: fake, written } = fakeClipboard(clipboard);
  const selectionCopies = recordSelectionCopies(document, { succeeds: copySucceeds });

  initColourPicker(document, { userAgent, platform, maxTouchPoints, clipboard: fake });

  const byId = (id) => document.getElementById(id);

  return {
    window,
    document,
    written,
    selectionCopies,
    input: byId('color-input'),
    circle: byId('color-display'),
    status: byId('colour-status'),
    dots: () => [...document.querySelectorAll('.floating-dot')],
    copyButton: (format) => document.querySelector(`.copy-button[data-copy="${format}-code"]`),
    values: () => ({
      hex: byId('hex-code').textContent,
      rgb: byId('rgb-code').textContent,
      hsl: byId('hsl-code').textContent
    }),

    /* A drag in the native picker fires input events, and letting go fires change */
    chooseColour(hex, { commit = true } = {}) {
      const input = byId('color-input');
      input.value = hex;
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      if (commit) input.dispatchEvent(new window.Event('change', { bubbles: true }));
    },

    click: (element) => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })),
    press: (element, key) => element.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  };
}