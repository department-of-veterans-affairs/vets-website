import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';

// IMPORTANT: These tests verify the accuracy of the VA.gov header against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the header in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
describe('global header - benefit hubs - health care', () => {
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

  const healthCare = '[data-e2e-id="vetnav-level2--health-care"]';
  const viewAll = {
    id: 'view-all-in-health-care',
    href: '/health-care',
    text: 'View all in health care',
  };

  // Headings and links were pulled from production on October 16, 2023.
  // It should stay up-to-date and match header-footer-data.json
  const headings = [
    {
      id: '#vetnav-column-one-header',
      text: 'Get health care benefits',
    },
    {
      id: '#vetnav-column-two-header',
      text: 'Manage your health',
    },
  ];

  const links = [
    {
      id: 'about-va-health-benefits',
      href: '/health-care/about-va-health-benefits',
      text: 'About VA health benefits',
    },
    {
      id: 'how-to-apply',
      href: '/health-care/how-to-apply',
      text: 'How to apply',
    },
    {
      id: 'family-and-caregiver-health-benefits',
      href: '/health-care/family-caregiver-benefits',
      text: 'Family and caregiver health benefits',
    },
    {
      id: 'apply-now-for-health-care',
      href: '/health-care/apply/application',
      text: 'Apply now for health care',
    },
    {
      id: 'refill-and-track-your-prescriptions',
      href: '/health-care/refill-track-prescriptions',
      text: 'Refill and track your prescriptions',
    },
    {
      id: 'send-a-secure-message-to-your-health-care-team',
      href: '/health-care/secure-messaging',
      text: 'Send a secure message to your health care team',
    },
    {
      id: 'schedule-and-manage-health-appointments',
      href: '/health-care/schedule-view-va-appointments',
      text: 'Schedule and manage health appointments',
    },
    {
      id: 'view-your-lab-and-test-results',
      href: '/health-care/view-test-and-lab-results',
      text: 'View your lab and test results',
    },
    {
      id: 'order-hearing-aid-batteries-and-accessories',
      href: '/health-care/order-hearing-aid-batteries-and-accessories',
      text: 'Order hearing aid batteries and accessories',
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

        // -> Health care
        h.verifyMenuItems(healthCare, headings, links, viewAll, 'Health care');
      });
  });
});
