import mockProfileEnhancementsToggles from '@@profile/tests/fixtures/personal-information-feature-toggles.json';

import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';
import { mockGETEndpoints } from './helpers';

function clickSubNavButton(
  buttonLabel,
  mobile,
  profile2Enabled,
  parentMenu = false,
) {
  if (mobile) {
    if (profile2Enabled) {
      cy.get('va-sidenav')
        .filter(':visible')
        .click();
    } else {
      cy.findByRole('button', { name: /profile menu/i }).click();
    }
  }
  if (profile2Enabled) {
    const navSelector = parentMenu
      ? `va-sidenav-submenu[label="${buttonLabel}"]`
      : `va-sidenav-item[label="${buttonLabel}"]`;
    cy.get(navSelector)
      .filter(':visible')
      .click();
  } else {
    cy.findByRole('link', { name: buttonLabel }).click();
  }
}

/**
 *
 * @param {boolean} profile2Enabled - feature
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the personal information page, since that is the first page in the sub-nav
 *   performs an aXe scan, and checks that focus is managed correctly
 * - clicks through each item in the sub-nav and:
 *   - checks that the URL is correct
 *   - checks that the document title is correct
 *   - performs an aXe scan
 *   - checks that focus is managed correctly
 */
function checkSubNavFocus({ profile2Enabled = false, mobile = false } = {}) {
  if (profile2Enabled) {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profile2Enabled: true,
      }),
    );
  } else {
    cy.intercept('v0/feature_toggles*', mockProfileEnhancementsToggles);
  }
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
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

  // since we did not mock the `GET profile/full_name` endpoint, the
  // NameTag should not be rendered on the page
  cy.findByTestId('name-tag').should('not.exist');

  // visiting /profile should redirect to profile/personal-information
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );
  cy.title().should('eq', 'Personal Information | Veterans Affairs');

  // make the a11y check on the Personal Info section
  cy.injectAxe();
  cy.axeCheck();

  if (profile2Enabled) {
    // make the a11y and focus management check on the Service history information section
    clickSubNavButton(
      PROFILE_PATH_NAMES.SERVICE_HISTORY_INFORMATION,
      mobile,
      profile2Enabled,
    );
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.SERVICE_HISTORY_INFORMATION}`,
    );
    cy.title().should('eq', 'Military Information | Veterans Affairs');
    cy.axeCheck();
  } else {
    // make the a11y and focus management check on the Military Info section
    clickSubNavButton(
      PROFILE_PATH_NAMES.MILITARY_INFORMATION,
      mobile,
      profile2Enabled,
    );
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.MILITARY_INFORMATION}`,
    );
    cy.title().should('eq', 'Military Information | Veterans Affairs');
    cy.axeCheck();
  }
  // make the a11y and focus management check on the Veteran Status Card section
  clickSubNavButton(
    PROFILE_PATH_NAMES.VETERAN_STATUS_CARD,
    mobile,
    profile2Enabled,
  );
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.VETERAN_STATUS_CARD}`,
  );
  cy.title().should('eq', 'Veteran Status Card | Veterans Affairs');
  cy.axeCheck();

  // make the a11y and focus management check on the Direct Deposit section
  clickSubNavButton('Direct deposit information', mobile, profile2Enabled);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.DIRECT_DEPOSIT}`,
  );
  cy.title().should('eq', 'Direct Deposit Information | Veterans Affairs');
  cy.axeCheck();

  // make the a11y and focus management check on the Account Security section
  // clickSubNavButton(
  //   PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
  //   mobile,
  //   profile2Enabled,
  //   true,
  // );
  // cy.url().should(
  //   'eq',
  //   `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  // );
  // cy.title().should('eq', 'Account Security | Veterans Affairs');
  // cy.axeCheck();

  // make the a11y and focus management check on the Connected Apps section
  clickSubNavButton(
    PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
    mobile,
    profile2Enabled,
  );
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.CONNECTED_APPLICATIONS}`,
  );
  cy.title().should('eq', 'Connected Apps | Veterans Affairs');
  // wait for this section's loading spinner to disappear...
  cy.findByTestId('connected-apps-loading-indicator').should('not.exist');
  cy.axeCheck();

  // navigate directly to the Personal Info section via the sub-nav to confirm focus is managed correctly
  clickSubNavButton(
    PROFILE_PATH_NAMES.PERSONAL_INFORMATION,
    mobile,
    profile2Enabled,
  );
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );

  // navigate directly to the Contact Info section via the sub-nav to confirm focus is managed correctly
  clickSubNavButton(
    PROFILE_PATH_NAMES.CONTACT_INFORMATION,
    mobile,
    profile2Enabled,
  );
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.CONTACT_INFORMATION}`,
  );
}

describe('Profile Navigation - Accessibility', () => {
  beforeEach(() => {
    cy.login(mockUser);
    const otherEndpoints = ['/v0/profile/full_name'];
    mockGETEndpoints(otherEndpoints, 200, {});
  });
  it('check focus for navigating between profile pages via menu on desktop', () => {
    checkSubNavFocus({ mobile: false });
    cy.injectAxeThenAxeCheck();
  });

  it('check focus for navigating between profile pages via menu on mobile', () => {
    checkSubNavFocus({ mobile: true });
    cy.injectAxeThenAxeCheck();
  });

  describe('when feature profile2Enabled is true', () => {
    it('check focus for navigating between profile pages via menu on desktop', () => {
      checkSubNavFocus({ profile2Enabled: true, mobile: false });
      cy.injectAxeThenAxeCheck();
    });

    it('check focus for navigating between profile pages via menu on mobile', () => {
      checkSubNavFocus({ profile2Enabled: true, mobile: true });
      cy.injectAxeThenAxeCheck();
    });
  });
});
