import { PROFILE_PATHS } from '@@profile/constants';

import { mockNotificationSettingsAPIs } from '../helpers';

import mockUser from '../../fixtures/users/user-36.json';

const deepLinks = [
  // this first one is to make sure unsupported deep link urls manage focus
  // correctly
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#an-unsupported-deep-link`,
    expectedTarget: {
      role: 'heading',
      name: 'Contact information',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#email-address`,
    expectedTarget: {
      role: 'heading',
      name: 'Email addresses',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#phone-numbers`,
    expectedTarget: {
      role: 'heading',
      name: 'Phone numbers',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#edit-contact-email-address`,
    expectedTarget: {
      role: 'button',
      name: /edit contact email address/i,
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#edit-mobile-phone-number`,
    expectedTarget: {
      role: 'button',
      name: /edit mobile phone number/i,
    },
  },
];

/**
 * @param {boolean} mobile - test on a mobile viewport or not
 */
function checkAllDeepLinks(mobile = false) {
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
  if (mobile) {
    cy.viewportPreset('va-top-mobile-1');
  }

  deepLinks.forEach(({ url, expectedTarget }) => {
    cy.visit(url);
    // focus should be managed correctly
    cy.findByRole(expectedTarget.role, {
      name: expectedTarget.name,
    }).should('have.focus');
  });
}

describe('Profile', () => {
  beforeEach(() => {
    cy.login(mockUser);
    // These APIs are not needed for the tests. but mocking them makes
    // everything run faster
    mockNotificationSettingsAPIs();
  });
  it('should manage focus for all supported deep links on desktop size', () => {
    checkAllDeepLinks(false);
    cy.injectAxeThenAxeCheck();
  });

  it('should manage focus for all supported deep links on mobile phone size', () => {
    checkAllDeepLinks(true);
    cy.injectAxeThenAxeCheck();
  });
});
