import Timeouts from 'platform/testing/e2e/timeouts';
import { generateMockUser } from './mocks/user';

const selectors = {
  menu: '#login-root button[aria-controls="account-menu"]',
  signOut: '#account-menu ul li:nth-child(6) a',
};

describe('User Nav Test', () => {
  ['sis', 'iam'].forEach(authBroker => {
    it(`Displays the proper elements on the nav (${authBroker})`, () => {
      const mockUser = generateMockUser({ authBroker });
      cy.login(mockUser);
      cy.visit('/my-va');
      cy.title().should('contain', 'My VA | Veterans Affairs');
      cy.injectAxeThenAxeCheck();
      // Skip over an API call that results in a network error.
      Cypress.on('uncaught:exception', () => false);

      cy.get(selectors.menu, { timeout: Timeouts.slow })
        .should('be.visible')
        .then(dropDownMenu => {
          cy.wrap(dropDownMenu).click();
          cy.get(selectors.signOut, { timeout: Timeouts.slow })
            .should('be.visible')
            .and('contain', 'Sign Out')
            .then(signoutLink => {
              cy.wrap(signoutLink).click();
              cy.url().should(
                'match',
                /\/sessions\/slo\/new|\/my-va|\/sign_in\/logout|chrome-error:\/\/chromewebdata\//,
              );
            });
        });
    });
  });
});
