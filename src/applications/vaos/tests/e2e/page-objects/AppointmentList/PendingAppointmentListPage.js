import { AppointmentListPage } from './AppointmentListPage';

export class PendingAppointmentListPage extends AppointmentListPage {
  visit() {
    super.visit('/pending');
    return this;
  }

  validate() {
    cy.findByText(/Pending appointments/i).should('be.ok');
    return this;
  }
}

export default new PendingAppointmentListPage();
