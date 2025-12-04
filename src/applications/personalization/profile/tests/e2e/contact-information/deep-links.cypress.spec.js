import { PROFILE_PATHS } from '@@profile/constants';
import { mockNotificationSettingsAPIs } from '../helpers';
import mockUser from '../../fixtures/users/user-36.json';

const deepLinks = [
  // this first one is to make sure unsupported deep link urls manage focus
  // correctly
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#an-unsupported-deep-link`,
    expectedTarget: {
      tag: 'heading',
      name: 'Contact information',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#email-address`,
    expectedTarget: {
      tag: 'heading',
      name: 'Email addresses',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#phone-numbers`,
    expectedTarget: {
      tag: 'heading',
      name: 'Phone numbers',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#edit-contact-email-address`,
    expectedTarget: {
      tag: 'va-button',
      name: 'Edit Contact email address',
      innerTag: 'button',
    },
  },
  {
    url: `${PROFILE_PATHS.CONTACT_INFORMATION}#edit-mobile-phone-number`,
    expectedTarget: {
      tag: 'va-button',
      name: 'Edit Mobile phone number',
      innerTag: 'button',
    },
  },
];

function getTargetElement(target) {
  // If the element is a web component, find the native element
  // inside the shadow DOM
  if (target.innerTag) {
    return cy
      .get(`${target.tag}[label="${target.name}"]`)
      .shadow()
      .find(target.innerTag);
  }
  // Otherwise, use the standard role-based query
  return cy.findByRole(target.tag, { name: target.name });
}

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
    // Wait for the element to exist and be visible
    // focus should be managed correctly
    getTargetElement(expectedTarget)
      .should('exist')
      .and('be.visible')
      .and('have.focus');
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
