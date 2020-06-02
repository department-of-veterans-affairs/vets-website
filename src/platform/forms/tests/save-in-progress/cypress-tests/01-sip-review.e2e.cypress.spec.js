import {
  mockEnrollmentStatus,
  mockInitSaveInProgress,
  mockSaveInProgress,
} from './helpers';

describe('HCA Form', () => {
  beforeEach(() => {
    cy.server();

    cy.login();

    cy.route(
      'GET',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    );

    cy.route('GET', '/v0/in_progress_forms/1010ez', mockInitSaveInProgress);
  });

  it('edits and saves form for later', () => {
    cy.route('PUT', '/v0/in_progress_forms/1010ez', mockSaveInProgress);

    cy.visit('health-care/apply/application/review-and-submit?skip')
      .injectAxe()
      .axeCheck();

    cy.title().should('eq', 'Apply for Health Care | Veterans Affairs');

    cy.findByText('Veteran Information').click();

    cy.findAllByText('Edit')
      .first()
      .click();

    cy.findByLabelText(/First Name/i).type('Jane');

    cy.findByText(/Application has been saved./i).should('exist');
    cy.findByText('Finish this application later')
      .click()
      .url()
      .should('include', 'form-saved');
  });

  it('shows server error when saving for later', () => {
    cy.route({
      method: 'PUT',
      url: '/v0/in_progress_forms/1010ez',
      status: 500,
      response: {},
    });

    cy.visit('health-care/apply/application/review-and-submit?skip')
      .injectAxe()
      .axeCheck();

    cy.title().should('eq', 'Apply for Health Care | Veterans Affairs');

    cy.findByText('Finish this application later')
      .click()
      .url()
      .should('include', 'review-and-submit');

    cy.findByText(
      /We’re sorry. Something went wrong when saving your form/i,
    ).should('exist');
  });
});
