import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '../../fixtures/users/user-36.json';

const deepLinks = [
  // this first one is to make sure unsupported deep link urls manage focus
  // correctly
  {
    url: `${PROFILE_PATHS.PERSONAL_INFORMATION}#an-unsupported-deep-link`,
    expectedTarget: {
      role: 'heading',
      name: 'Personal and contact information',
    },
  },
  {
    url: `${PROFILE_PATHS.PERSONAL_INFORMATION}#email-address`,
    expectedTarget: {
      role: 'heading',
      name: 'Contact email address',
    },
  },
  {
    url: `${PROFILE_PATHS.PERSONAL_INFORMATION}#phone-numbers`,
    expectedTarget: {
      role: 'heading',
      name: 'Phone numbers',
    },
  },
  {
    url: `${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-contact-email-address`,
    expectedTarget: {
      role: 'button',
      name: /edit contact email address/i,
    },
  },
  {
    url: `${PROFILE_PATHS.PERSONAL_INFORMATION}#edit-mobile-phone-number`,
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
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByRole('progressbar').should('not.exist');
  cy.findByText(/loading your information/i).should('not.exist');

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
  });
  it('should manage focus for all supported deep links on desktop size', () => {
    checkAllDeepLinks(false);
  });

  it('should manage focus for all supported deep links on mobile phone size', () => {
    checkAllDeepLinks(true);
  });
});
