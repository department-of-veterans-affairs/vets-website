import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

describe('global header - benefit hubs - pension', () => {
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

  const careersEmployment = '[data-e2e-id="vetnav-level2--pension"]';
  const viewAll = {
    id: 'view-all-in-pension',
    href: '/pension',
    text: 'View all in pension',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get pension benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your benefits',
    },
  ];

  const links = [
    {
      id: 'veterans-pension-eligibility',
      href: '/pension/eligibility',
      text: 'Veterans Pension eligibility',
    },
    {
      id: 'how-to-apply',
      href: '/pension/how-to-apply',
      text: 'How to apply',
    },
    {
      id: 'aid-and-attendance-benefits-and-housebound-allowance',
      href: '/pension/aid-attendance-housebound',
      text: 'Aid and attendance benefits and housebound allowance',
    },
    {
      id: 'survivors-pension',
      href: '/pension/survivors-pension',
      text: 'Survivors Pension',
    },
    {
      id: 'apply-now-for-a-veterans-pension',
      href: '/pension/application/527EZ',
      text: 'Apply now for a Veterans Pension',
    },
    {
      id: 'check-your-claim-or-appeal-status',
      href: '/claim-or-appeal-status',
      text: 'Check your claim or appeal status',
    },
    {
      id: 'view-your-va-payment-history',
      href: '/va-payment-history',
      text: 'View your VA payment history',
    },
    {
      id: 'change-your-address',
      href: '/change-address',
      text: 'Change your address',
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

        // -> Pension
        h.verifyMenuItems(
          careersEmployment,
          headings,
          links,
          viewAll,
          'Pension',
        );
      });
  });
});
