const COLOURS = [
  { name: 'green', hex: '#00ff00', rgb: 'rgb(0, 255, 0)', hsl: 'hsl(120, 100%, 50%)' },
  { name: 'blue', hex: '#0000ff', rgb: 'rgb(0, 0, 255)', hsl: 'hsl(240, 100%, 50%)' },
  { name: 'white', hex: '#ffffff', rgb: 'rgb(255, 255, 255)', hsl: 'hsl(0, 0%, 100%)' },
  { name: 'black', hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)' },
  { name: 'a light pink above 50% lightness', hex: '#ff8080', rgb: 'rgb(255, 128, 128)', hsl: 'hsl(0, 100%, 75%)' },
  { name: 'a red whose hue rounds up to a full turn', hex: '#ff0001', rgb: 'rgb(255, 0, 1)', hsl: 'hsl(0, 100%, 50%)' }
];

const tests = {
  beforeEach(browser) {
    browser.page.colourPicker().navigate().waitForElementVisible('@hex');
  },

  after(browser) {
    browser.end();
  }
};

COLOURS.forEach(({ name, hex, rgb, hsl }) => {
  tests[`shows ${name} in all three formats`] = function (browser) {
    const picker = browser.page.colourPicker();

    picker.chooseColour(hex);

    picker
      .assert.textEquals('@hex', hex)
      .assert.textEquals('@rgb', rgb)
      .assert.textEquals('@hsl', hsl);
  };
});

tests['repaints the circle and every dot in the new colour'] = function (browser) {
  const picker = browser.page.colourPicker();

  picker.chooseColour('#1a2b3c');

  /* rgba(…, 1) in Chrome, rgb(…) in Firefox */
  picker.expect.element('@circle').to.have.css('background-color').which.matches(/^rgba?\(26, 43, 60(, 1)?\)$/);
  browser.execute(function () {
    return Array.from(document.querySelectorAll('.floating-dot'))
      .every((dot) => getComputedStyle(dot).backgroundColor === 'rgb(26, 43, 60)');
  }, [], function (result) {
    browser.assert.strictEqual(result.value, true, 'every dot has taken on the new colour');
  });
};

tests['tells screen readers which colour was chosen'] = function (browser) {
  const picker = browser.page.colourPicker();

  picker.chooseColour('#00ff00');

  picker.assert.domPropertyEquals('@status', 'textContent', 'Colour set to #00ff00');
};

module.exports = tests;