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

describe('Supporting Evidence uploads', () => {
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
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress).as(
      'saveInProgressForm',
    );
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload).as(
      'uploadFile',
    );
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
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.get(
      'input[type="checkbox"][name="root_view:selectableEvidenceTypes_view:hasPrivateMedicalRecords"]',
    ).check({
      force: true,
    });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting Evidence > B. 1. Private medical records
    // ==========================================================
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting Evidence > B. 2. Private medical records
    // ==========================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // III. Supporting Evidence > B. 3. Upload - Private medical records
    // ================================================================
    cy.get('input[type="file"]').selectFile(
      'src/applications/disability-benefits/all-claims/tests/fixtures/data/foo_protected.PDF',
      { force: true },
    );

    cy.findByText(/foo_protected.PDF/i).should('exist');

    cy.get('.schemaform-file-uploading').should('not.exist');

    // III. Supporting Evidence > B. 4. Add Password - Private medical records
    // ======================================================================
    cy.findByText(
      /This is an encrypted PDF document. In order for us to be able to view the document, we will need the password to decrypt it./,
    ).should('exist');
    cy.get('input[name="get_password_0"]').focus();
    cy.get('input[name="get_password_0"]').should('exist');
    cy.get('input[name="get_password_0"]').blur();

    cy.get('input[name="get_password_0"]').should('be.visible');
    cy.get('va-button[text="Add password"]').should('be.visible');

    // Enter password
    cy.get('input[name="get_password_0"]').clear();
    cy.get('input[name="get_password_0"]').type('dancing');

    cy.get('va-button[text="Add password"]').then($btn => {
      const webComponent = $btn[0];
      const shadowButton = webComponent.shadowRoot.querySelector('button');
      cy.get(shadowButton).should('be.visible');
      cy.get(shadowButton).focus();
      shadowButton.click({ force: true });
      cy.log('shadow button');
    });

    cy.wait('@uploadFile').then(({ _request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log('File upload successful');
    });
    cy.get('strong')
      .contains('The PDF password has been added.')
      .should('be.visible');

    cy.get('select')
      .contains('option', 'Medical Treatment Record - Non-Government Facility')
      .parent()
      .select('L049');

    cy.wait('@saveInProgressForm').then(({ _request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log('File Type selection successful');
    });

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
    cy.get('input[name="veteran-signature"]')
      .should('be.visible')
      .and('not.be.disabled');

    cy.get('input[name="veteran-signature"]').clear();
    cy.get('input[name="veteran-signature"]').type('Mark Tux Polarbear');
    cy.get('input[name="veteran-signature"]').blur();
    cy.get('input[type="checkbox"][name="veteran-certify"]')
      .should('be.visible')
      .and('not.be.disabled')
      .check({
        force: true,
      });

    // VI. Submit application
    // ======================
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
    ).as('submitClaim');
    cy.findByText('Submit application', {
      selector: 'button',
    }).click();
  });

  it('submits an encrypted PDF', () => {
    cy.injectAxeThenAxeCheck();
    cy.wait('@submitClaim').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      const privateMedicalRecord = request.body.form526.attachments[0];
      const { name, isEncrypted, attachmentId } = privateMedicalRecord;

      expect(name).to.equal('foo_protected.PDF');
      expect(isEncrypted).to.equal(true);
      expect(attachmentId).to.equal('L049');
    });
  });
});
