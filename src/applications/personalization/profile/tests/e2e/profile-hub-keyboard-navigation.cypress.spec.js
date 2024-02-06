import mockUser from '../fixtures/users/user-36.json';
import { PROFILE_PATHS } from '../../constants';
import { mockProfileLOA3 } from './helpers';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';

const PROFILE_HREFS = [
  PROFILE_PATHS.PERSONAL_INFORMATION,
  PROFILE_PATHS.CONTACT_INFORMATION,
  PROFILE_PATHS.CONTACTS,
  PROFILE_PATHS.MILITARY_INFORMATION,
  '/records/get-military-service-records/',
  PROFILE_PATHS.DIRECT_DEPOSIT,
  '/va-payment-history/payments/',
  PROFILE_PATHS.NOTIFICATION_SETTINGS,
  PROFILE_PATHS.ACCOUNT_SECURITY,
  'https://wallet.id.me/settings',
  PROFILE_PATHS.CONNECTED_APPLICATIONS,
];

describe('Profile - Hub page, Keyboard navigation', () => {
  it('should allow tabbing through all links on the page, in order', () => {
    cy.intercept(
      'v0/feature_toggles*',
      generateFeatureToggles({
        profileUseHubPage: true,
        profileContacts: true,
      }),
    );
    cy.login(mockUser);
    mockProfileLOA3();
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    const [firstHref, ...hrefs] = PROFILE_HREFS;
    cy.tabToElement(`a[href^="${firstHref}"]`);
    hrefs.forEach(href => {
      cy.realPress('Tab');
      // using the cy.focused() method as described in the documentation
      // https://docs.cypress.io/api/commands/focused#Make-an-assertion-on-the-focused-element
      /* eslint-disable-next-line cypress/unsafe-to-chain-command */
      cy.focused().should('have.attr', 'href', href);
    });

    cy.injectAxeThenAxeCheck();
  });
});
