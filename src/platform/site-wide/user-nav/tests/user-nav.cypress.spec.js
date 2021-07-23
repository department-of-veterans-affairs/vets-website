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
    cy.get(selectors.menu, { timeout: Timeouts.slow })
      .should('be.visible')
      .then(dropDownMenu => {
        cy.wrap(dropDownMenu).click();
        cy.get(selectors.signOut, { timeout: Timeouts.slow })
          .should('be.visible')
          .and('contain', 'Sign Out')
          .then(signOutButton => {
            cy.wrap(signOutButton).click();
            cy.url().should('contain', '/sessions/slo/new');
          });
      });
  });
});
