/* eslint-disable camelcase */
// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
// import Timeouts from 'platform/testing/e2e/timeouts';

import {
  defaultUser,
  cernerUser,
  generateUserWithServiceProvider,
} from '../../api/mocks/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  unreadMessageIndicator = () => cy.get('[role="status"]');

  validatePageLoaded = () => {
    cy.get('h1')
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
  };

  validateURL = () => {
    cy.url().should('match', /my-health/);
  };

  validateRedirectHappened = () => {
    cy.url().should('not.include', '/my-health');
  };

  validateRedirectHappens = () => {
    const redirect = 'myhealth.va.gov/mhv-portal-web/home';
    cy.on('url:changed', url => {
      if (!url.includes(redirect)) return;
      expect(url).to.include(redirect);
    });
  };

  visitPage = ({ user = defaultUser, serviceProvider = 'idme' } = {}) => {
    cy.login(generateUserWithServiceProvider({ user, serviceProvider }));
    cy.visit(this.pageUrl);
  };

  visitPageAsCernerPatient = () => this.visitPage({ user: cernerUser });
}

export default new LandingPage();
