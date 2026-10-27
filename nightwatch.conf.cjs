/* Lets a container point Nightwatch at the Chrome build and driver it already has */
const chromeBinary = process.env.CHROME_BINARY ? { binary: process.env.CHROME_BINARY } : {};
const chromeDriver = { start_process: true, server_path: process.env.CHROMEDRIVER_PATH || '' };

module.exports = {
  src_folders: ['tests/e2e/specs'],
  page_objects_path: ['tests/e2e/page-objects'],
  globals_path: 'tests/e2e/globals.cjs',
  filter: '**/*.cjs',
  plugins: [],

  /* Every test reports, rather than the rest of a file being skipped after its first failure */
  skip_testcases_on_fail: false,

  test_settings: {
    default: {
      launch_url: 'http://localhost:3500',
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: 'tests_output/screenshots'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': { ...chromeBinary }
      },
      webdriver: chromeDriver
    },

    /* Adds the headless flags to the default settings, which open a visible window */
    chrome: {
      desiredCapabilities: {
        'goog:chromeOptions': {
          args: ['--headless=new', '--no-sandbox', '--disable-gpu', '--window-size=1280,800']
        }
      }
    },

    firefox: {
      skiptags: ['chrome-only'],
      desiredCapabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['--headless', '--width=1280', '--height=800']
        }
      },
      webdriver: {
        start_process: true,
        server_path: ''
      }
    }
  }
};