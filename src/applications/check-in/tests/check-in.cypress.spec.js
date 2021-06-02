import manifest from '../manifest.json';

describe('Check In Experience --', () => {
  it('is accessible', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();
  });
});
