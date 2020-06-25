import { initAppointmentListMock } from './vaos-cypress-helpers';

describe('Appointment List', () => {
  beforeEach(() => {
    initAppointmentListMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.get('.va-modal-body button').click();
  });

  it('should render appointments list', () => {
    cy.get('#appointments-list').should('exist');
  });

  it('should allow for cancelling of appointments', () => {
    cy.get('li[data-is-cancelable="true"] button.vaos-appts__cancel-btn')
      .first()
      .click();
    cy.get('#cancelAppt .usa-button').click();
    cy.get('.usa-alert-success').should('exist');
    cy.get('#cancelAppt button:not([disabled])')
      .first()
      .click();
    cy.get('#cancelAppt').should('not.exist');
  });

  it('should show more info for appointments', () => {
    cy.get(
      'li[data-request-id="8a48912a6cab0202016cb4fcaa8b0038"] .additional-info-button.va-button-link',
    ).click();
    cy.get('[id="8a48912a6cab0202016cb4fcaa8b0038-vaos-info-content"]');
    cy.contains('Request 2 Message 1 Text');
  });
});
