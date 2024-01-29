/* eslint-disable camelcase */
// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
import Timeouts from 'platform/testing/e2e/timeouts';

import { cernerUser, generateUser } from '../../../mocks/api/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  unreadMessageIndicator = () =>
    cy.get('[aria-label="You have unread messages. Go to your inbox."]', {
      timeout: Timeouts.slow,
    });

  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
  };

  validateURL = () => {
    cy.url().should('match', /my-health/);
  };

  validateRedirectHappened = () => {
    cy.url().should('not.match', /my-health/);
  };

  visitPage = ({ serviceProvider = 'idme', facilities, loa = 3 } = {}) => {
    cy.login(generateUser({ serviceProvider, facilities, loa }));
    cy.visit(this.pageUrl);
  };

  visitPageAsCernerPatient = () => {
    cy.login(cernerUser);
    cy.visit(this.pageUrl);
  };
}

export default new LandingPage();
