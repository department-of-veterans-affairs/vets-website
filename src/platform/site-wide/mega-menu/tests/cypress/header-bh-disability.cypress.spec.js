import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - disability', () => {
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

  const disability = '[data-e2e-id="vetnav-level2--disability"]';
  const viewAll = {
    id: 'view-all-in-disability',
    href: '/disability',
    text: 'View all in disability',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get disability benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your benefits',
    },
  ];

  const links = [
    {
      id: 'eligibility',
      href: '/disability/eligibility',
      text: 'Eligibility',
    },
    {
      id: 'how-to-file-a-claim',
      href: '/disability/how-to-file-claim',
      text: 'How to file a claim',
    },
    {
      id: 'survivor-and-dependent-compensation-dic',
      href: '/disability/dependency-indemnity-compensation',
      text: 'Survivor and dependent compensation (DIC)',
    },
    {
      id: 'file-a-claim-online',
      href: '/disability/file-disability-claim-form-21-526ez/',
      text: 'File a claim online',
    },
    {
      id: 'check-your-claim-decision-review-or-appeal-status',
      href: '/claim-or-appeal-status',
      text: 'Check your claim, decision review, or appeal status',
    },
    {
      id: 'view-your-va-payment-history',
      href: '/va-payment-history',
      text: 'View your VA payment history',
    },
    {
      id: 'upload-evidence-to-support-your-claim',
      href: '/disability/upload-supporting-evidence',
      text: 'Upload evidence to support your claim',
    },
    {
      id: 'file-for-a-va-disability-increase',
      href: '/disability/file-disability-claim-form-21-526ez/',
      text: 'File for a VA disability increase',
    },
    {
      id: 'request-a-decision-review-or-appeal',
      href: '/decision-reviews',
      text: 'Request a decision review or appeal',
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

        // -> Disability
        h.verifyMenuItems(disability, headings, links, viewAll, 'Disability');
      });
  });
});
