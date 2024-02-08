import { AppointmentListPageObject } from './AppointmentListPageObject';

export class PastAppointmentListPageObject extends AppointmentListPageObject {
  assertAppointmentList({ numberOfAppointments = 0 } = {}) {
    super.assertAppointmentList({ numberOfAppointments });

    cy.findByText(/Past appointments/i, { selector: 'h1' }).should('exist');
    return this;
  }

  selectDateRange(value) {
    cy.findByTestId('vaosSelect')
      .shadow()
      .as('vaosSelect');
    cy.get('@vaosSelect')
      .find('select')
      .should('exist')
      .should('be.enabled')
      .as('select');
    cy.get('@select').select(value);

    // Wait for appointments to load
    cy.wait('@v2:get:appointments');

    return this;
  }

  visit() {
    super.visit('/past');
    return this;
  }
}

export default new PastAppointmentListPageObject();
