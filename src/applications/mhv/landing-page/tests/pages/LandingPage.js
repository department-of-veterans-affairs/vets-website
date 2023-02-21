// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
import Timeouts from 'platform/testing/e2e/timeouts';

import MockUser from '../../mocks/api/user';

class LandingPage {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'My Health');
  };

  validateURL = () => {
    cy.url().should('match', /my-health/);
  };

  visitPage = () => {
    cy.login(MockUser.defaultUser);
    cy.visit('/my-health');
  };
}

export default new LandingPage();
