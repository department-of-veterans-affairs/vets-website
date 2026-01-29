import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockPretransitionedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';

import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Cerner', () => {
  it('verify cerner facilities displays in alert banner if pretransitioned', () => {
    SecureMessagingSite.login(
      mockFeatureToggles,
      mockEhrData,
      true,
      mockPretransitionedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.verifyCernerFacilityNames(
      mockPretransitionedCernerFacilitiesUser,
    );

    cy.contains(
      'h2',
      'To send a secure message to a provider at these facilities, go to My VA Health',
    ).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('verify cerner alert does not display if no pretransitioned facilities', () => {
    SecureMessagingSite.login(
      mockFeatureToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.verifyCernerFacilityNames(mockMixedCernerFacilitiesUser);

    cy.contains(
      'h2',
      'To send a secure message to a provider at these facilities, go to My VA Health',
    ).should('not.exist');

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
