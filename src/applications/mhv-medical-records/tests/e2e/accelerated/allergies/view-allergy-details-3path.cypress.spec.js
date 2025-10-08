import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Allergies from '../pages/Allergies';
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
      Allergies.setIntercepts({ allergiesData: allergiesV2Data });
    });

    it('displays v2 unified allergy detail correctly', () => {
      site.loadPage();
      Allergies.goToAllergiesPage();

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified format on list page
      cy.get('[data-testid="record-list-item"]')
        .first()
        .within(() => {
          cy.get('a').should('contain', 'penicillins');
          cy.contains('Date entered:').should('be.visible');
        });

      // Click on first allergy to go to detail page
      Allergies.selectAllergy({ index: 0 });

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified detail page
      cy.url().should('include', '/allergies/');
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

      // Intercept list call with OH path
      cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
        if (!req.url.includes(`/${allergyId}`)) {
          expect(req.url).to.contain('use_oh_data_path=1');
          req.reply(allergiesV1Data);
        }
      }).as('oh-allergies-list');

      // Intercept detail call with OH path
      cy.intercept(
        'GET',
        `/my_health/v1/medical_records/allergies/${allergyId}*`,
        req => {
          expect(req.url).to.contain('use_oh_data_path=1');
          req.reply(allergiesV1Data.entry[0].resource);
        },
      ).as('oh-allergy-detail');

      site.loadPage();
      cy.visit(`/my-health/medical-records/allergies/${allergyId}`);

      cy.wait('@oh-allergy-detail');

      cy.injectAxeThenAxeCheck();

      // Verify OH data format
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

      // Intercept list call WITHOUT OH path
      cy.intercept('GET', '/my_health/v1/medical_records/allergies*', req => {
        if (!req.url.includes(`/${allergyId}`)) {
          expect(req.url).to.not.contain('use_oh_data_path=1');
          req.reply(allergiesV1Data);
        }
      }).as('vista-allergies-list');

      // Intercept detail call WITHOUT OH path
      cy.intercept(
        'GET',
        `/my_health/v1/medical_records/allergies/${allergyId}*`,
        req => {
          expect(req.url).to.not.contain('use_oh_data_path=1');
          req.reply(allergiesV1Data.entry[0].resource);
        },
      ).as('vista-allergy-detail');

      site.loadPage();
      cy.visit(`/my-health/medical-records/allergies/${allergyId}`);

      cy.wait('@vista-allergy-detail');

      cy.injectAxeThenAxeCheck();

      // Verify VistA data format
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
      Allergies.setIntercepts({ allergiesData: allergiesV2Data });
    });

    it('uses v2 endpoint when both acceleration and Cerner are true', () => {
      // Ensure v1 endpoint is NOT called
      cy.intercept('GET', '/my_health/v1/medical_records/allergies/*', () => {
        throw new Error(
          'Should not call v1 endpoint when acceleration is enabled',
        );
      });

      site.loadPage();
      Allergies.goToAllergiesPage();

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified format on list (not v1 OH format)
      cy.get('[data-testid="record-list-item"]')
        .first()
        .within(() => {
          cy.get('a').should('contain', 'penicillins');
          cy.contains('Date entered:').should('be.visible');
        });

      // Click on first allergy to go to detail page
      Allergies.selectAllergy({ index: 0 });

      cy.injectAxeThenAxeCheck();

      // Verify v2 unified detail (acceleration takes priority over Cerner)
      cy.url().should('include', '/allergies/');
      cy.get('h1').should('contain', 'penicillins');
      cy.contains('Medication').should('be.visible');
    });
  });
});
