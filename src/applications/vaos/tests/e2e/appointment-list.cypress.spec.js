import {
  initAppointmentListMock,
  createPastVAAppointments,
  mockFeatureToggles,
} from './vaos-cypress-helpers';

describe('VAOS appointment list', () => {
  beforeEach(() => {
    initAppointmentListMock();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.get('.va-modal-body button').click();
    cy.injectAxe();
  });

  it('should render appointments list', () => {
    cy.get('#appointments-list').should('exist');
    cy.axeCheckBestPractice();
  });

  it('should allow for cancelling of appointments', () => {
    cy.get('li[data-is-cancelable="true"] button.vaos-appts__cancel-btn')
      .first()
      .click();
    cy.get('#cancelAppt .usa-button').click();
    cy.get('.usa-alert-success').should('exist');
    cy.get('#cancelAppt button:not([disabled])')
      .first()
      .click();
    cy.get('#cancelAppt').should('not.exist');
    cy.axeCheckBestPractice();
  });

  it('should show more info for appointments', () => {
    cy.get(
      'li[data-request-id="8a48912a6cab0202016cb4fcaa8b0038"] .additional-info-button.va-button-link',
    ).click();
    cy.get('[id="8a48912a6cab0202016cb4fcaa8b0038-vaos-info-content"]');
    cy.contains('Request 2 Message 1 Text');
    cy.axeCheckBestPractice();
  });

  it('should render past appointments', () => {
    cy.route({
      method: 'GET',
      url: /.*\/v0\/appointments.*type=va$/,
      response: createPastVAAppointments(),
    });
    cy.get('#tabpast').click();
    cy.findByText(/three day clinic name/i).should('exist');
    cy.findByLabelText(/select a date range/i).select('1');
    cy.findByText('Update').click();
    cy.findByText(/four month clinic name/i).should('exist');
    cy.get('#queryResultLabel').should('have.focus');
    cy.axeCheckBestPractice();
  });
});

