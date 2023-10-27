import { AppointmentListPageObject } from './AppointmentListPageObject';

export class PendingAppointmentListPageObject extends AppointmentListPageObject {
  validate() {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);

    cy.findByText(/Pending appointments/i, { selector: 'h1' }).should('exist');
    return this;
  }

  visit() {
    super.visit('/pending');
    return this;
  }
}

export default new PendingAppointmentListPageObject();
