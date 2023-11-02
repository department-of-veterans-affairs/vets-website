import PageObject from '../PageObject';

export class AppointmentListPageObject extends PageObject {
  scheduleAppointment() {
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
    return this;
  }

  selectListItem() {
    // get the first appointment list item
    cy.get(
      '[data-testid="appointment-list-item"] > :nth-child(1) > :nth-child(1) > :nth-child(1)',
    )
      .should('exist')
      .click();

    // cy.axeCheckBestPractice();

    return this;
  }

  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);
    // get the header month
    cy.get('[data-testid="appointment-list-header"]')
      .should('be.visible')
      .and('contain', 'Appointments in');

    cy.findByText(/You don.t have any upcoming appointments/i).should(
      'not.exist',
    );

    cy.axeCheckBestPractice();

    return this;
  }
}

export default new AppointmentListPageObject();
