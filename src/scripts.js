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

// Standard HSL conversion from RGB values
export function parseHexToHslValues(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    // Greyscale colours have no hue or saturation
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
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function convertHexToHsl(hex) {
  const { h, s, l } = parseHexToHslValues(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Randomise each dot so background motion feels organic
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

export function createDotElement(style) {
  const dot = document.createElement('div');
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

// iPad Pro reports as Mac, so touch support is used as a fallback check
export function isIOSDevice(userAgent, platform, maxTouchPoints) {
  return /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1);
}

/* Browser UI */
if (typeof document !== 'undefined' && document.getElementById('color-input')) {
  const colorPicker = document.getElementById('color-input');
  const colorCircle = document.getElementById('color-display');
  const copyButtons = document.querySelectorAll('.copy-button');
  const isIOS = isIOSDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);

  colorPicker.addEventListener('input', refreshColorDisplay);

  // Avoid double-opening the native colour picker on iOS
  if (!isIOS) {
    colorCircle.addEventListener('click', () => colorPicker.click());
    colorCircle.addEventListener('touchstart', () => colorPicker.click(), { passive: true });
  }

  copyButtons.forEach(button => {
    let revertTimer = null;

    button.addEventListener('click', () => {
      const text = document.getElementById(button.dataset.copy).textContent;

      const revert = () => {
        button.textContent = 'Done!';
        clearTimeout(revertTimer);
        revertTimer = setTimeout(() => button.textContent = 'Copy', 1500);
      };

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(revert).catch(() => {
          document.execCommand('copy');
          revert();
        });
      } else {
        document.execCommand('copy');
        revert();
      }
    });
  });

  generateFloatingDots(52);
  refreshColorDisplay();

  function generateFloatingDots(count) {
    const canvas = document.getElementById('bg-canvas');

    for (let i = 0; i < count; i++) {
      canvas.appendChild(createDotElement(generateDotStyle()));
    }
  }

  function refreshColorDisplay() {
    const color = colorPicker.value;

    colorCircle.style.backgroundColor = color;
    document.getElementById('hex-code').textContent = color;
    document.getElementById('rgb-code').textContent = convertHexToRgb(color);
    document.getElementById('hsl-code').textContent = convertHexToHsl(color);

    // Keep background dots synced with the selected colour
    document.querySelectorAll('.floating-dot').forEach(dot => {
      dot.style.backgroundColor = color;
    });
  }
}