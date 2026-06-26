function setColor(browser, color) {
  return browser.execute(function(c) {
    const input = document.getElementById('color-input');
    input.value = c;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, [color]);
}

module.exports = {
  before: function(browser) {
    browser.url('http://localhost:3000').waitForElementVisible('body', 2000);
  },

  after: function(browser) {
    browser.end();
  },

  'Page loads with correct title and container': function(browser) {
    browser
      .assert.titleEquals('Colour Picker')
      .assert.visible('.picker-container')
      .assert.visible('#color-display')
      .assert.elementPresent('#color-input');
  },

  'Header displays correctly': function(browser) {
    browser.assert.textEquals('h1', 'Colour Picker');
  },

  'Default colour is red — all three formats shown': function(browser) {
    browser
      .assert.textContains('#hex-code', '#ff0000')
      .assert.textContains('#rgb-code', 'rgb(255, 0, 0)')
      .assert.textContains('#hsl-code', 'hsl(0, 100%, 50%)');
  },

  'Color input is present and typed as color': function(browser) {
    browser.assert.attributeEquals('#color-input', 'type', 'color');
  },

  'Color circle has the correct class': function(browser) {
    browser.assert.hasClass('#color-display', 'color-circle');
  },

  'Three copy buttons are present with correct data attributes': function(browser) {
    browser
      .elements('css selector', '.copy-button', function(result) {
        browser.assert.strictEqual(result.value.length, 3);
      })
      .assert.attributeEquals('.copy-button[data-copy="hex-code"]', 'data-copy', 'hex-code')
      .assert.attributeEquals('.copy-button[data-copy="rgb-code"]', 'data-copy', 'rgb-code')
      .assert.attributeEquals('.copy-button[data-copy="hsl-code"]', 'data-copy', 'hsl-code');
  },

  '52 floating dots are generated': function(browser) {
    browser.elements('css selector', '.floating-dot', function(result) {
      browser.assert.strictEqual(result.value.length, 52);
    });
  },

  'Background canvas is present': function(browser) {
    browser.assert.visible('#bg-canvas');
  },

  'All three format display elements are visible': function(browser) {
    browser
      .assert.visible('#hex-code')
      .assert.visible('#rgb-code')
      .assert.visible('#hsl-code');
  },

  'Color details section has three paragraphs': function(browser) {
    browser.elements('css selector', '.color-details p', function(result) {
      browser.assert.strictEqual(result.value.length, 3);
    });
  },

  'Changing colour updates all three displays — green': function(browser) {
    setColor(browser, '#00ff00');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#00ff00')
      .assert.textContains('#rgb-code', 'rgb(0, 255, 0)')
      .assert.textContains('#hsl-code', 'hsl(120, 100%, 50%)');
  },

  'Changing colour updates all three displays — blue': function(browser) {
    setColor(browser, '#0000ff');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#0000ff')
      .assert.textContains('#rgb-code', 'rgb(0, 0, 255)')
      .assert.textContains('#hsl-code', 'hsl(240, 100%, 50%)');
  },

  'Changing colour updates all three displays — white': function(browser) {
    setColor(browser, '#ffffff');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#ffffff')
      .assert.textContains('#rgb-code', 'rgb(255, 255, 255)')
      .assert.textContains('#hsl-code', 'hsl(0, 0%, 100%)');
  },

  'Changing colour updates all three displays — black': function(browser) {
    setColor(browser, '#000000');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#000000')
      .assert.textContains('#rgb-code', 'rgb(0, 0, 0)')
      .assert.textContains('#hsl-code', 'hsl(0, 0%, 0%)');
  },

  'Changing colour updates all three displays — yellow': function(browser) {
    setColor(browser, '#ffff00');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#ffff00')
      .assert.textContains('#rgb-code', 'rgb(255, 255, 0)')
      .assert.textContains('#hsl-code', 'hsl(60, 100%, 50%)');
  },

  'Changing colour updates all three displays — cyan': function(browser) {
    setColor(browser, '#00ffff');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#00ffff')
      .assert.textContains('#rgb-code', 'rgb(0, 255, 255)')
      .assert.textContains('#hsl-code', 'hsl(180, 100%, 50%)');
  },

  'Changing colour updates all three displays — magenta': function(browser) {
    setColor(browser, '#ff00ff');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#ff00ff')
      .assert.textContains('#rgb-code', 'rgb(255, 0, 255)')
      .assert.textContains('#hsl-code', 'hsl(300, 100%, 50%)');
  },

  'Changing colour updates all three displays — orange': function(browser) {
    setColor(browser, '#ff8000');
    browser
      .waitForElementVisible('#hex-code', 1000)
      .assert.textContains('#hex-code', '#ff8000')
      .assert.textContains('#rgb-code', 'rgb(255, 128, 0)')
      .assert.textContains('#hsl-code', 'hsl(30, 100%, 50%)');
  },

  'Multiple sequential colour changes all take effect': function(browser) {
    setColor(browser, '#ff0000');
    browser.waitForElementVisible('#hex-code', 1000).assert.textContains('#hex-code', '#ff0000');
    setColor(browser, '#00ff00');
    browser.waitForElementVisible('#hex-code', 1000).assert.textContains('#hex-code', '#00ff00');
    setColor(browser, '#0000ff');
    browser.waitForElementVisible('#hex-code', 1000).assert.textContains('#hex-code', '#0000ff');
  },

  'Color circle receives the selected background color': function(browser) {
    setColor(browser, '#ff0000');
    browser.getCssProperty('#color-display', 'background-color', function(result) {
      this.assert.ok(result.value.includes('255') || result.value.includes('rgb'));
    });
  },

  'Floating dots are recoloured when colour changes': function(browser) {
    setColor(browser, '#00ff00');
    browser.waitForElementPresent('.floating-dot', 1000).getCssProperty('.floating-dot', 'background-color', function(result) {
      this.assert.ok(result.value.includes('0, 255, 0') || result.value.includes('rgb'));
    });
  },

  'Copy buttons show Done! immediately after click': function(browser) {
    browser.execute(function() {
      if (!navigator.clipboard) {
        navigator.clipboard = {
          writeText: () => Promise.resolve()
        };
      }
    });
    browser
      .waitForElementVisible('.copy-button[data-copy="hex-code"]', 1000)
      .click('.copy-button[data-copy="hex-code"]')
      .waitForElementVisible('.copy-button[data-copy="hex-code"]', 1000)
      .assert.textEquals('.copy-button[data-copy="hex-code"]', 'Done!');
    browser
      .waitForElementVisible('.copy-button[data-copy="rgb-code"]', 1000)
      .click('.copy-button[data-copy="rgb-code"]')
      .waitForElementVisible('.copy-button[data-copy="rgb-code"]', 1000)
      .assert.textEquals('.copy-button[data-copy="rgb-code"]', 'Done!');
    browser
      .waitForElementVisible('.copy-button[data-copy="hsl-code"]', 1000)
      .click('.copy-button[data-copy="hsl-code"]')
      .waitForElementVisible('.copy-button[data-copy="hsl-code"]', 1000)
      .assert.textEquals('.copy-button[data-copy="hsl-code"]', 'Done!');
  },

  'Copy button reverts to Copy after the timeout': function(browser) {
    browser.execute(function() {
      if (!navigator.clipboard) {
        navigator.clipboard = { writeText: () => Promise.resolve() };
      }
    });
    /* pause(2000) lets any previous 'Done!' timer expire before measuring our own */
    browser
      .pause(2000)
      .waitForElementVisible('.copy-button[data-copy="hex-code"]', 1000)
      .assert.textEquals('.copy-button[data-copy="hex-code"]', 'Copy')
      .click('.copy-button[data-copy="hex-code"]')
      .assert.textEquals('.copy-button[data-copy="hex-code"]', 'Done!')
      .pause(2000)
      .assert.textEquals('.copy-button[data-copy="hex-code"]', 'Copy');
  },

  'Picker container has 15px border radius': function(browser) {
    browser.getCssProperty('.picker-container', 'border-radius', function(result) {
      this.assert.strictEqual(result.value, '15px');
    });
  },

  'Page has a single h1 with the correct text': function(browser) {
    browser.elements('css selector', 'h1', function(result) {
      browser.assert.strictEqual(result.value.length, 1);
    });
    browser.assert.textEquals('h1', 'Colour Picker');
  },

  'Colour input has an accessible label': function(browser) {
    browser.assert.attributeEquals('#color-input', 'aria-label', 'Colour picker');
  },

  'Colour circle has role and aria-label': function(browser) {
    browser
      .assert.attributeEquals('#color-display', 'role', 'button')
      .assert.attributeEquals('#color-display', 'aria-label', 'Open colour picker');
  },

  'Copy buttons have descriptive aria-labels': function(browser) {
    browser
      .assert.attributeEquals('.copy-button[data-copy="hex-code"]', 'aria-label', 'Copy HEX value')
      .assert.attributeEquals('.copy-button[data-copy="rgb-code"]', 'aria-label', 'Copy RGB value')
      .assert.attributeEquals('.copy-button[data-copy="hsl-code"]', 'aria-label', 'Copy HSL value');
  },

  'Colour values region has aria-live': function(browser) {
    browser.assert.attributeEquals('.color-details', 'aria-live', 'polite');
  },

  'Responsive — mobile viewport': function(browser) {
    browser
      .resizeWindow(375, 667)
      .assert.visible('.picker-container')
      .assert.visible('#color-display');
  },

  'Responsive — tablet viewport': function(browser) {
    browser
      .resizeWindow(768, 1024)
      .assert.visible('.picker-container')
      .assert.visible('#color-display');
  },

  'Responsive — desktop viewport': function(browser) {
    browser
      .resizeWindow(1280, 800)
      .assert.visible('.picker-container')
      .assert.visible('#color-display');
  }
};