export function parseHexToRgbValues(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}

export function convertHexToRgb(hex) {
  const { r, g, b } = parseHexToRgbValues(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

/* Standard HSL conversion from RGB values */
export function parseHexToHslValues(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    /* Greyscale colours have no hue or saturation */
    h = s = 0;
  } else {
    const diff = max - min;
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }

    h /= 6;
  }

  return {
    /* Rounding can carry a hue of 359.5 or more up to 360, which is the same colour as 0 */
    h: Math.round(h * 360) % 360,
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function convertHexToHsl(hex) {
  const { h, s, l } = parseHexToHslValues(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/* Randomise each dot so background motion feels organic */
export function generateDotStyle() {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${12 + Math.random() * 8}s`,
    size: `${8 + Math.random() * 18}px`,
    opacity: Math.random() * 0.4 + 0.3
  };
}

export function createDotElement(style, doc = globalThis.document) {
  const dot = doc.createElement('div');
  dot.classList.add('floating-dot');
  dot.style.left = style.left;
  dot.style.top = style.top;
  dot.style.animationDelay = style.animationDelay;
  dot.style.animationDuration = style.animationDuration;
  dot.style.width = style.size;
  dot.style.height = style.size;
  dot.style.opacity = style.opacity;
  return dot;
}

/* An iPad on iPadOS reports itself as a Mac, so touch support is used as a fallback check */
export function isIOSDevice(userAgent, platform, maxTouchPoints) {
  return /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1);
}

/* Copies through a hidden, selected textarea, the only way to copy where the Clipboard API is unavailable */
export function copyBySelection(text, doc = globalThis.document) {
  const previousFocus = doc.activeElement;
  const area = doc.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  doc.body.appendChild(area);
  area.focus();
  area.select();

  try {
    return doc.execCommand('copy');
  } catch {
    return false;
  } finally {
    area.remove();
    /* Focus goes back to where it was, so a keyboard user stays on the button they pressed */
    previousFocus?.focus?.();
  }
}

/* Copies with the Clipboard API where allowed and by selection otherwise, resolving to whether it worked */
export async function copyText(text, { clipboard = globalThis.navigator?.clipboard, doc = globalThis.document } = {}) {
  if (clipboard) {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      /* The browser refused, so the selection copy below still gets a chance */
    }
  }

  return copyBySelection(text, doc);
}

/* Makes Enter and Space activate an element with a button role, the way they would a real button */
export function activateOnKey(element, activate) {
  element.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate();
  });
}

/* --- Browser UI --- */

/* Wires the picker up to the given document, which lets a test pass in a page of its own */
export function initColourPicker(doc = globalThis.document, nav = globalThis.navigator) {
  const colorPicker = doc.getElementById('color-input');
  const colorCircle = doc.getElementById('color-display');
  const status = doc.getElementById('colour-status');
  const copyButtons = doc.querySelectorAll('.copy-button');

  /* Only iOS supports -webkit-touch-callout, which rules out a desktop browser that only reports itself as an iPhone */
  const isIOS = isIOSDevice(nav.userAgent, nav.platform, nav.maxTouchPoints) &&
    doc.defaultView.CSS.supports('-webkit-touch-callout', 'none');

  const announce = message => {
    status.textContent = message;
  };

  colorPicker.addEventListener('input', refreshColorDisplay);

  /* Screen readers hear the colour once it has been chosen, rather than at every step of a drag */
  colorPicker.addEventListener('change', () => {
    announce(`Colour set to ${colorPicker.value}`);
  });

  /* On iOS the input itself sits over the circle and takes the tap, so the circle gets no click handler */
  if (!isIOS) {
    colorCircle.addEventListener('click', () => colorPicker.click());
  }
  activateOnKey(colorCircle, () => colorPicker.click());

  copyButtons.forEach(button => {
    const format = button.dataset.copy.split('-')[0].toUpperCase();
    let revertTimer = null;

    const copy = async () => {
      const text = doc.getElementById(button.dataset.copy).textContent;
      const copied = await copyText(text, { clipboard: nav.clipboard, doc });

      button.textContent = copied ? 'Done!' : 'Failed';
      announce(copied ? `${format} value copied` : `The ${format} value could not be copied`);
      clearTimeout(revertTimer);
      revertTimer = setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    };

    button.addEventListener('click', copy);
    activateOnKey(button, copy);
  });

  generateFloatingDots(52);
  refreshColorDisplay();

  function generateFloatingDots(count) {
    const canvas = doc.getElementById('bg-canvas');

    for (let i = 0; i < count; i++) {
      canvas.appendChild(createDotElement(generateDotStyle(), doc));
    }
  }

  function refreshColorDisplay() {
    const color = colorPicker.value;

    colorCircle.style.backgroundColor = color;
    doc.getElementById('hex-code').textContent = color;
    doc.getElementById('rgb-code').textContent = convertHexToRgb(color);
    doc.getElementById('hsl-code').textContent = convertHexToHsl(color);

    /* Keep background dots synced with the selected colour */
    doc.querySelectorAll('.floating-dot').forEach(dot => {
      dot.style.backgroundColor = color;
    });
  }
}

/* Start the picker when a browser loads this module */
if (typeof document !== 'undefined' && document.getElementById('color-input')) {
  initColourPicker();
}