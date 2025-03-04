import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';

import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Secure Messaging Inbox Cerner', () => {
  it('verify cerner facilities displays in alert banner', () => {
    SecureMessagingSite.login(
      mockFeatureToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();

    const cernerFacilities = mockMixedCernerFacilitiesUser.data.attributes.vaProfile.facilities.filter(
      facility => facility.isCerner,
    );

    cy.get(Locators.ALERTS.CERNER_ALERT).should('be.visible');

    cy.contains(
      'h2',
      'To send a secure message to a provider at these facilities, go to My VA Health',
    ).should('be.visible');

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
