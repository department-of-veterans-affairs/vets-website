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

/**
 * TODO: Re-enable this test once partial date support is added back
 * Currently, the frontend validation prevents partial dates from being submitted.
 * @see https://github.com/orgs/department-of-veterans-affairs/projects/1683/views/9?filterQuery=partial&pane=issue&itemId=115699524&issue=department-of-veterans-affairs%7Cva.gov-team%7C112288
 */
describe.skip('Toxic exposure date handling when reverting condition association', () => {
  beforeEach(() => {
    // Setup session storage
    window.sessionStorage.setItem(SHOW_8940_4192, 'true');
    window.sessionStorage.removeItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);

    // Login
    cy.login(mockUser);
  });

  const setupIntercepts = () => {
    // Setup all intercepts with proper configuration
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { body: {} }).as('cmsData');
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept(
      'GET',
      '/v0/benefits_reference_data/service-branches',
      mockServiceBranches,
    ).as('serviceBranches');
    cy.intercept('GET', '/v0/intent_to_file', mockItf()).as('intentToFile');
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress).as(
      'saveInProgress',
    );
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    ).as('separationLocations');
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment).as(
      'paymentInfo',
    );
    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload).as(
      'uploadEvidence',
    );
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
      mockSubmit,
    ).as('submitClaim');
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/submission_status/*',
      '',
    ).as('submissionStatus');

    // Load test data and setup form data intercept
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
      }).as('formData');
    });
  };

  const fillVeteranDetails = () => {
    // I. Veteran Details > A. Personal information
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > B. Contact information
    cy.get('[type="checkbox"]').uncheck({ force: true });
    cy.get('#root_mailingAddress_addressLine1').type('123 Main St');
    cy.get('#root_mailingAddress_city').type('Tucson');
    cy.get('#root_mailingAddress_state').select('Arizona');
    cy.get('#root_mailingAddress_zipCode').type('11111');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > C. Housing situation
    cy.get('[type="radio"][value="no"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > D. Terminally ill
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > E. Alternative names
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Details > F. Military history
    cy.get('#root_serviceInformation_servicePeriods_0_serviceBranch').select(
      'Marine Corps',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromMonth',
    ).select('May');
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromDay',
    ).select('20');
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_fromYear').type(
      '1984',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_toMonth',
    ).select('May');
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_toDay').select(
      '20',
    );
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_toYear').type(
      '2011',
    );
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Information > G. Separation pay
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Information > H. Retirement pay
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // I. Veteran Information > I. Training pay
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
  };

  const fillConditionsAndToxicExposure = () => {
    // II. Conditions > A. Add a new condition
    const idRoot = '#root_newDisabilities_0_condition';
    cy.typeInIfDataExists(`${idRoot}`, 'asthma');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > B. Follow up
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > C. Description
    cy.get('[type="radio"][id="root_cause_0"]').check({ force: true });
    cy.get('#root_primaryDescription').type('Description');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > D. Toxic exposure (conditions)
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_conditions_asthma"]',
    ).check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > D. Toxic exposure: Service after August 2, 1990
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_gulfWar1990_iraq"]',
    ).check({ force: true });
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_gulfWar1990_oman"]',
    ).check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // 1. Location 1 of 2: Iraq - Enter partial date
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
    ).type('1993');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // 2. Location 2 of 2: Oman - Enter complete dates
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
  };

  const revertConditionAssociation = () => {
    // Navigate back to toxic exposure conditions page
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.findByText(/back/i, { selector: 'button' }).click();

    // Deselect "asthma" and select "none"
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_conditions_asthma"]',
    ).uncheck({ force: true });
    cy.get(
      '[type="checkbox"][name="root_toxicExposure_conditions_none"]',
    ).check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
  };

  const completeFinalSections = () => {
    // II. Conditions > E. Prisoner of War
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > E. Additional disability benefits
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // II. Conditions > F. Summary of conditions
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > A. Supporting evidence for your disability claim
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > B. Types of supporting evidence
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > C. Summary of evidence
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting evidence > D. Next steps in your claim process
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Additional information > A. Add a new bank account
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Additional information > B. Currently a VA employee
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Additional information > C. Fully developed claim program
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // V. Review application
    cy.get('input[name="veteran-signature"]').type('Mark Tux Polarbear');
    cy.get('input[type="checkbox"][name="veteran-certify"]').check({
      force: true,
    });
  };

  const fillCompleteForm = () => {
    // Setup all intercepts
    setupIntercepts();

    // Navigate to the form
    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.get('.skip-wizard-link').click();

    // Start the application
    cy.contains('a', 'Start the Disability Compensation Application').click();
    cy.get('.usa-button-primary').click();

    // Continue to file
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Complete all form sections
    fillVeteranDetails();
    fillConditionsAndToxicExposure();
    revertConditionAssociation();
    completeFinalSections();
  };

  it('submits a partial date for a toxic exposure location', () => {
    fillCompleteForm();

    // Submit application and verify
    cy.findByText(/submit/i, { selector: 'button' }).click();

    cy.wait('@submitClaim', { timeout: 10000 }).then(({ request }) => {
      const gulfDetails = request.body.form526.toxicExposure.gulfWar1990Details;
      const iraqStart = gulfDetails.iraq.startDate;
      const iraqEnd = gulfDetails.iraq.endDate;

      expect(iraqStart).to.match(FULL_DATE, 'Iraq startDate is complete');
      expect(iraqEnd).to.not.match(FULL_DATE, 'Iraq endDate is partial');
    });

    cy.injectAxeThenAxeCheck();
  });

  it('submits complete dates for a toxic exposure location', () => {
    fillCompleteForm();

    // Submit application and verify
    cy.findByText(/submit/i, { selector: 'button' }).click();

    cy.wait('@submitClaim', { timeout: 10000 }).then(({ request }) => {
      const gulfDetails = request.body.form526.toxicExposure.gulfWar1990Details;
      const omanStart = gulfDetails.oman.startDate;
      const omanEnd = gulfDetails.oman.endDate;

      expect(omanStart).to.match(FULL_DATE, 'Oman startDate is complete');
      expect(omanEnd).to.match(FULL_DATE, 'Oman endDate is complete');
    });

    cy.injectAxeThenAxeCheck();
  });
});
