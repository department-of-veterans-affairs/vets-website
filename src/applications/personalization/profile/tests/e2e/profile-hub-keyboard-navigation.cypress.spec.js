import mockUser from '../fixtures/users/user-36.json';
import { PROFILE_PATHS } from '../../constants';
import { mockProfileLOA3 } from './helpers';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';

describe('Profile - Hub page, Keyboard navigation', () => {
  const PROFILE_HREFS = [
    PROFILE_PATHS.PERSONAL_INFORMATION,
    PROFILE_PATHS.CONTACT_INFORMATION,
    PROFILE_PATHS.CONTACTS,
    PROFILE_PATHS.MILITARY_INFORMATION,
    '/records/get-military-service-records/',
    PROFILE_PATHS.VETERAN_STATUS_CARD,
    PROFILE_PATHS.DIRECT_DEPOSIT,
    '/va-payment-history/payments/',
    PROFILE_PATHS.NOTIFICATION_SETTINGS,
    PROFILE_PATHS.ACCOUNT_SECURITY,
    'https://wallet.id.me/settings',
    PROFILE_PATHS.CONNECTED_APPLICATIONS,
  ];

  it('should allow tabbing through all links on the page, in order', () => {
    cy.login(mockUser);

    mockProfileLOA3(
      generateFeatureToggles({ profileHideHealthCareContacts: false }),
    );

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

  it('should allow tabbing through all links on the page including paperless delivery, in order', () => {
    cy.login(mockUser);
    mockProfileLOA3(
      generateFeatureToggles({
        profileShowPaperlessDelivery: true,
        profileHideHealthCareContacts: false,
      }),
    );
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    const notificationSettingsIndex = PROFILE_HREFS.indexOf(
      PROFILE_PATHS.NOTIFICATION_SETTINGS,
    );
    const PROFILE_HREFS_WITH_PAPERLESS = [
      ...PROFILE_HREFS.slice(0, notificationSettingsIndex + 1),
      PROFILE_PATHS.PAPERLESS_DELIVERY,
      ...PROFILE_HREFS.slice(notificationSettingsIndex + 1),
    ];
    const [firstHref, ...hrefs] = PROFILE_HREFS_WITH_PAPERLESS;
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
