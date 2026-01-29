import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import noCernerFacilitiesUser from '../fixtures/userResponse/user.json';
import mockOneCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-all.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';

import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Cerner', () => {
  it('Displays warning with cerner facilities list for mixed Cerner Facilities', () => {
    SecureMessagingSite.login(
      mockFeatureToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.verifyCernerFacilityNames(
      mockMixedCernerFacilitiesUser,
      mockEhrData,
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('Displays warning with cerner facilities list for one Cerner Facility', () => {
    SecureMessagingSite.login(
      mockFeatureToggles,
      mockEhrData,
      true,
      mockOneCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.verifyFilterMessageHeadingText();
    PatientInboxPage.verifyCernerFacilityNames(
      mockOneCernerFacilitiesUser,
      mockEhrData,
    );
    PatientInboxPage.verifyAddFilterButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('Does not display warning with no cerner facilities', () => {
    SecureMessagingSite.login(
      mockFeatureToggles,
      mockEhrData,
      true,
      noCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.verifyCernerFacilityNames(
      noCernerFacilitiesUser,
      mockEhrData,
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
