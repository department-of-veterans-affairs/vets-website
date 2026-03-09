import PageObject from '../PageObject';

export class AppointmentListPageObject extends PageObject {
  assertAppointmentList({ numberOfAppointments = 0 } = {}) {
    // Wait for appointments to load
    cy.wait(['@v2:get:appointments']);

    cy.findAllByTestId('appointment-list-item').should($li => {
      expect($li).to.have.length(numberOfAppointments);
    });

    return this;
  }

  assertNoAppointments({ exist = true } = {}) {
    cy.findByText(/You don.t have any upcoming appointments/i).should(
      exist ? 'exist' : 'not.exist',
    );

    return this;
  }

  selectListItem() {
    cy.findByTestId('appointment-list-item')
      .first()
      .should('exist')
      .click();

    return this;
  }

  navigateToReferralsAndRequests() {
    cy.visit('/my-health/appointments/referrals-requests');

    return this;
  }

  validateCCReferralsBanner({ exist = true } = {}) {
    if (exist) {
      cy.findByTestId('cc-referrals-banner').should('exist');
    } else {
      cy.findByTestId('cc-referrals-banner').should('not.exist');
    }

    return this;
  }
}

export default new AppointmentListPageObject();
