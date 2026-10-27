/* Only Chrome's DevTools can switch a contrast theme on, so this spec is tagged for Chrome alone */
module.exports = {
  '@tags': ['chrome-only'],

  beforeEach(browser) {
    browser.chrome.sendDevToolsCommand('Emulation.setEmulatedMedia', {
      features: [{ name: 'forced-colors', value: 'active' }]
    });
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  after(browser) {
    browser.end();
  },

  'keeps the colour circle in its colour under a contrast theme': function (browser) {
    const picker = browser.page.colourPicker();

    picker.chooseColour('#3366cc');
    picker.expect.element('@circle').to.have.css('background-color').which.matches(/^rgba?\(51, 102, 204(, 1)?\)$/);
  }
};