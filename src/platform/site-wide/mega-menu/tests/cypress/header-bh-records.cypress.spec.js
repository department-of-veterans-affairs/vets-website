import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - records', () => {
  Cypress.config({
    includeShadowDom: true,
    waitForAnimations: true,
    pageLoadTimeout: 120000,
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('/v0/maintenance_windows', {
      data: [],
    }).as('maintenanceWindows');
    cy.intercept('POST', 'https://www.google-analytics.com/*', {}).as(
      'analytics',
    );
  });

  const burialsAndMemorials = '[data-e2e-id="vetnav-level2--records"]';
  const viewAll = {
    id: 'view-all-in-records',
    href: '/records',
    text: 'View all in records',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get your records',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your records',
    },
  ];

  const links = [
    {
      id: 'get-your-va-medical-records-blue-button',
      href: '/health-care/get-medical-records',
      text: 'Get your VA medical records (Blue Button)',
    },
    {
      id: 'download-your-va-benefits-letters',
      href: '/records/download-va-letters',
      text: 'Download your VA benefits letters',
    },
    {
      id: 'learn-how-to-request-a-home-loan-coe',
      href: '/housing-assistance/home-loans/how-to-request-coe',
      text: 'Learn how to request a home loan COE',
    },
    {
      id: 'get-veteran-id-cards',
      href: '/records/get-veteran-id-cards',
      text: 'Get Veteran ID cards',
    },
    {
      id: 'request-your-military-records-dd-214',
      href: '/records/get-military-service-records',
      text: 'Request your military records (DD214)',
    },
    {
      id: 'change-your-address',
      href: '/change-address',
      text: 'Change your address',
    },
    {
      id: 'how-to-apply-for-a-discharge-upgrade',
      href: '/discharge-upgrade-instructions',
      text: 'How to apply for a discharge upgrade',
    },
    {
      id: 'view-your-va-payment-history',
      href: '/va-payment-history',
      text: 'View your VA payment history',
    },
    {
      id: 'search-historical-military-records-national-archives',
      href: 'https://www.archives.gov/',
      text: 'Search historical military records (National Archives)',
    },
  ];

  it('should correctly load the elements', () => {
    cy.visit('/');
    cy.injectAxeThenAxeCheck();

    h.verifyElement('.header');

    const header = () => cy.get('.header');

    header()
      .scrollIntoView()
      .within(() => {
        const vaBenefitsAndHealthCareButton =
          '[data-e2e-id="va-benefits-and-health-care-0"]';

        // VA Benefits and Health Care
        h.verifyElement(vaBenefitsAndHealthCareButton);
        h.clickButton(vaBenefitsAndHealthCareButton);

        // -> Records
        h.verifyMenuItems(
          burialsAndMemorials,
          headings,
          links,
          viewAll,
          'Records',
        );
      });
  });
});
