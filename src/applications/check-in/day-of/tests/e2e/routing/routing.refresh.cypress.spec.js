import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';

import session from '../../../../api/local-mock-api/mocks/v2/sessions';

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
      } = ApiInitializer;
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
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 1,
      });
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

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();
      // leave the page and then come back to it
      cy.visit(``);
      cy.window().then(window => {
        // clear out session storage
        window.sessionStorage.clear();
        cy.visitWithUUID();
        Demographics.validatePageLoaded();
      });
    });
  });
});
