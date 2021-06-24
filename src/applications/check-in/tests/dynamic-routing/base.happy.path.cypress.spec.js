import features from '../mocks/enabled.json';
import mockCheckIn from '../../api/local-mock-api/mocks/check.in.response';
import mockValidate from '../../api/local-mock-api/mocks/validate.responses';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply(mockValidate.createMockSuccessResponse({}));
    });
    cy.intercept('POST', '/v0/patient_check_in', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
  });
  it('dynamic routing keeps token -- check in -- happy path', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');

    cy.get('[data-testid="no-button"]').click();
    cy.get('h1').contains('Your appointment');
    cy.url().should('contain', token);
    cy.url().should('contain', 'details');

    cy.get('.usa-button').click();
    cy.get('h1').contains('Thank you for checking in');
    cy.url().should('contain', token);
    cy.url().should('contain', 'confirmed');
  });
  it('dynamic routing keeps token -- check in', () => {
    const token = 'SOME-AWESOME-UUID';
    cy.visit(`/check-in/${token}`);
    cy.get('h1').contains('insurance');
    cy.url().should('contain', token);
    cy.url().should('contain', 'insurance');

    cy.get('[data-testid="yes-button"]').click();
    cy.get('h1').contains('staff member');
    cy.url().should('contain', token);
    cy.url().should('contain', 'failed');
  });
});
