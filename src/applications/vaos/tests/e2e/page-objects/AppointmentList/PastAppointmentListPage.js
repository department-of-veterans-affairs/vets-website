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
      .should('be.enabled')
      .select(index);

    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);

    return this;
  }

  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);
    cy.findByText(/Past appointments/i, { selector: 'h1' }).should('exist');

    return this;
  }
}

export default new PastAppointmentListPage();
