module.exports = {
  src_folders: ['tests/e2e'],
  filter: '**/*.cjs',
  plugins: [],
  test_settings: {
    default: {
      launch_url: 'http://localhost:3000',
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless=new', '--no-sandbox', '--disable-gpu']
        }
      },
      webdriver: {
        start_process: true,
        server_path: ''
      }
    },
    headed: {
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        start_process: true,
        server_path: ''
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['--headless']
        }
      },
      webdriver: {
        start_process: true,
        server_path: ''
      }
    }
  }
};