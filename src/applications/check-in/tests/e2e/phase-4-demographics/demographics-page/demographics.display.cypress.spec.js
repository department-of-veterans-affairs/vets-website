import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/v2/check.in.responses';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/v2/patient.check.in.responses';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 4 -- ', () => {
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
        req.reply(rv);
      });
      cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
        req.reply(mockCheckIn.createMockSuccessResponse({}));
      });
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceMultipleAppointmentSupport: true,
          checkInExperienceUpdateInformationPageEnabled: false,
          checkInExperienceDemographicsPageEnabled: true,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('demographics display', () => {
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);

      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
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
        .and('have.text', 'Is this your current contact information?');
      cy.get('.check-in-demographics > p', { timeout: Timeouts.slow })
        .should('be.visible')
        .and(
          'have.text',
          'We can better follow up with you after your appointment when we have your current information.',
        );
      cy.get('.check-in-demographics dl')
        .find('dt:nth-child(1)')
        .should('have.text', 'Mailing Address')
        .next()
        .should('have.text', '123 Turtle TrailTreetopper, Tennessee 101010')
        .next()
        .should('have.text', 'Home Address')
        .next()
        .should(
          'have.text',
          '445 Fine Finch Fairway, Apt 201Fairfence, Florida 445545',
        )
        .next()
        .should('have.text', 'Home Phone')
        .next()
        .should('have.text', '555-222-3333')
        .next()
        .should('have.text', 'Mobile Phone')
        .next()
        .should('have.text', '555-333-4444')
        .next()
        .should('have.text', 'Work Phone')
        .next()
        .should('have.text', '555-444-5555')
        .next()
        .should('have.text', 'Email Address')
        .next()
        .should('have.text', 'kermit.frog@sesameenterprises.us');
    });
  });
});
