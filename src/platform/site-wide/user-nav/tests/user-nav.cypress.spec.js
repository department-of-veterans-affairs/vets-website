import Timeouts from 'platform/testing/e2e/timeouts';

const selectors = {
  menu: '#login-root button[aria-controls="account-menu"]',
  signOut: '#account-menu ul li:nth-child(4) a',
};

describe('User Nav Test', () => {
  it('Displays the proper elements on the nav', () => {
    cy.login();
    cy.visit('/my-va');
    cy.title().should('contain', 'My VA | Veterans Affairs');
    Cypress.on('uncaught:exception', () => {
      return false;
      // expect(err.message).to.include('Network request failed');
      // As Cypress does not permit cross browser testing in the same spec, we expect a network error when making a network request that travels cross-origin.
    });

    cy.get(selectors.menu, { timeout: Timeouts.slow })
      .should('be.visible')
      .then(dropDownMenu => {
        cy.wrap(dropDownMenu).click();
        cy.get(selectors.signOut, { timeout: Timeouts.slow })
          .should('be.visible')
          .and('contain', 'Sign Out')
          .then(signOutButton => {
            cy.wrap(signOutButton).click();
            cy.url().should(
              'match',
              /\/sessions\/slo\/new|chrome-error:\/\/chromewebdata\//,
            );
            // As Cypress does not permit cross browser testing in the same spec, we expect after the attempt at browsing, that we will receive a chrome error.
          });
      });
  });
});
