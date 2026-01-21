import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Allergies from '../pages/Allergies';
import AllergiesIntercepts from '../pages/AllergiesIntercepts';
import allergiesV2Data from '../fixtures/allergies/uhd.json';
import allergiesV1Data from '../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../fixtures/user/oracle-health.json';

describe('Allergy Details with 3-Path Routing', () => {
  const site = new MedicalRecordsSite();

  describe('Path 1: V2 SCDF endpoint (Accelerated)', () => {
    beforeEach(() => {
      // Acceleration requires isCerner, so use oracleHealthUser
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingAllergies: true,
      });
      AllergiesIntercepts.setupV2Intercepts(allergiesV2Data);
    });

    it('displays v2 unified allergy detail correctly', () => {
      site.loadPage();
      Allergies.goToAllergiesPage();

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified format on list page (Penicillin is at index 6 after date sorting)
      Allergies.verifyListItemName({ index: 6, name: 'Penicillin' });

      // Click on Penicillin allergy to go to detail page
      Allergies.selectAllergy({ index: 6 });

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified detail page
      Allergies.verifyDetailPageHeader('Penicillin');
      Allergies.verifyV2UnifiedFormat();
      Allergies.verifyDetailPageContent(['2002', 'Urticaria (Hives)']);
    });
  });

  describe('Path 2: V1 Oracle Health endpoint (Cerner users)', () => {
    beforeEach(() => {
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: false,
        isAcceleratingAllergies: false,
      });
      AllergiesIntercepts.setupOracleHealthIntercepts(allergiesV1Data);
    });

    it('displays OH allergy detail with use_oh_data_path parameter', () => {
      site.loadPage();
      Allergies.goToAllergiesPage();

      cy.injectAxeThenAxeCheck();

      // Verify OH format on list
      Allergies.verifyFirstListItem();

      // Go to detail page
      Allergies.selectAllergy({ index: 0 });

      cy.injectAxeThenAxeCheck();

      // Verify OH data format on detail
      Allergies.verifyOHFormat();
    });
  });

  describe('Path 3: V1 regular VistA endpoint', () => {
    beforeEach(() => {
      site.login();
      site.mockFeatureToggles({
        isAcceleratingEnabled: false,
        isAcceleratingAllergies: false,
      });
      AllergiesIntercepts.setupVistaIntercepts(allergiesV1Data);
    });

    it('displays VistA allergy detail without OH parameter', () => {
      site.loadPage();
      Allergies.goToAllergiesPage();

      cy.injectAxeThenAxeCheck();

      // Verify VistA format on list
      Allergies.verifyFirstListItem();

      // Go to detail page
      Allergies.selectAllergy({ index: 0 });

      cy.injectAxeThenAxeCheck();

      // Verify VistA data format on detail
      Allergies.verifyOHFormat();
      Allergies.verifyVistaFormat();
    });
  });

  describe('Priority: Acceleration over Cerner', () => {
    beforeEach(() => {
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingAllergies: true,
      });
      AllergiesIntercepts.setupV2Intercepts(allergiesV2Data);
      AllergiesIntercepts.blockV1Endpoint();
    });

    it('uses v2 endpoint when both acceleration and Cerner are true', () => {
      site.loadPage();
      Allergies.goToAllergiesPage();

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified format on list (not v1 OH format) - Penicillin is at index 6
      Allergies.verifyListItemName({ index: 6, name: 'Penicillin' });

      // Click on Penicillin allergy to go to detail page
      Allergies.selectAllergy({ index: 6 });

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified detail (acceleration takes priority over Cerner)
      Allergies.verifyDetailPageHeader('Penicillin');
      Allergies.verifyV2UnifiedFormat();
    });
  });
});
