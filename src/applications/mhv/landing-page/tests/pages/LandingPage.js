import { defaultUser, cernerUser } from '../../api/mocks/user';
// import Timeouts from 'platform/testing/e2e/timeouts'; // { timeout: Timeouts.slow }

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
    // const redirectUrl = 'https://pint.eauth.va.gov/mhv-portal-web/eauth';
    const redirectUrl = 'https://mhv-syst.myhealth.va.gov/mhv-portal-web/*';
    cy.intercept('GET', redirectUrl, req => req.reply(200)).as('redirect');
    cy.on('url:changed', url => {
      if (!url.includes(redirectUrl)) return;
      expect(url).to.include(redirectUrl);
    });
  };

  visitPage = ({ user = defaultUser } = {}) => {
    cy.login(user);
    cy.visit(this.pageUrl);
  };

  visitPageAsCernerPatient = () => this.visitPage({ user: cernerUser });
}

export default new LandingPage();
