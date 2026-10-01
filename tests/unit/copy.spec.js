import { JSDOM } from 'jsdom';
import { copyText, copyBySelection } from '../../src/scripts.js';
import { fakeClipboard, recordSelectionCopies } from './support/page.js';

describe('copyText', () => {
  let document;

  beforeEach(() => {
    ({ document } = new JSDOM('<button id="copy">Copy</button>').window);
  });

  it('writes through the Clipboard API when the browser allows it', async () => {
    const { clipboard, written } = fakeClipboard('working');
    const selectionCopies = recordSelectionCopies(document);

    expect(await copyText('#00ff00', { clipboard, doc: document })).toBeTrue();
    expect(written).toEqual(['#00ff00']);
    expect(selectionCopies).toEqual([]);
  });

  it('copies a selection instead when the browser refuses the Clipboard API', async () => {
    const { clipboard } = fakeClipboard('refusing');
    const selectionCopies = recordSelectionCopies(document);

    expect(await copyText('rgb(0, 255, 0)', { clipboard, doc: document })).toBeTrue();
    expect(selectionCopies).toEqual(['rgb(0, 255, 0)']);
  });

  it('copies a selection instead when there is no Clipboard API at all', async () => {
    const selectionCopies = recordSelectionCopies(document);

    expect(await copyText('hsl(120, 100%, 50%)', { clipboard: undefined, doc: document })).toBeTrue();
    expect(selectionCopies).toEqual(['hsl(120, 100%, 50%)']);
  });

  it('reports that nothing was copied when the selection copy fails too', async () => {
    recordSelectionCopies(document, { succeeds: false });

    expect(await copyText('#00ff00', { clipboard: undefined, doc: document })).toBeFalse();
  });
});

describe('copyBySelection', () => {
  let document;

  beforeEach(() => {
    ({ document } = new JSDOM('<button id="copy">Copy</button>').window);
  });

  it('selects exactly the text being copied', () => {
    const selectionCopies = recordSelectionCopies(document);

    copyBySelection('#1a2b3c', document);

    expect(selectionCopies).toEqual(['#1a2b3c']);
  });

  it('reports a failed copy instead of throwing when the browser blocks it', () => {
    document.execCommand = () => { throw new Error('Blocked'); };

    expect(copyBySelection('#1a2b3c', document)).toBeFalse();
  });

  it('leaves no helper element behind', () => {
    recordSelectionCopies(document);

    copyBySelection('#1a2b3c', document);

    expect(document.querySelectorAll('textarea').length).toBe(0);
  });

  it('hands focus back to the button that asked for the copy', () => {
    recordSelectionCopies(document);
    const button = document.getElementById('copy');
    button.focus();

    copyBySelection('#1a2b3c', document);

    expect(document.activeElement).toBe(button);
  });
});