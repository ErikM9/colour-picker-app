document.addEventListener('DOMContentLoaded', () => {
    generateFloatingDots(52);

    const colorPicker = document.getElementById('color-input');
    const colorCircle = document.getElementById('color-display');
    const copyButtons = document.querySelectorAll('.copy-button');

    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    colorPicker.addEventListener('input', refreshColorDisplay);

    if (!isIOS) {
        colorCircle.addEventListener('click', () => {
            colorPicker.click();
        });

        colorCircle.addEventListener('touchstart', () => {
            colorPicker.click();
        }, { passive: true });
    }

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.copy;
            const textToCopy = document.getElementById(targetId).textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Done!';
                setTimeout(() => button.textContent = originalText, 1500);
            });
        });
    });

    refreshColorDisplay();
});

function refreshColorDisplay() {
    const selectedColor = document.getElementById('color-input').value;

    document.getElementById('color-display').style.backgroundColor = selectedColor;
    document.getElementById('hex-code').textContent = selectedColor;
    document.getElementById('rgb-code').textContent = convertHexToRgb(selectedColor);
    document.getElementById('hsl-code').textContent = convertHexToHsl(selectedColor);

    recolorBackgroundDots(selectedColor);
}

function convertHexToRgb(hex) {
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    return `rgb(${red}, ${green}, ${blue})`;
}

function convertHexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
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

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateFloatingDots(count) {
    const canvas = document.getElementById('bg-canvas');
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.classList.add('floating-dot');

        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 6}s`;
        dot.style.animationDuration = `${12 + Math.random() * 8}s`;
        dot.style.width = `${8 + Math.random() * 18}px`;
        dot.style.height = dot.style.width;
        dot.style.opacity = Math.random() * 0.4 + 0.3;

        canvas.appendChild(dot);
    }
}

function recolorBackgroundDots(color) {
    const dots = document.querySelectorAll('.floating-dot');
    dots.forEach(dot => {
        dot.style.backgroundColor = color;
    });
}
