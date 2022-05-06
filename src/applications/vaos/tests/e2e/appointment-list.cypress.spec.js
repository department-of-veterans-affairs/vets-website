import Timeouts from 'platform/testing/e2e/timeouts';
import {
  initAppointmentListMock,
  createPastVAAppointments,
  mockFeatureToggles,
} from './vaos-cypress-helpers';

describe('VAOS appointment list', () => {
  beforeEach(() => {
    initAppointmentListMock();
    mockFeatureToggles();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
  });

  describe('appointments details', () => {
    beforeEach(() => {
      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('[data-testid="vaosSelect"]').should('be.visible');
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
        .contains('VA appointment');
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
        .contains('VA appointment over the phone');
      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Cheyenne VA Medical Center');
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
      cy.findByTestId('cancel-appointment-SuccessModal').should('exist');
      cy.findByText(/Continue/i).click();
      cy.get('#cancelAppt').should('not.exist');
      cy.get('.usa-alert-success').should('not.exist');
      cy.get('.usa-alert-error').should('exist');
      cy.axeCheckBestPractice();
    });
  });

  describe('upcoming appointments', () => {
    it('should render upcoming appointments list', () => {
      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=upcoming-appointment-list]').should('exist');
      cy.get('[data-testid="vaosSelect"]').should('be.visible');
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
      cy.axeCheckBestPractice();
    });
  });

  describe('requested appointments', () => {
    beforeEach(() => {
      cy.get('h2', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
      cy.get('[data-cy=upcoming-appointment-list]').should('exist');
      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('requested')
        .should('have.value', 'requested');
      cy.get('h2').contains(/Requested/i);
    });

    it('should render requested appointments list', () => {
      cy.get('[data-cy=requested-appointment-list]').should('exist');
      cy.get('[data-cy=requested-appointment-list-item]')
        .first()
        .should('exist');
      cy.axeCheckBestPractice();
    });

    it('should navigate to requested appointment details', () => {
      cy.get('[data-cy=requested-appointment-list-item]')
        .first()
        .findByText(/Details/i)
        .click({ waitForAnimations: true });
      cy.findByText(/Request detail/i).should('exist');
      cy.axeCheckBestPractice();
    });
  });

  describe('past appointments', () => {
    beforeEach(() => {
      cy.route({
        method: 'GET',
        url: /.*\/v0\/appointments.*type=va$/,
        response: createPastVAAppointments(),
      });
      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('past')
        .should('have.value', 'past');
      cy.get('h2').contains(/Past appointments/i);
    });

    it('should render past appointments list', () => {
      cy.get('#date-dropdown')
        .shadow()
        .findByLabelText(/Select a date range/i)
        .should('exist');
      cy.get('[data-cy=past-appointment-list]').should('exist');
      cy.get('[data-cy=past-appointment-list-header]').should('exist');
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .should('exist');
      cy.axeCheckBestPractice();
    });

    it('should navigate to past appointment details', () => {
      cy.get('[data-cy=appointment-list-item]')
        .first()
        .findByText(/Details/i)
        .focus()
        .click({ waitForAnimations: true });
      cy.findByText(/Appointment detail/i).should('exist');
      cy.axeCheckBestPractice();
    });

    it('should select an updated date range', () => {
      cy.get('#date-dropdown')
        .shadow()
        .find('#select')
        .select('1')
        .should('have.value', '1');
      cy.get('button')
        .contains(/Update/i)
        .click();
      cy.get('h3').should('exist');
      cy.axeCheckBestPractice();
    });
  });

  describe('canceled appointments', () => {
    beforeEach(() => {
      cy.get('[data-testid="vaosSelect"]')
        .shadow()
        .find('#select')
        .select('canceled')
        .should('have.value', 'canceled');
      cy.get('h2').contains(/Canceled appointments/i);
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
        .focus()
        .click({ waitForAnimations: true });
      cy.findByText(/Appointment detail/i).should('exist');
      cy.axeCheckBestPractice();
    });
  });
});
