import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        expect(req.body.session.lastName).to.equal('Smith');
        expect(req.body.session.last4).to.equal('4837');

        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
      cy.getAppointments();
      cy.successfulCheckin();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation trims white space before posting', () => {
      cy.visitWithUUID();
      cy.get('h1').contains('Check in at VA');
      cy.get('[label="Your last name"]')
        .shadow()
        .find('input')
        .type('Smith           ');
      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('input')
        .type('4837          ');
      cy.get('[data-testid=check-in-button]').click();
      cy.get('h1', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Your appointments');
    });
  });
});
