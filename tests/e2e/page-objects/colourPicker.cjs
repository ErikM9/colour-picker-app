/* Page object for the picker, holding the locators and actions while the specs keep the assertions */
module.exports = {
  url() {
    return this.api.launchUrl;
  },

  elements: {
    heading: 'h1',
    circle: '#color-display',
    input: '#color-input',
    label: 'label[for="color-input"]',
    hex: '#hex-code',
    rgb: '#rgb-code',
    hsl: '#hsl-code',
    status: '#colour-status',
    copyHex: '.copy-button[data-copy="hex-code"]',
    copyRgb: '.copy-button[data-copy="rgb-code"]',
    copyHsl: '.copy-button[data-copy="hsl-code"]'
  },

  commands: [{
    /* Sets the colour through the events the native picker fires, as WebDriver cannot drive the picker itself */
    chooseColour(hex) {
      this.api.execute(function (value) {
        const input = document.getElementById('color-input');
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, [hex]);
      return this;
    },

    /* Presses Tab through the W3C user actions API */
    pressTab() {
      this.api.perform(function () {
        return this.actions({ async: true }).sendKeys(this.Keys.TAB);
      });
      return this;
    },

    /* Counts the clicks that would open the native dialog, which itself stays out of WebDriver's reach */
    countPickerOpens() {
      this.api.execute(function () {
        window.__pickerOpens = 0;
        const input = document.getElementById('color-input');
        input.click = function () { window.__pickerOpens += 1; };
      });
      return this;
    },

    /* Passes on how many times the native dialog was asked to open */
    pickerOpens(check) {
      this.api.execute(function () { return window.__pickerOpens; }, [], (result) => check(result.value));
      return this;
    },

    /* Swaps in a clipboard that remembers what it was given, as reading the real one back needs browser-specific permissions */
    recordClipboard() {
      this.api.execute(function () {
        window.__copied = [];
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText(text) {
              window.__copied.push(text);
              return Promise.resolve();
            }
          }
        });
      });
      return this;
    },

    /* Passes on the texts the recording clipboard was given */
    copiedTexts(check) {
      this.api.execute(function () { return window.__copied; }, [], (result) => check(result.value));
      return this;
    },

    /* Takes the Clipboard API away and records the text selected whenever the fallback copy runs */
    recordSelectionCopies() {
      this.api.execute(function () {
        window.__selectionCopies = [];
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
        document.execCommand = function (command) {
          if (command === 'copy') {
            const field = document.activeElement;
            window.__selectionCopies.push(field.value.slice(field.selectionStart, field.selectionEnd));
          }
          return true;
        };
      });
      return this;
    },

    /* Passes on the texts the fallback copy had selected */
    selectionCopies(check) {
      this.api.execute(function () { return window.__selectionCopies; }, [], (result) => check(result.value));
      return this;
    }
  }]
};