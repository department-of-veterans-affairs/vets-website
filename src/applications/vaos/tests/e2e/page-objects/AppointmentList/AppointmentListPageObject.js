import PageObject from '../PageObject';

export class AppointmentListPageObject extends PageObject {
  scheduleAppointment() {
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
    return this;
  }

  selectListItem() {
    cy.findByTestId('appointment-list-item')
      .first()
      .should('exist')
      .click();

    // cy.axeCheckBestPractice();

    return this;
  }

  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);
    // find each header month
    cy.findAllByTestId('appointment-list-header').each(item => {
      // Assert the text using the .wrap() command
      cy.wrap(item).should('contain.text', 'Appointments in');
    });

    cy.findByText(/You don.t have any upcoming appointments/i).should(
      'not.exist',
    );

    cy.axeCheckBestPractice();

    return this;
  }
}

export default new AppointmentListPageObject();
