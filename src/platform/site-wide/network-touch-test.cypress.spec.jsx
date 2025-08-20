// src/applications/_debug/tests/network-touch.cypress.spec.js
describe('network-touch smoke (XHR)', () => {
  it('forces a real XHR', () => {
    cy.visit('/'); // or 'about:blank' if your app isn’t up
    cy.window().then(win => {
      const xhr = new win.XMLHttpRequest();
      xhr.open('GET', 'https://httpbin.org/status/204'); // any cross-origin URL
      try {
        xhr.send();
      } catch (e) {
        /* ignore CORS errors */
      }
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250); // give it a tick to fire
  });
});
