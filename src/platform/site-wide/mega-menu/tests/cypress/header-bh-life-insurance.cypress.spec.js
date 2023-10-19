import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - life insurance', () => {
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

  const lifeInsurance = '[data-e2e-id="vetnav-level2--life-insurance"]';
  const viewAll = {
    id: 'view-all-in-life-insurance',
    href: '/life-insurance',
    text: 'View all in life insurance',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get life insurance',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your life insurance',
    },
  ];

  const links = [
    {
      id: 'about-life-insurance-options',
      href: '/life-insurance/options-eligibility',
      text: 'About life insurance options',
    },
    {
      id: 'benefits-for-totally-disabled-or-terminally-ill-policyholders',
      href: '/life-insurance/totally-disabled-or-terminally-ill',
      text: 'Benefits for totally disabled or terminally ill policyholders',
    },
    {
      id: 'beneficiary-financial-counseling-and-online-will-preparation',
      href: 'https://www.benefits.va.gov/insurance/bfcs.asp',
      text: 'Beneficiary financial counseling and online will preparation',
    },
    {
      id: 'access-your-policy-online',
      href: '/life-insurance/manage-your-policy',
      text: 'Access your policy online',
    },
    {
      id: 'update-your-beneficiaries',
      href: 'https://www.benefits.va.gov/INSURANCE/updatebene.asp',
      text: 'Update your beneficiaries',
    },
    {
      id: 'file-a-claim-for-insurance-benefits',
      href: 'https://www.benefits.va.gov/INSURANCE/sglivgli.asp',
      text: 'File a claim for insurance benefits',
    },
    {
      id: 'check-your-appeal-status',
      href: '/claim-or-appeal-status',
      text: 'Check your appeal status',
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

        // -> Life insurance
        h.verifyMenuItems(
          lifeInsurance,
          headings,
          links,
          viewAll,
          'Life insurance',
        );
      });
  });
});
