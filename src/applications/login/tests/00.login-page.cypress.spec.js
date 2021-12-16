const manifest = require('../manifest.json');
const environments = require('../../../site/constants/environments');

describe('Login Page', () => {
  it('Loads login page', () => {
    if (
      !(
        manifest.e2eTestsDisabled &&
        process.env.BUILDTYPE !== environments.LOCALHOST
      )
    ) {
      cy.visit('/login');
      cy.get('body').should('be.visible');
      cy.injectAxeThenAxeCheck();
    }
  });
});

// TODO: Remove this when CI builds temporary landing pages to run e2e tests
