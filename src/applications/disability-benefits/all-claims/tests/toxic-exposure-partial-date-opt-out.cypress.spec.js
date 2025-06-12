import path from 'path';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { mockItf } from './cypress.helpers';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
} from '../constants';

const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('Toxic exposure date handling when reverting condition association', () => {
  beforeEach(() => {
    window.sessionStorage.setItem(SHOW_8940_4192, 'true');
    window.sessionStorage.removeItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);

    cy.login(mockUser);

    cy.intercept('GET', '/data/cms/vamc-ehr.json', { body: {} });
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept(
      'GET',
      '/v0/benefits_reference_data/service-branches',
      mockServiceBranches,
    );
    cy.intercept('GET', '/v0/intent_to_file', mockItf());
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
      mockSubmit,
    );
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/submission_status/*',
      '',
    );
    cy.fixture(
      path.join(__dirname, 'fixtures/data/maximal-toxic-exposure-test.json'),
    ).then(data => {
      const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
        ({ 'view:selected': _, ...obj }) => obj,
      );

      cy.intercept('GET', `${MOCK_SIPS_API}*`, {
        formData: {
          veteran: {
            primaryPhone: '4445551212',
            emailAddress: 'test2@test1.net',
          },
          disabilities: sanitizedRatedDisabilities,
        },
        metadata: {
          version: 0,
          prefill: true,
          returnUrl: '/veteran-information',
        },
      });
    });

    let idRoot = '';
    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.get('.skip-wizard-link').click();

    // Start the application
    cy.contains('a', 'Start the Disability Compensation Application').click();
    cy.get('.usa-button-primary').click();

    // Continue to file
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > A. Personal information
    // ===========================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > B. Contact information
    // ===========================================
    idRoot = '#root_mailingAddress_';
    cy.get('[type="checkbox"]').uncheck({ force: true });
    cy.get(`${idRoot}addressLine1`).type('123 Main St');
    cy.get(`${idRoot}city`).type('Tucson');
    cy.get(`${idRoot}state`).select('Arizona');
    cy.get(`${idRoot}zipCode`).type('11111');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > C. Housing situation
    // =========================================
    cy.get('[type="radio"][value="no"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > D. Terminally ill
    // ======================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > E. Alternative names
    // =========================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > F. Military history
    // ========================================
    idRoot = '#root_serviceInformation_servicePeriods_';
    cy.get(`${idRoot}0_serviceBranch`).select('Marine Corps');
    cy.get(`${idRoot}0_dateRange_fromMonth`).select('May');
    cy.get(`${idRoot}0_dateRange_fromDay`).select('20');
    cy.get(`${idRoot}0_dateRange_fromYear`).type('1984');
    cy.get(`${idRoot}0_dateRange_toMonth`).select('May');
    cy.get(`${idRoot}0_dateRange_toDay`).select('20');
    cy.get(`${idRoot}0_dateRange_toYear`).type('2011');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Information > G. Separation pay
    // ==========================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Information > H. Retirement pay
    // ==========================================
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Information > I. Training pay
    // ========================================
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > A. Add a new condition
    // =======================================
    idRoot = '#root_newDisabilities_0_condition';
    cy.typeInIfDataExists(`${idRoot}`, 'asthma');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > B. Follow up
    // =============================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > C. Description
    // ===============================
    cy.get('[type="radio"][id="root_cause_0"]').check({ force: true });
    cy.get('#root_primaryDescription').type('Description');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > D. Toxic exposure (conditions)
    // ===============================================
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_conditions_asthma"]',
    ).check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > D. Toxic exposure: Service after August 2, 1990
    // ================================================================
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_gulfWar1990_iraq"]',
    ).check({ force: true });
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_gulfWar1990_oman"]',
    ).check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // 1. Location 1 of 2: Iraq
    // ===============================
    // Enter only the year for an end date field
    cy.get(
      'select[name="root_toxicExposure_gulfWar1990Details_iraq_startDateMonth"]',
    ).select('July');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_iraq_startDateDay"]',
    ).type('11');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_iraq_startDateYear"]',
    ).type('1992');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_iraq_endDateYear"]',
    ).type('1992');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_iraq_endDateYear"]',
    ).blur();
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_iraq_endDateYear"]',
    ).clear();
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_iraq_endDateYear"]',
    ).type('1993');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // 2. Location 2 of 2: Oman
    // ========================
    // Enter valid start and end date
    cy.get(
      'select[name="root_toxicExposure_gulfWar1990Details_oman_startDateMonth"]',
    ).select('July');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_oman_startDateDay"]',
    ).type('11');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_oman_startDateYear"]',
    ).type('1991');
    cy.get(
      'select[name="root_toxicExposure_gulfWar1990Details_oman_endDateMonth"]',
    ).select('July');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_oman_endDateDay"]',
    ).type('11');
    cy.get(
      'input[name="root_toxicExposure_gulfWar1990Details_oman_endDateYear"]',
    ).type('1993');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Return to Toxic exposure (conditions) page
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.findByText(/back/i, { selector: 'button' }).click();

    // II. Conditions > D. Toxic exposure (conditions)
    // ===============================================
    // Deselect "asthma"
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_conditions_asthma"]',
    ).uncheck({ force: true });

    // Select "none"
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_conditions_none"]',
    ).check({ force: true });

    // Continue in the form
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > E. Prisioner of War
    // ====================================
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > E. Additional disability benefits
    // ==================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > F. Summary of conditions
    // =========================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > A. Supporting evidence for your disability claim
    // ===========================================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > B. Types of supporting evidence
    // ==========================================================
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > C. Summary of evidence
    // =================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > D. Next steps in your claim process
    // ==============================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Additional information > A. Add a new bank account
    // ======================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Additional information > B. Currently a VA employee
    // ========================================================
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Additional information > C. Fully developed claim program
    // =============================================================
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // V. Review application
    // =====================
    cy.get('input[name="veteran-signature"]').type('Mark Tux Polarbear');
    cy.get('input[type="checkbox"][name="veteran-certify"]').check({
      force: true,
    });

    // Submit application
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
    ).as('submitClaim');
    cy.get('button#4-continueButton').click();
  });

  it('submits a partial date for a toxic exposure location', () => {
    cy.injectAxeThenAxeCheck();
    cy.wait('@submitClaim').then(({ request }) => {
      const gulfDetails = request.body.form526.toxicExposure.gulfWar1990Details;
      const iraqStart = gulfDetails.iraq.startDate;
      const iraqEnd = gulfDetails.iraq.endDate;

      expect(iraqStart).to.match(FULL_DATE, 'Iraq startDate is complete');
      expect(iraqEnd).to.not.match(FULL_DATE, 'Iraq endDate is partial');
    });
  });

  it('submits complete dates for a toxic exposure location', () => {
    cy.wait('@submitClaim').then(({ request }) => {
      cy.injectAxeThenAxeCheck();
      const gulfDetails = request.body.form526.toxicExposure.gulfWar1990Details;
      const omanStart = gulfDetails.oman.startDate;
      const omanEnd = gulfDetails.oman.endDate;

      expect(omanStart).to.match(FULL_DATE, 'Oman startDate is complete');
      expect(omanEnd).to.match(FULL_DATE, 'Oman endDate is complete');
    });
  });
});
