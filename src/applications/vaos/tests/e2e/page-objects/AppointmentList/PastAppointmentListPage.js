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
      .select(index, { waitForAnimations: true });

    return this;
  }

  validate() {
    cy.findByText(/Past appointments/i).should('be.ok');
    return this;
  }
}

export default new PastAppointmentListPage();
