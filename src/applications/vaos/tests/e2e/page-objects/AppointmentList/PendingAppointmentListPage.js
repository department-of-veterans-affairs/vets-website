import { AppointmentListPage } from './AppointmentListPage';

export class PendingAppointmentListPage extends AppointmentListPage {
  visit() {
    super.visit('/pending');
    return this;
  }

  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);

    cy.findByText(/Pending appointments/i, { selector: 'h1' }).should('exist');
    return this;
  }
}

export default new PendingAppointmentListPage();
