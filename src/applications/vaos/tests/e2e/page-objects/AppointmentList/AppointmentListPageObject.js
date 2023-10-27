import PageObject from '../PageObject';

export class AppointmentListPageObject extends PageObject {
  scheduleAppointment() {
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
    return this;
  }

  selectListItem() {
    cy.findByTestId('appointment-list-item')
      .first()
      .click({ waitForAnimations: true });

    // cy.axeCheckBestPractice();

    return this;
  }

  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);

    cy.get('h2')
      .should('be.visible')
      .and('contain', 'Appointments');

    cy.findByText(/You don.t have any upcoming appointments/i).should(
      'not.exist',
    );

    cy.axeCheckBestPractice();

    return this;
  }
}

export default new AppointmentListPageObject();
