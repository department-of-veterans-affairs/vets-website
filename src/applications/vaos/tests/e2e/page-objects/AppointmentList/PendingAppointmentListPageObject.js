import { AppointmentListPageObject } from './AppointmentListPageObject';

export class PendingAppointmentListPageObject extends AppointmentListPageObject {
  assertAppointmentList({ numberOfAppointments = 0 } = {}) {
    super.assertAppointmentList({ numberOfAppointments });

    cy.findByText(/Pending appointments/i, { selector: 'h1' }).should('exist');
    return this;
  }

  visit() {
    super.visit('/pending');
    return this;
  }
}

export default new PendingAppointmentListPageObject();
