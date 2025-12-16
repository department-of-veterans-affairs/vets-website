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
    // Check if we're on the appointments page
    cy.findByRole('heading', { level: 1, name: 'Appointments' }).should(
      'exist',
    );

    // Click the "Review requests and referrals" link
    cy.findByTestId('review-requests-and-referrals')
      .should('exist')
      .click({ waitForAnimations: true });

    return this;
  }

  validateViewReferralsLink({ exist = true } = {}) {
    if (exist) {
      cy.findByTestId('review-requests-and-referrals').should('exist');
    } else {
      cy.findByTestId('review-requests-and-referrals').should('not.exist');
    }

    return this;
  }
}

export default new AppointmentListPageObject();
