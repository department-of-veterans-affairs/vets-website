/* eslint-disable camelcase */
// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
import Timeouts from 'platform/testing/e2e/timeouts';

import MockUser from '../../api/mocks/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  unreadMessageIndicator = () =>
    cy.get('[role="status"]', { timeout: Timeouts.slow });

  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
  };

  validateURL = () => {
    cy.url().should('match', /my-health/);
  };

  validateRedirectHappened = () => {
    cy.on('url:changed', url => {
      if (url.startsWith('http://localhost')) return;
      expect(url).to.contain('.va.gov/mhv-portal-web');
    });
  };

  visitPage = ({ serviceProvider = 'idme' } = {}) => {
    cy.login(MockUser.generateUserWithServiceProvider({ serviceProvider }));
    cy.visit(this.pageUrl);
  };

  visitPageAsCernerPatient = () => {
    cy.login(MockUser.cernerUser);
    cy.visit(this.pageUrl);
  };
}

export default new LandingPage();
