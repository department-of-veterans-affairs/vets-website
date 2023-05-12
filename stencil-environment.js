const { JSDOM } = require('jsdom');
const NodeEnvironment = require('jest-environment-node');

class StencilEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    const historyMock = {
      length: 0,
      state: null,
      go: () => {},
      back: () => {},
      forward: () => {},
      pushState: () => {},
      replaceState: () => {},
    };

    const dom = new JSDOM('<!DOCTYPE html>', {
      url: 'http://localhost/',
    });

    global.window = dom.window;
    global.document = dom.window.document;

    Object.defineProperty(global.window, 'history', {
      get: () => historyMock,
      configurable: true,
      enumerable: true,
    });
  }

  async teardown() {
    delete global.window;
    delete global.document;

    await super.teardown();
  }
}

module.exports = StencilEnvironment;
