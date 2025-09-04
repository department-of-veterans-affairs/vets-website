let touched = false;

Cypress.on(
  'window:before:load',
  /** @param {Cypress.AUTWindow} win */
  win => {
    if (typeof win.fetch === 'function') {
      const orig = win.fetch.bind(win);
      const wrapped = (...a) => {
        touched = true;
        return orig(...a);
      };

      Reflect.defineProperty(win, 'fetch', {
        value: wrapped,
        configurable: true,
        writable: true,
      });
    }

    const XHR = win.XMLHttpRequest;
    if (XHR?.prototype?.open) {
      const origOpen = XHR.prototype.open;
      XHR.prototype.open = function patchedXHROpen(...args) {
        touched = true;
        return origOpen.apply(this, args);
      };
    }

    const n = win.navigator;
    if (typeof n?.sendBeacon === 'function') {
      const origSB = n.sendBeacon.bind(n);
      const wrappedSB = (...a) => {
        touched = true;
        return origSB(...a);
      };

      Reflect.defineProperty(n, 'sendBeacon', {
        value: wrappedSB,
        configurable: true,
        writable: true,
      });
    }
  },
);

afterEach(() => {
  if (touched) {
    cy.task('recordNetworkTouch', Cypress.spec.absolute, { log: false });
    touched = false;
  }
});

Cypress.on('window:before:load', win => {
  // eslint-disable-next-line no-param-reassign
  win.__annotator__ = {
    wrapped: true,
    getTouched: () => touched,
    mark: () => {
      touched = true;
    },
  };
});
