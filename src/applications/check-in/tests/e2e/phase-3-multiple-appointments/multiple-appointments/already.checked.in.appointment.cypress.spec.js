import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/v2/check.in.responses';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/v2/patient.check.in.responses';

import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
      cy.intercept('GET', '/check_in/v2/patient_check_ins/*', req => {
        const rv = mockPatientCheckIns.createMultipleAppointments();
        const already = mockPatientCheckIns.createAppointment();
        already.startTime = '2021-08-19T03:00:00';
        already.eligibility = 'INELIGIBLE_ALREADY_CHECKED_IN';
        const next = mockPatientCheckIns.createAppointment();
        next.startTime = '2021-08-19T13:00:00';

        rv.payload.appointments = [already, next];
        req.reply(rv);
      });
      cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
        req.reply(mockCheckIn.createMockSuccessResponse({}));
      });
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceLowAuthenticationEnabled: true,
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointments are displayed in a sorted manner', () => {
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);
      cy.get('h1').contains('Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('[label="Your last name"]')
        .shadow()
        .find('input')
        .type('Smith');
      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('input')
        .type('4837');
      cy.get('[data-testid=check-in-button]').click();
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
      cy.get('.appointment-list > li').should('have.length', 2);
      cy.injectAxe();
      cy.axeCheck();
      cy.get(
        ':nth-child(1) > .appointment-summary > [data-testid=appointment-time]',
        { timeout: Timeouts.slow },
      )
        .should('be.visible')
        .and('contain', '3:00 a.m.');
      cy.get('[data-testid=already-checked-in-no-time-message]', {
        timeout: Timeouts.slow,
      }).should('be.visible');
    });
  });
});
