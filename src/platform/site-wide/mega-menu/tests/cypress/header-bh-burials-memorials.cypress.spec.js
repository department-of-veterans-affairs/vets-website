import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - burials and memorials', () => {
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

  const burialsAndMemorials =
    '[data-e2e-id="vetnav-level2--burials-and-memorials"]';
  const viewAll = {
    id: 'view-all-in-burials-and-memorials',
    href: '/burials-memorials',
    text: 'View all in burials and memorials',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get burial benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Plan a burial',
    },
  ];

  const links = [
    {
      id: 'eligibility',
      href: '/burials-memorials/eligibility',
      text: 'Eligibility',
    },
    {
      id: 'pre-need-burial-eligibility-determination',
      href: '/burials-memorials/pre-need-eligibility',
      text: 'Pre-need burial eligibility determination',
    },
    {
      id: 'veteran-burial-allowance',
      href: '/burials-memorials/veterans-burial-allowance',
      text: 'Veteran burial allowance',
    },
    {
      id: 'memorial-items',
      href: '/burials-memorials/memorial-items',
      text: 'Memorial items',
    },
    {
      id: 'survivor-and-dependent-compensation-dic',
      href: '/disability/dependency-indemnity-compensation',
      text: 'Survivor and dependent compensation (DIC)',
    },
    {
      id: 'schedule-a-burial-for-a-family-member',
      href: '/burials-memorials/schedule-a-burial',
      text: 'Schedule a burial for a family member',
    },
    {
      id: 'schedule-a-burial-in-a-va-national-cemetery',
      href: 'https://www.cem.va.gov/cem/burial_benefits/need.asp',
      text: 'Schedule a burial in a VA national cemetery',
    },
    {
      id: 'find-a-cemetery',
      href: 'https://www.cem.va.gov/cems/listcem.asp',
      text: 'Find a cemetery',
    },
    {
      id: 'request-military-records-dd-214',
      href: '/records/get-military-service-records',
      text: 'Request military records (DD214)',
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

        // -> Burials and memorials
        h.verifyMenuItems(
          burialsAndMemorials,
          headings,
          links,
          viewAll,
          'Burials and memorials',
        );
      });
  });
});
