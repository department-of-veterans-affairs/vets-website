import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { mockUser } from '@@profile/tests/fixtures/users/user.js';

import manifest from 'applications/personalization/dashboard/manifest.json';

const mockFeatureToggles = () => {
  cy.route({
    method: 'GET',
    status: 200,
    url: '/v0/feature_toggles*',
    response: {
      data: {
        features: [
          {
            name: 'dashboard_show_dashboard_2',
            value: true,
          },
        ],
      },
    },
  });
};

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the my VA Dashboard,
 *   checks that focus is managed correctly, and performs an aXe scan
 */
function checkAllPages(mobile = false) {
  mockFeatureToggles();
  cy.visit(manifest.rootUrl);

  if (mobile) {
    cy.viewport('iphone-4');
  }

  // focus should be on the h1
  cy.focused().should('have.attr', 'id', 'dashboard-title');

  // make the a11y check
  cy.injectAxe();
  cy.axeCheck();
}

describe('The my VA Dashboard', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUser);
  });
  it('should pass an aXe scan and manage focus at desktop size', () => {
    checkAllPages(false);
  });

  it('should pass an aXe scan and manage focus at mobile phone size', () => {
    checkAllPages(true);
  });
});
