import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import allergiesV2Data from '../fixtures/allergies/uhd.json';
import allergiesV1Data from '../fixtures/allergies/sample-lighthouse.json';
import oracleHealthUser from '../fixtures/user/oracle-health.json';

describe('Allergy Details with 3-Path Routing', () => {
  const site = new MedicalRecordsSite();

  describe('Path 1: V2 SCDF endpoint (Accelerated)', () => {
    beforeEach(() => {
      site.login();
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingAllergies: true,
      });
    });

    it('displays v2 unified allergy detail correctly', () => {
      const allergyId = allergiesV2Data.data[0].id;

      cy.intercept(
        'GET',
        `/my_health/v2/medical_records/allergies/${allergyId}`,
        allergiesV2Data.data[0],
      ).as('v2-allergy-detail');

      cy.visit(`/my-health/medical-records/allergies/${allergyId}`);

      cy.wait('@v2-allergy-detail');

      cy.injectAxeThenAxeCheck();

      cy.get('h1').should('contain', 'penicillins');
      cy.contains('Medication').should('be.visible');
      cy.contains('February 25, 2025').should('be.visible');
      cy.contains('Urticaria (Hives)').should('be.visible');
    });
  });

  describe('Path 2: V1 Oracle Health endpoint (Cerner users)', () => {
    beforeEach(() => {
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: false,
        isAcceleratingAllergies: false,
      });
    });

    it('displays OH allergy detail with use_oh_data_path parameter', () => {
      const allergyId = '7006';

      cy.intercept(
        'GET',
        `/my_health/v1/medical_records/allergies/${allergyId}*`,
        req => {
          expect(req.url).to.contain('use_oh_data_path=1');
          req.reply(allergiesV1Data.entry[0].resource);
        },
      ).as('oh-allergy-detail');

      cy.visit(`/my-health/medical-records/allergies/${allergyId}`);

      cy.wait('@oh-allergy-detail');

      cy.injectAxeThenAxeCheck();

      cy.get('h1').should('exist');
      cy.contains('Date entered').should('be.visible');
    });
  });

  describe('Path 3: V1 regular VistA endpoint', () => {
    beforeEach(() => {
      site.login();
      site.mockFeatureToggles({
        isAcceleratingEnabled: false,
        isAcceleratingAllergies: false,
      });
    });

    it('displays VistA allergy detail without OH parameter', () => {
      const allergyId = '7006';

      cy.intercept(
        'GET',
        `/my_health/v1/medical_records/allergies/${allergyId}*`,
        req => {
          expect(req.url).to.not.contain('use_oh_data_path=1');
          req.reply(allergiesV1Data.entry[0].resource);
        },
      ).as('vista-allergy-detail');

      cy.visit(`/my-health/medical-records/allergies/${allergyId}`);

      cy.wait('@vista-allergy-detail');

      cy.injectAxeThenAxeCheck();

      cy.get('h1').should('exist');
      cy.contains('Date entered').should('be.visible');
      cy.get('[data-testid="allergy-type"]').should('exist');
    });
  });

  describe('Priority: Acceleration over Cerner', () => {
    beforeEach(() => {
      site.login(oracleHealthUser, false);
      site.mockFeatureToggles({
        isAcceleratingEnabled: true,
        isAcceleratingAllergies: true,
      });
    });

    it('uses v2 endpoint when both acceleration and Cerner are true', () => {
      const allergyId = allergiesV2Data.data[0].id;

      cy.intercept(
        'GET',
        `/my_health/v2/medical_records/allergies/${allergyId}`,
        allergiesV2Data.data[0],
      ).as('v2-priority-detail');

      cy.intercept('GET', '/my_health/v1/medical_records/allergies/*', _req => {
        throw new Error(
          'Should not call v1 endpoint when acceleration is enabled',
        );
      });

      cy.visit(`/my-health/medical-records/allergies/${allergyId}`);

      cy.wait('@v2-priority-detail');

      cy.injectAxeThenAxeCheck();

      cy.get('h1').should('contain', 'penicillins');
    });
  });
});
