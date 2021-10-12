import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
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
        req.reply(401, mockSession.createMockFailedLoginResponse(3));
      });
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceMultipleAppointmentSupport: true,
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Failed login with retry - 401 api error', () => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        // hasValidated = false;
        req.reply(401, mockSession.createMockFailedLoginResponse(1));
      });
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.get('.vads-l-grid-container').within(() => {
        cy.findByText(
          /We need some information to verify your identity to check you in./i,
        ).should('exist');
      });
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
      cy.url().should('match', /verify/);
      cy.get('h1').contains(/Check in at VA/i);
      cy.get('.vads-l-grid-container').within(() => {
        cy.findByText(
          /We need some information to verify your identity to check you in./i,
        ).should('not.exist');
      });
      cy.get('[data-testid=error-message]').contains(
        /We’re sorry. We couldn’t verify your identity with the information you provided/i,
      );
      cy.get('[label="Your last name"]').should('have.value', 'Smith');
      cy.get('[label="Last 4 digits of your Social Security number"]').should(
        'have.value',
        '4837',
      );
      cy.get('[data-testid=check-in-button]').contains(/continue/i);
      cy.injectAxe();
      cy.axeCheck();
    });
    it('Max validate limit error page - 401 api error', () => {
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(401, mockSession.createMockFailedLoginResponse(3));
      });
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('have.text', 'Check in at VA');
      cy.get('.vads-l-grid-container').within(() => {
        cy.findByText(
          /We need some information to verify your identity to check you in./i,
        ).should('exist');
      });
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
      cy.url().should('match', /error/);
      cy.get('h1').contains('We couldn’t check you in');
      cy.get('[data-testid=error-message]').contains(
        /We’re sorry. We couldn’t verify your identity with the information you provided/i,
      );
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
