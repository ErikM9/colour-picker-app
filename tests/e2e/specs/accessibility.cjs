module.exports = {
  beforeEach(browser) {
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  after(browser) {
    browser.end();
  },

  'passes an automated WCAG 2.1 A and AA scan': function (browser) {
    browser.axeInject().axeRun('body', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
    });
  },

  'offers the colour as a labelled native colour input': function (browser) {
    browser.page.colourPicker().assert.attributeEquals('@input', 'type', 'color');
    browser.assert.textEquals('label[for="color-input"]', 'Pick a colour');
  },

  'exposes each Copy control as a focusable button named after its format': function (browser) {
    const picker = browser.page.colourPicker();

    ['@copyHex', '@copyRgb', '@copyHsl'].forEach((button) => {
      picker.assert.attributeEquals(button, 'role', 'button');
      picker.assert.attributeEquals(button, 'tabindex', '0');
    });
    picker.assert.attributeEquals('@copyHex', 'aria-label', 'Copy HEX value');
  },

  'exposes the circle as the one focusable colour control': function (browser) {
    const picker = browser.page.colourPicker();

    picker.assert.attributeEquals('@circle', 'role', 'button');
    picker.assert.attributeEquals('@circle', 'aria-label', 'Open colour picker');
    picker.assert.attributeEquals('@input', 'tabindex', '-1');
  },

  'reports changes through a status region': function (browser) {
    browser.page.colourPicker().assert.attributeEquals('@status', 'role', 'status');
  }
};