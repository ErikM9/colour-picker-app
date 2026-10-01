const copiedTexts = (browser, check) => browser.execute(function () { return window.__copied; }, [], check);

module.exports = {
  beforeEach(browser) {
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  after(browser) {
    browser.end();
  },

  'copies the value shown in each format': function (browser) {
    const picker = browser.page.colourPicker();
    picker.chooseColour('#1a2b3c').recordClipboard();

    picker.click('@copyHex').click('@copyRgb').click('@copyHsl');

    picker.assert.textEquals('@copyHsl', 'Done!');
    copiedTexts(browser, function (result) {
      browser.assert.deepStrictEqual(result.value, ['#1a2b3c', 'rgb(26, 43, 60)', 'hsl(210, 40%, 17%)']);
    });
  },

  'confirms the copy, then goes back to Copy': function (browser) {
    const picker = browser.page.colourPicker();
    picker.recordClipboard();

    picker.click('@copyHex');

    picker.assert.textEquals('@copyHex', 'Done!');
    picker.assert.textEquals('@copyHex', 'Copy');
  },

  'tells screen readers the value was copied': function (browser) {
    const picker = browser.page.colourPicker();
    picker.recordClipboard();

    picker.click('@copyRgb');

    picker.assert.domPropertyEquals('@status', 'textContent', 'RGB value copied');
  },

  'still copies the right text when the Clipboard API is unavailable': function (browser) {
    const picker = browser.page.colourPicker();
    picker.chooseColour('#00ff00').recordSelectionCopies();

    picker.click('@copyHex');

    picker.assert.textEquals('@copyHex', 'Done!');
    browser.execute(function () { return window.__selectionCopies; }, [], function (result) {
      browser.assert.deepStrictEqual(result.value, ['#00ff00']);
    });
  }
};