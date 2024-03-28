import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';

import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Secure Messaging Inbox Cerner', () => {
  it('verify cerner facilities displays in alert banner', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login(
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    landingPage.loadInboxMessages();

    const cernerFacilities = mockMixedCernerFacilitiesUser.data.attributes.vaProfile.facilities.filter(
      facility => facility.isCerner,
    );

    cy.get(Locators.ALERTS.CERNER_ALERT).should('be.visible');

    cy.contains('h2', 'Make sure you’re in the right health portal').should(
      'be.visible',
    );

    cy.get('[data-testid="cerner-facility"]').should(
      'have.length',
      cernerFacilities.length,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
