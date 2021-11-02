import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockCheckIn from '../../../../api/local-mock-api/mocks/v2/check.in.responses';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.authenticate();
    cy.getSingleAppointment();
    cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
      req.reply(404, mockCheckIn.createMockFailedResponse({}));
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5730 - Check in - 404 api error', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Check in at VA');
    cy.injectAxe();
    cy.axeCheck();
    cy.signIn();
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Your appointments');
    cy.get('.appointment-list').should('have.length', 1);
    cy.injectAxe();
    cy.axeCheck();
    cy.get('.usa-button').click();
    cy.url().should('match', /error/);
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'We couldn’t check you in');
  });
});
