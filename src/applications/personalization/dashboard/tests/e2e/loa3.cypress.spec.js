import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import error401 from '@@profile/tests/fixtures/401.json';
import error500 from '@@profile/tests/fixtures/500.json';
import {
  nameTagRendersWithDisabilityRating,
  nameTagRendersWithoutDisabilityRating,
  nameTagRendersWithFallbackLink,
} from '@@profile/tests/e2e/helpers';

import manifest from '~/applications/personalization/dashboard/manifest.json';

import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import MOCK_VA_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS';
import MOCK_CC_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS';
import { mockFolderResponse } from '../../utils/mocks/messaging/folder';
import { mockMessagesResponse } from '../../utils/mocks/messaging/messages';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the my VA Dashboard,
 *   checks that focus is managed correctly, and performs an aXe scan
 */
function loa3DashboardTest(mobile) {
  cy.visit(manifest.rootUrl);

  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should show a loading indicator
  cy.get('va-loading-indicator')
    .should('exist')
    .then($container => {
      cy.wrap($container)
        .shadow()
        .findByRole('progressbar')
        .should('contain', /loading your information/i);
    });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');

  // name tag exists with the right data
  nameTagRendersWithDisabilityRating();

  // make the a11y check
  cy.injectAxe();
  cy.axeCheck();
}

function nameTagIsFocused() {
  cy.focused();
  cy.contains(/Wesley Watson Ford/i);
}

describe('The My VA Dashboard', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());

    cy.intercept('/v0/folders/0', mockFolderResponse);
    cy.intercept('/v0/folders/0/messages', mockMessagesResponse);
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
    cy.intercept(
      '/vaos/v0/appointments?start_date=*&type=va',
      MOCK_VA_APPOINTMENTS,
    );
    cy.intercept('/vaos/v0/appointments?type=cc', MOCK_CC_APPOINTMENTS);
  });

  context('when it can load the total disability rating', () => {
    beforeEach(() => {
      cy.intercept(
        '/v0/disability_compensation_form/rating_info',
        disabilityRating,
      );
    });

    it('should handle LOA3 users at desktop size', () => {
      loa3DashboardTest(false);
      nameTagIsFocused();
      cy.injectAxe();
      cy.axeCheck();
    });

    it('should handle LOA3 users at mobile phone size', () => {
      loa3DashboardTest(true);
      nameTagIsFocused();
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  context('when there is a 401 fetching the total disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 401,
        body: error401,
      });
    });

    it('should totally hide the disability rating in the header', () => {
      cy.visit(manifest.rootUrl);
      nameTagRendersWithoutDisabilityRating();
      nameTagIsFocused();
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  context('when there is a 500 fetching the total disability rating', () => {
    beforeEach(() => {
      cy.intercept('/v0/disability_compensation_form/rating_info', {
        statusCode: 500,
        body: error500,
      });
    });

    it('should show the fallback link in the header', () => {
      cy.visit(manifest.rootUrl);
      nameTagRendersWithFallbackLink();
      nameTagIsFocused();
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
