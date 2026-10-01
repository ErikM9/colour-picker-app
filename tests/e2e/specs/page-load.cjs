module.exports = {
  beforeEach(browser) {
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  after(browser) {
    browser.end();
  },

  'shows the page title and heading': function (browser) {
    browser.assert.titleEquals('Colour Picker');
    browser.page.colourPicker().assert.textEquals('@heading', 'Colour Picker');
  },

  'starts on red in all three formats': function (browser) {
    browser.page.colourPicker()
      .assert.textEquals('@hex', '#ff0000')
      .assert.textEquals('@rgb', 'rgb(255, 0, 0)')
      .assert.textEquals('@hsl', 'hsl(0, 100%, 50%)');
  },

  'paints the circle in the starting red': function (browser) {
    /* Chrome reports the colour as rgba(…, 1) and Firefox as rgb(…), so the check accepts either spelling */
    browser.page.colourPicker().expect.element('@circle').to.have.css('background-color').which.matches(/^rgba?\(255, 0, 0(, 1)?\)$/);
  },

  'fills the background with 52 dots in the same red': function (browser) {
    browser.execute(function () {
      const dots = Array.from(document.querySelectorAll('.floating-dot'));
      return { count: dots.length, allRed: dots.every((dot) => getComputedStyle(dot).backgroundColor === 'rgb(255, 0, 0)') };
    }, [], function (result) {
      browser.assert.deepStrictEqual(result.value, { count: 52, allRed: true });
    });
  }
};