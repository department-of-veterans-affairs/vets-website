import { AppointmentListPage } from './AppointmentListPage';

export class PastAppointmentListPage extends AppointmentListPage {
  visit() {
    super.visit('/past');
    return this;
  }

  selectDateRange(index) {
    cy.findByTestId('vaosSelect')
      .shadow()
      .find('#select')
      .select(index);

    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);

    return this;
  }

  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);
    cy.findByText(/Past appointments/i).should('be.ok');

    return this;
  }
}

export default new PastAppointmentListPage();
