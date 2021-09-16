import { createFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../api/local-mock-api/mocks/v0/check.in.responses';
import mockSession from '../../../api/local-mock-api/mocks/v1/sessions.responses';
import mockPatientCheckIns from '../../../api/local-mock-api/mocks/v1/patient.check.in.responses';

import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/check_in/v1/sessions/*', req => {
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.basic'),
      );
    });
    cy.intercept('POST', '/check_in/v1/sessions', req => {
      req.reply({
        statusCode: 200,
        body: mockSession.createMockSuccessResponse('some-token', 'read.full'),
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
      createFeatureToggles(true, true, false, false),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('validate page is enabled; update question is disabled', () => {
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
    cy.get('[data-testid=check-in-button]')
      .should('be.visible')
      .click({
        waitForAnimations: true,
      });

    cy.url().should('match', /details/);

    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('Your appointment');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click({
      waitForAnimations: true,
    });

    cy.get('va-alert > h1').contains('checked in');
    cy.injectAxe();
    cy.axeCheck();
  });
});
