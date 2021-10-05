import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/v2/check.in.responses';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/v2/patient.check.in.responses';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
      cy.intercept('GET', '/check_in/v2/patient_check_ins/*', req => {
        req.reply(mockPatientCheckIns.createMultipleAppointments());
      });
      cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
        req.reply(mockCheckIn.createMockSuccessResponse({}));
      });
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        createFeatureToggles(true, true, true, false),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Returning user', () => {
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Your appointments');
      cy.get('.appointment-list').should('have.length', 1);
      cy.injectAxe();
      cy.axeCheck();
      cy.get(':nth-child(3) > [data-testid=check-in-button]').click();
      cy.get('va-alert > h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('include.text', 'checked in');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
