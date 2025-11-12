import manifest from '../manifest.json';

describe(manifest.appName, () => {
  it('is accessible', () => {
    // Skip tests in CI until the app is released.
    cy.skip();
  });
});
