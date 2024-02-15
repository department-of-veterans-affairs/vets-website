import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import noCernerFacilitiesUser from '../fixtures/userResponse/user.json';
import mockOneCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-all.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockEhrData from '../fixtures/vamc-ehr.json';

import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Cerner', () => {
  it('Displays warning with cerner facilities list for mixed Cerner Facilities', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login(true, mockMixedCernerFacilitiesUser, mockFacilities);
    landingPage.loadInboxMessages();
    landingPage.verifyCernerFacilityNames(
      mockMixedCernerFacilitiesUser,
      mockEhrData,
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

  it('Displays warning with cerner facilities list for one Cerner Facility', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login(true, mockOneCernerFacilitiesUser, mockFacilities);
    landingPage.loadInboxMessages();
    landingPage.verifyCernerFacilityNames(
      mockOneCernerFacilitiesUser,
      mockEhrData,
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

  it('Does not display warning with no cerner facilities', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login(true, noCernerFacilitiesUser, mockFacilities);
    landingPage.loadInboxMessages();
    landingPage.verifyCernerFacilityNames(noCernerFacilitiesUser, mockEhrData);
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
