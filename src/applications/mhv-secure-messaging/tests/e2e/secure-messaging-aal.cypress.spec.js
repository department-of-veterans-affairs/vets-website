import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockEhrData from './fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockMixedCernerFacilitiesUser from './fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from './fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockFeatureToggles from './fixtures/toggles-response.json';

for (let i = 0; i < 20; i++) {
  describe(' Secure Messaging AAL', () => {
    const customFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_milestone_2_aal',
        value: true,
      },
    ]);

    it('should submit API call to log Launch Messages AAL', () => {
      SecureMessagingSite.login(customFeatureToggles);
      cy.intercept('POST', '/my_health/v1/aal', {
        statusCode: 204,
      }).as('submitLaunchMessagingAal');
      PatientInboxPage.loadInboxMessages();
      cy.wait('@submitLaunchMessagingAal').then(interception => {
        expect(interception.request.body).to.deep.equal({
          aal: {
            activityType: 'Messages',
            action: 'Launch Messages',
            performerType: 'Self',
            status: '1',
          },
          product: 'sm',
          oncePerSession: true,
        });
      });
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('should not submit API call to log Launch Messages AAL when feature flag is disabled', () => {
      SecureMessagingSite.login();
      cy.intercept('POST', '/my_health/v1/aal', {
        statusCode: 204,
      }).as('submitLaunchMessagingAal');
      PatientInboxPage.loadInboxMessages();
      cy.get('@submitLaunchMessagingAal.all').should('have.length', 0);
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('should submit API call to log Launch My VA Health AAL', () => {
      SecureMessagingSite.login(
        customFeatureToggles,
        mockEhrData,
        true,
        mockMixedCernerFacilitiesUser,
        mockFacilities,
      );
      cy.intercept('POST', '/my_health/v1/aal', {
        statusCode: 204,
      }).as('submitLaunchMessagingAal');
      PatientInboxPage.loadInboxMessages();

      cy.get(Locators.ALERTS.CERNER_ALERT)
        .find('a')
        .click();
      cy.get('@submitLaunchMessagingAal.all').then(interceptions => {
        const latestInterception = interceptions[interceptions.length - 1];
        expect(latestInterception.request.body).to.deep.equal({
          aal: {
            activityType: 'Messaging',
            action: 'Launch My VA Health',
            performerType: 'Self',
            status: '1',
          },
          product: 'sm',
        });
      });
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('should not submit API call to log Launch My VA Health AAL when feature flag is disabled', () => {
      SecureMessagingSite.login(
        mockFeatureToggles,
        mockEhrData,
        true,
        mockMixedCernerFacilitiesUser,
        mockFacilities,
      );
      cy.intercept('POST', '/my_health/v1/aal', {
        statusCode: 204,
      }).as('submitLaunchMessagingAal');
      PatientInboxPage.loadInboxMessages();

      cy.get(Locators.ALERTS.CERNER_ALERT)
        .find('a')
        .click();
      cy.get('@submitLaunchMessagingAal.all').should('have.length', 0);
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });
}
