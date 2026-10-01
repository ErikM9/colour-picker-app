const { spawn } = require('node:child_process');
const http = require('node:http');

/* A port of its own keeps the suite away from a dev server left running on 3000 */
const PORT = 3500;

let server;

const isUp = () => new Promise((resolve) => {
  http.get(`http://localhost:${PORT}/`, (response) => {
    response.resume();
    resolve(response.statusCode === 200);
  }).on('error', () => resolve(false));
});

module.exports = {
  retryAssertionTimeout: 3000,

  /* The suite serves the app itself, so nothing has to be started by hand before a run */
  async before() {
    server = spawn('node', ['node_modules/http-server/bin/http-server', 'src', '-p', String(PORT), '-c-1', '-s'], {
      stdio: 'ignore'
    });

    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await isUp()) return;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    throw new Error(`The static server never came up on port ${PORT}`);
  },

  async after() {
    server?.kill();
  }
};