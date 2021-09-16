import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/check.in.response';
import mockSession from '../../../../api/local-mock-api/mocks/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/patient.check.in.response';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 2 -- ', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v1/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
      cy.intercept('POST', '/check_in/v1/sessions', req => {
        req.reply({
          statusCode: 400,
          body: {
            errors: [
              {
                title: 'Operation failed',
                detail: 'Operation failed',
                code: 'VA900',
                status: '400',
              },
            ],
          },
          delay: 10, // milliseconds
        });
      });
      cy.intercept('GET', '/check_in/v1/patient_check_ins/*', req => {
        req.reply(mockPatientCheckIns.createMockSuccessResponse({}, false));
      });
      cy.intercept('POST', '/check_in/v1/patient_check_ins/', req => {
        req.reply(mockCheckIn.createMockSuccessResponse({}));
      });
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        createFeatureToggles(true, true, false, true),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed', () => {
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
        .and('contain', 'We couldn’t check you in');
    });
  });
});
