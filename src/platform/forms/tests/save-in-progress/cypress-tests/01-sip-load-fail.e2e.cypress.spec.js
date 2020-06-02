import { mockEnrollmentStatus } from './helpers';

describe('HCA form', () => {
  beforeEach(() => {
    cy.server();

    cy.login();

    cy.route(
      'GET',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    );

    cy.visit('health-care/apply/application')
      .injectAxe()
      .axeCheck();

    cy.title().should('eq', 'Apply for Health Care | Veterans Affairs');
  });

  it('fails to load a form in progress', () => {
    cy.route({
      method: 'GET',
      url: '/v0/in_progress_forms/1010ez',
      status: 500,
      response: {},
    });

    cy.findAllByText('Continue your application', {
      selector: 'button',
    })
      .first()
      .click();

    cy.axeCheck()
      .url()
      .should('not.include', '/introduction')
      .get('.usa-alert')
      .should('exist')
      .should('include.text', 'We’re sorry. We’re having some server issues');
  });

  it('fails to find a form in progress', () => {
    cy.route({
      method: 'GET',
      url: '/v0/in_progress_forms/1010ez',
      status: 404,
      response: {},
    });

    cy.findAllByText('Continue your application', {
      selector: 'button',
    })
      .first()
      .click();

    cy.axeCheck()
      .url()
      .should('not.include', '/introduction')
      .get('.usa-alert')
      .should('exist')
      .should(
        'include.text',
        'Something went wrong when we tried to find your application',
      );
  });

  it('fails to load a form when signed out', () => {
    cy.route({
      method: 'GET',
      url: '/v0/in_progress_forms/1010ez',
      status: 401,
      response: {},
    });

    cy.findAllByText('Continue your application', {
      selector: 'button',
    })
      .first()
      .click();

    cy.axeCheck()
      .url()
      .should('not.include', '/introduction')
      .get('.usa-alert')
      .should('exist')
      .should('include.text', 'You’re signed out of your account');
  });
});
