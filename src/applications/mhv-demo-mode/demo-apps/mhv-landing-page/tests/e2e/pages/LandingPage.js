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

  validateNonPatientURL = () =>
    cy.url().should('match', /\/my-health\/\?page=non-patient$/);

  visitPage = ({
    verified = true,
    registered = true,
    mhvAccountState = 'OK',
    serviceName = 'idme',
    edipi = null,
    user,
    isNonPatientPage = false,
  } = {}) => {
    let props = { mhvAccountState, serviceName, edipi, isNonPatientPage };
    if (!verified) props = { ...props, loa: 1 };
    if (!registered) props = { ...props, vaPatient: false };
    const userMock = user || generateUser(props);
    cy.login(userMock);
    cy.visit(this.pageUrl);
    this.loaded();
    if (isNonPatientPage) {
      this.validateNonPatientURL();
    } else {
      this.validateURL();
    }
  };

  visit = props => this.visitPage(props);

  visitNonPatientPage = props =>
    this.visitPage({
      registered: false,
      verified: true,
      isNonPatientPage: true,
      ...props,
    });

  initializeApi = () => {
    Object.entries(responses).forEach(([request, response]) => {
      // account for the difference in how mocker-api and cypress handle wildcards
      cy.intercept(
        request.endsWith('(.*)') ? request.replace('(.*)', '*') : request,
        response,
      );
    });
  };

  clickAddEmail = () => {
    cy.findByTestId('mhv-alert--add-contact-email')
      .find('va-link-action')
      .shadow()
      .find('a')
      .click();
  };

  clickSkipAddingEmail = () => {
    cy.findByTestId('mhv-alert--add-contact-email').within(() => {
      cy.get('va-button[secondary]')
        .shadow()
        .find('button')
        .click();
    });
  };

  clickConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-email-button').click();
  };

  clickErrorConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-email-button').click();
  };

  clickErrorEditEmailLink = () => {
    cy.findByTestId('mhv-alert--confirm-error')
      .find('va-link[href="/profile/contact-information#email-address"]')
      .shadow()
      .find('a')
      .click();
  };

  clickEditEmailLink = () => {
    cy.findByTestId('mhv-alert--confirm-contact-email')
      .find('va-link[href="/profile/contact-information#email-address"]')
      .shadow()
      .find('a')
      .click();
  };
}

export default new LandingPage();
