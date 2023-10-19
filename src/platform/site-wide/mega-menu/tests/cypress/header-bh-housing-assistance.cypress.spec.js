import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - housing assistance', () => {
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

  const housingAssistance = '[data-e2e-id="vetnav-level2--housing-assistance"]';
  const viewAll = {
    id: 'view-all-in-housing-assistance',
    href: '/housing-assistance',
    text: 'View all in housing assistance',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get home loan benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Get Veterans housing grants',
    },
  ];

  const links = [
    {
      id: 'about-va-home-loan-types',
      href: '/housing-assistance/home-loans/loan-types',
      text: 'About VA home loan types',
    },
    {
      id: 'how-to-request-a-coe',
      href: '/housing-assistance/home-loans/how-to-request-coe',
      text: 'How to request a COE',
    },
    {
      id: 'check-your-coe-status',
      href: '/housing-assistance/home-loans/check-coe-status',
      text: 'Check your COE status',
    },
    {
      id: 'request-a-coe-online',
      href: '/housing-assistance/home-loans/request-coe-form-26-1880',
      text: 'Request a COE online',
    },
    {
      id: 'about-disability-housing-grants',
      href: '/housing-assistance/disability-housing-grants',
      text: 'About disability housing grants',
    },
    {
      id: 'check-your-sah-claim-status',
      href: '/claim-or-appeal-status',
      text: 'Check your SAH claim status',
    },
    {
      id: 'how-to-apply-for-an-sah-grant',
      href: '/housing-assistance/disability-housing-grants/how-to-apply',
      text: 'How to apply for an SAH grant',
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

        // -> Housing assistance
        h.verifyMenuItems(
          housingAssistance,
          headings,
          links,
          viewAll,
          'Housing assistance',
        );
      });
  });
});
