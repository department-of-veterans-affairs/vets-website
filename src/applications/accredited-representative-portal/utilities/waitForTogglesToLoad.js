// Waits for feature toggles to finish loading in the Redux store
export function waitForTogglesToLoad(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      const state = require('./store').default.getState();
      if (state.featureToggles && state.featureToggles.loading === false) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error('Timed out waiting for feature toggles to load'));
      } else {
        setTimeout(check, 50);
      }
    }
    check();
  });
}
