import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - education and training', () => {
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

  const educationTraining =
    '[data-e2e-id="vetnav-level2--education-and-training"]';

  const viewAll = {
    id: 'view-all-in-education',
    href: '/education',
    text: 'View all in education',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get education benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your benefits',
    },
  ];

  const links = [
    {
      id: 'about-gi-bill-benefits',
      href: '/education/about-gi-bill-benefits',
      text: 'About GI Bill benefits',
    },
    {
      id: 'eligibility',
      href: '/education/eligibility',
      text: 'Eligibility',
    },
    {
      id: 'how-to-apply',
      href: '/education/how-to-apply',
      text: 'How to apply',
    },
    {
      id: 'veteran-readiness-and-employment',
      href: '/careers-employment/vocational-rehabilitation',
      text: 'Veteran Readiness and Employment',
    },
    {
      id: 'survivor-and-dependent-education-benefits',
      href: '/education/survivor-dependent-benefits',
      text: 'Survivor and dependent education benefits',
    },
    {
      id: 'view-your-va-payment-history',
      href: '/va-payment-history',
      text: 'View your VA payment history',
    },
    {
      id: 'check-your-post-9-11-gi-bill-benefits',
      href: '/education/gi-bill/post-9-11/ch-33-benefit/',
      text: 'Check your Post-9/11 GI Bill benefits',
    },
    {
      id: 'transfer-your-post-9-11-gi-bill-benefits',
      href: '/education/transfer-post-9-11-gi-bill-benefits',
      text: 'Transfer your Post-9/11 GI Bill benefits',
    },
    {
      id: 'change-your-gi-bill-school-or-program',
      href: '/education/change-gi-bill-benefits',
      text: 'Change your GI Bill school or program',
    },
    {
      id: 'change-your-direct-deposit-information',
      href: '/change-direct-deposit',
      text: 'Change your direct deposit information',
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

        // -> Education and training
        h.verifyMenuItems(
          educationTraining,
          headings,
          links,
          viewAll,
          'Education and training',
        );
      });
  });
});