describe('VAOS appointment list refresh', () => {
  beforeEach(() => {
    initAppointmentListMock();
    mockFeatureToggles({ homepageRefresh: true });
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
  });

  describe('appointments details', () => {
    beforeEach(() => {
      cy.findByText(/Your appointments/i).should('exist');
      cy.get('#type-dropdown').should('exist');
    });

    it('community care appointment', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/Community Care/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/cc');
      cy.get('[data-cy=community-care-appointment-details-header]')
        .should('exist')
        .contains('Community care');
      cy.axeCheckBestPractice();
    });

    it('va appointment', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA CLinic/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-appointment-details-header]')
        .should('exist')
        .contains('VA Appointment');
      cy.axeCheckBestPractice();
    });

    it('va phone appointment', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/Phone call/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-appointment-details-header]')
        .should('exist')
        .contains('VA Appointment over the phone');
      cy.axeCheckBestPractice();
    });

    it('express care appointment', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/Express Care request/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/express-care');
      cy.get('[data-cy=express-care-appointment-details-header]')
        .should('exist')
        .contains('Express Care request');
      cy.axeCheckBestPractice();
    });

    it('va video appointment', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Video Connect at a VA Location/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-video-appointment-details-header]')
        .should('exist')
        .contains('VA Video Connect at VA location');
      cy.axeCheckBestPractice();
    });

    it('va video appointment at an ATLAS location', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Video Connect at an ATLAS Location/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-video-appointment-details-header]')
        .should('exist')
        .contains('VA Video Connect at an ATLAS location');
      cy.axeCheckBestPractice();
    });

    it('va video appointment at home', () => {
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA Video Connect at home/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.url().should('include', '/appointments/va');
      cy.get('[data-cy=va-video-appointment-details-header]')
        .should('exist')
        .contains('VA Video Connect at home');
      cy.axeCheckBestPractice();
    });

    it('should allow for canceling of appointments', () => {
      cy.get('[data-cy=appointment-list-item]')
        .contains(/VA CLinic/i)
        .parent()
        .findByText(/Details/i)
        .click();
      cy.findByText(/Appointment detail/i).should('exist');
      cy.findByText(/Cancel appointment/i).click();
      cy.findByText(/Yes, cancel this appointment/i).click();
      cy.get('.usa-alert-success').should('exist');
      cy.findByText(/Continue/i).click();
      cy.get('#cancelAppt').should('not.exist');
      cy.get('.usa-alert-success').should('not.exist');
      cy.get('.usa-alert-error').should('exist');
    });
  });

  describe('upcoming appointments', () => {
    it('should render upcoming appointments list', () => {
      cy.findByText(/Your appointments/i).should('exist');
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=upcoming-appointment-list]').should('exist');
      cy.get('#type-dropdown').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');
      cy.axeCheckBestPractice();
    });

    it('should navigate to upcoming appointment details', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .findByText(/Details/i)
        .click();
      cy.findByText(/Appointment detail/i).should('exist');
    });
  });

  describe('requested appointments', () => {
    beforeEach(() => {
      cy.findByText(/Your appointments/i).should('exist');
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=upcoming-appointment-list]').should('exist');
      cy.get('#type-dropdown')
        .select('requested')
        .should('have.value', 'requested');
    });

    it('should render requested appointments list', () => {
      cy.get('[data-cy=requested-appointment-list]').should('exist');
      cy.get('[data-cy=requested-appointment-list-item]')
        .first()
        .should('exist');
    });

    it('should navigate to requested appointment details', () => {
      cy.get('[data-cy=requested-appointment-list-item]')
        .first()
        .findByText(/Details/i)
        .click();
      cy.findByText(/Request detail/i).should('exist');
    });
  });

  describe('past appointments', () => {
    beforeEach(() => {
      cy.get('#type-dropdown')
        .select('past')
        .should('have.value', 'past');
    });

    it('should render past appointments list', () => {
      cy.findByLabelText(/Select a date range/i).should('exist');
      cy.get('[data-cy=past-appointment-list]').should('exist');
      cy.get('[data-cy=past-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');
      cy.axeCheckBestPractice();
    });

    it('should navigate to requested appointment details', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .findByText(/Details/i)
        .click();
      cy.findByText(/Request detail/i).should('exist');
    });

    /**
     *  0 = Past 3 months
     *  1 = Nov. YYYY - Jan. YYYY
     *  2 = Aug. YYYY - Oct. YYYY
     *  3 = May YYYY - July YYYY
     *  4 = All of YYYY (current year)
     *  5 = All of YYYY (previous year)
     */
    describe('date range selector', () => {
      it('should select November through January', () => {
        cy.get('select')
          .eq(1)
          .select('1')
          .should('have.value', '1');
        cy.get('button')
          .contains(/Update/i)
          .click();
        cy.axeCheckBestPractice();
      });

      it('should select August through October', () => {
        cy.get('select')
          .eq(1)
          .select('2')
          .should('have.value', '2');
        cy.get('button')
          .contains(/Update/i)
          .click();
        cy.axeCheckBestPractice();
      });

      it('should select May through July', () => {
        cy.get('select')
          .eq(1)
          .select('3')
          .should('have.value', '3');
        cy.get('button')
          .contains(/Update/i)
          .click();
        cy.axeCheckBestPractice();
      });

      it('should select all of current year', () => {
        cy.get('select')
          .eq(1)
          .select('4')
          .should('have.value', '4');
        cy.get('button')
          .contains(/Update/i)
          .click();
        cy.axeCheckBestPractice();
      });

      it('should select all of previous year', () => {
        cy.get('select')
          .eq(1)
          .select('5')
          .should('have.value', '5');
        cy.get('button')
          .contains(/Update/i)
          .click();
        cy.axeCheckBestPractice();
      });
    });
  });

  describe('canceled appointments', () => {
    beforeEach(() => {
      cy.get('#type-dropdown')
        .select('canceled')
        .should('have.value', 'canceled');
    });
    it('should render canceled appointments list', () => {
      cy.get('[data-cy=canceled-appointment-list-header]').should('exist');
      cy.get('[data-cy=canceled-appointment-list]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');
      cy.axeCheckBestPractice();
    });

    it('should navigate to canceled appointment details', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .findByText(/Details/i)
        .click();
      cy.findByText(/Appointment detail/i).should('exist');
    });
  });
});
