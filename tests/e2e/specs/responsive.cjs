const horizontalOverflow = (browser, check) => browser.execute(function () {
  return document.documentElement.scrollWidth - document.documentElement.clientWidth;
}, [], check);

module.exports = {
  beforeEach(browser) {
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  afterEach(browser) {
    browser.resizeWindow(1280, 800);
  },

  after(browser) {
    browser.end();
  },

  'fits a phone screen without sideways scrolling': function (browser) {
    browser.resizeWindow(375, 667);

    browser.page.colourPicker().assert.visible('@circle').assert.visible('@copyHsl');
    horizontalOverflow(browser, (result) => browser.assert.strictEqual(result.value, 0));
  },

  'fits a tablet screen without sideways scrolling': function (browser) {
    browser.resizeWindow(768, 1024);

    horizontalOverflow(browser, (result) => browser.assert.strictEqual(result.value, 0));
  },

  'still copies on a phone screen': function (browser) {
    const picker = browser.page.colourPicker();
    browser.resizeWindow(375, 667);
    picker.recordClipboard();

    picker.click('@copyRgb');

    picker.assert.textEquals('@copyRgb', 'Done!');
  }
};