import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';

import session from '../../../../api/local-mock-api/mocks/v2/sessions';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  const testState = {
    authed: false,
  };
  describe('ticket #35249 - routing issues', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeDemographicsPatch.withSuccess();
      initializeFeatureToggle.withCurrentFeatures();
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        if (testState.authed) {
          req.reply(
            session.get.createMockSuccessResponse({ permissions: 'read.full' }),
          );
        } else {
          req.reply(
            session.get.createMockSuccessResponse('some-token', 'read.basic'),
          );
        }
      });
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        testState.authed = true;
        req.reply(
          session.post.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validate that demographics check still happens', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();
      // leave the page and then come back to it
      cy.visit(``);
      cy.window().then(window => {
        // clear out session storage
        window.sessionStorage.clear();
        cy.visitWithUUID();
        AppointmentsPage.attemptCheckIn();
        Arrived.validateArrivedPage();
        Arrived.attemptToGoToNextPage();
        Demographics.validatePageLoaded();
      });
    });
  });
});
