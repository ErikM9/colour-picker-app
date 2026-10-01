const focusedId = (browser, check) => browser.execute(function () {
  const element = document.activeElement;
  return element.id || element.getAttribute('data-copy');
}, [], check);

module.exports = {
  beforeEach(browser) {
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  after(browser) {
    browser.end();
  },

  'moves from the circle to each Copy button with Tab, skipping the hidden input': function (browser) {
    const picker = browser.page.colourPicker();
    const order = [];

    ['color-display', 'hex-code', 'rgb-code', 'hsl-code'].forEach(() => {
      picker.pressTab();
      focusedId(browser, (result) => order.push(result.value));
    });

    browser.perform(() => {
      browser.assert.deepStrictEqual(order, ['color-display', 'hex-code', 'rgb-code', 'hsl-code']);
    });
  },

  'rings the circle while it has keyboard focus': function (browser) {
    const picker = browser.page.colourPicker();

    picker.pressTab();

    picker.assert.cssProperty('@circle', 'outline-style', 'solid');
  },

  /* WebDriver cannot see the native colour dialog, so the click that opens it is what gets counted */
  'opens the colour picker with Enter on the circle': function (browser) {
    const picker = browser.page.colourPicker();
    picker.countPickerOpens();

    picker.sendKeys('@circle', browser.Keys.ENTER);

    browser.execute(function () { return window.__pickerOpens; }, [], function (result) {
      browser.assert.strictEqual(result.value, 1);
    });
  },

  'copies with Enter on a Copy button': function (browser) {
    const picker = browser.page.colourPicker();
    picker.recordClipboard();

    picker.sendKeys('@copyHex', browser.Keys.ENTER);

    picker.assert.textEquals('@copyHex', 'Done!');
    browser.execute(function () { return window.__copied; }, [], function (result) {
      browser.assert.deepStrictEqual(result.value, ['#ff0000']);
    });
  },

  'copies with Space on a Copy button': function (browser) {
    const picker = browser.page.colourPicker();
    picker.recordClipboard();

    picker.sendKeys('@copyHsl', browser.Keys.SPACE);

    picker.assert.textEquals('@copyHsl', 'Done!');
  },

  'keeps focus on the Copy button after copying': function (browser) {
    const picker = browser.page.colourPicker();
    picker.recordSelectionCopies();

    picker.sendKeys('@copyRgb', browser.Keys.ENTER);
    picker.assert.textEquals('@copyRgb', 'Done!');

    focusedId(browser, function (result) {
      browser.assert.strictEqual(result.value, 'rgb-code');
    });
  }
};