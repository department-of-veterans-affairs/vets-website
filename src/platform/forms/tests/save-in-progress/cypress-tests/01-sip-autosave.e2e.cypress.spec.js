import {
  mockEnrollmentStatus,
  mockInitSaveInProgress,
  mockSaveInProgress,
} from './helpers';

describe('HCA Form', () => {
  before(() => {
    cy.server();

    cy.login();

    cy.route(
      'GET',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    );

    cy.route('GET', '/v0/in_progress_forms/1010ez', mockInitSaveInProgress);

    cy.route('PUT', '/v0/in_progress_forms/1010ez', mockSaveInProgress);
  });

  it('loads application and autosaves', () => {
    cy.visit('health-care/apply/application')
      .injectAxe()
      .axeCheck();

    cy.title().should('eq', 'Apply for Health Care | Veterans Affairs');

    cy.findAllByText('Continue your application', {
      selector: 'button',
    })
      .first()
      .click();

    cy.axeCheck()
      .url()
      .should('include', '/veteran-information/birth-information');

    cy.findByLabelText(/Social Security number/i).should(
      'have.value',
      '123445544',
    );

    cy.findByLabelText(/City/i).type('Northampton');
    cy.findByLabelText(/State/i).select('MA');
    cy.findByText(/Application has been saved./i).should('exist');

    cy.route({
      method: 'PUT',
      url: '/v0/in_progress_forms/1010ez',
      status: 500,
      response: {},
    });

    cy.findByLabelText(/City/i).type('Amherst');
    cy.findByLabelText(/State/i)
      .select('MA')
      .get('.usa-alert')
      .should('exist')
      .should(
        'include.text',
        'We’re sorry, but we’re having some issues and are working to fix them',
      );

    cy.route('PUT', '/v0/in_progress_forms/1010ez', mockSaveInProgress);

    cy.findByLabelText(/City/i).type('Florence');
    cy.findByLabelText(/State/i).select('MA');
    cy.findByText(/Application has been saved./i).should('exist');

    cy.route({
      method: 'PUT',
      url: '/v0/in_progress_forms/1010ez',
      status: 401,
      response: {},
    });

    cy.findByLabelText(/City/i).type('Amherst');
    cy.findByLabelText(/State/i)
      .select('MA')
      .get('.usa-alert')
      .should('exist')
      .should('include.text', 'Sorry, you’re no longer signed in');
  });
});
