import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import mockSession from '../../../api/local-mock-api/mocks/v2/sessions.responses';

describe('Check In Experience -- ', () => {
  describe('extra validation -- ', () => {
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
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation trims white space before posting', () => {
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran('Smith           ', '4837          ');
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
  });
});
