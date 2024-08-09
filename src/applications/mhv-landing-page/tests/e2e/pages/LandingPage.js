import { generateUser } from '../../../mocks/api/user';
import responses from '../../../mocks/api';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  validatePageLoaded = () =>
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;

  loaded = () => this.validatePageLoaded();

  secondaryNav = () => cy.findByRole('navigation', { name: 'My HealtheVet' });

  secondaryNavRendered = () => this.secondaryNav().should.exist;

  validateURL = () => cy.url().should('match', /\/my-health\/$/);

  visitPage = ({
    verified = true,
    registered = true,
    mhvAccountState = 'OK',
    user,
  } = {}) => {
    this.initializeApi();
    let props = { mhvAccountState };
    if (!verified) props = { ...props, loa: 1 };
    if (!registered) props = { ...props, vaPatient: false };
    const userMock = user || generateUser(props);
    cy.login(userMock);
    cy.visit(this.pageUrl);
    this.loaded();
    this.validateURL();
  };

  visit = props => this.visitPage(props);

  initializeApi = () => {
    Object.entries(responses).forEach(([request, response]) => {
      // account for the difference in how mocker-api and cypress handle wildcards
      cy.intercept(
        request.endsWith('(.*)') ? request.replace('(.*)', '*') : request,
        response,
      );
    });
  };
}

export default new LandingPage();
