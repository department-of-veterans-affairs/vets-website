import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Confirmation from './pages/Confirmation';

describe('Check In Experience | Pre-check-in', () => {
  describe('A patent who does not need to confirm demographics', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
        initializeUpcomingAppointmentsDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withAllDemographicsCurrent();
      initializePreCheckInDataPost.withSuccess();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      cy.visitPreCheckInWithUUID();
    });
    it('should be redirected to the complete page and see the pre-check-in complete message', () => {
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      Confirmation.validatePageContent();
      cy.injectAxeThenAxeCheck();
    });
  });
});
