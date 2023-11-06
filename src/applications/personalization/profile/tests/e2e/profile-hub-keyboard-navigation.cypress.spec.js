import mockUser from '../fixtures/users/user-36.json';
import { PROFILE_PATHS } from '../../constants';
import { mockProfileLOA3 } from './helpers';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';

describe('Profile - Hub page, Keyboard navigation', () => {
  beforeEach(() => {
    cy.login(mockUser);
    mockProfileLOA3();
  });

  it('should tab through all links on the page, in order', () => {
    cy.intercept(
      'v0/feature_toggles*',
      generateFeatureToggles({
        profileUseHubPage: true,
        profileContacts: true,
      }),
    );

    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.tabToElement(`a[href^="${PROFILE_PATHS.PERSONAL_INFORMATION}"`);

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'href', PROFILE_PATHS.CONTACT_INFORMATION);

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'href', PROFILE_PATHS.CONTACTS);

    cy.realPress('Tab');
    cy.focused().should(
      'have.attr',
      'href',
      PROFILE_PATHS.MILITARY_INFORMATION,
    );

    cy.realPress('Tab');
    cy.focused().should(
      'have.attr',
      'href',
      '/records/get-military-service-records/',
    );

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'href', PROFILE_PATHS.DIRECT_DEPOSIT);

    cy.realPress('Tab');
    cy.focused().should(
      'have.attr',
      'href',
      PROFILE_PATHS.NOTIFICATION_SETTINGS,
    );

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'href', PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'href', 'https://wallet.id.me/settings');

    cy.realPress('Tab');
    cy.focused().should(
      'have.attr',
      'href',
      PROFILE_PATHS.CONNECTED_APPLICATIONS,
    );

    cy.injectAxeThenAxeCheck();
  });
});
