import path from 'path';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
// import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
// import mockUpload from './fixtures/mocks/document-upload.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { mockItf } from './cypress.helpers';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
} from '../constants';

// const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

    cy.intercept(
      'PUT',
      '/v0/disability_compensation_in_progress_forms/21-526EZ',
      req => {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              id: '21-526ez',
              type: 'in_progress_forms',
              attributes: {
                formId: '21-526ez',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: new Date().toISOString(),
                metadata: {
                  version: 1,
                  returnUrl:
                    '/disability/file-disability-claim-form-21-526ez/supporting-evidence/private-medical-records-upload',
                  savedAt: Date.now(),
                  expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
                  lastUpdated: Date.now(),
                },
              },
            },
          },
        });
      },
    ).as('saveInProgressForm');

    // Add this intercept specifically for password updates to files
    cy.intercept('PUT', '/v0/upload_supporting_evidence/*', req => {
      // Mock successful password addition to file
      req.reply({
        statusCode: 200,
        body: {
          data: {
            attributes: {
              confirmationCode: 'test-code',
              name: 'terminal-cheat-sheet_protected.PDF',
              isEncrypted: false, // Password accepted, no longer encrypted
              size: 12345,
              attachmentId: 'test-attachment-id',
            },
          },
        },
      });
    }).as('updateFilePassword');

    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
    cy.intercept('POST', '/v0/upload_supporting_evidence', req => {
      // Mock response indicating encrypted file
      req.reply({
        statusCode: 200,
        body: {
          data: {
            attributes: {
              confirmationCode: 'test-code',
              name: 'terminal-cheat-sheet_protected.PDF',
              isEncrypted: true, // This triggers password prompt
            },
          },
        },
      });
    }).as('uploadFile');

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
    cy.visit(
      'http://localhost:3001/disability/file-disability-claim-form-21-526ez/introduction',
    );
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
      '[type="checkbox"][name="root_toxicExposure_conditions_none"]',
    ).check({ force: true });

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
    // data-key="view:hasPrivateMedicalRecords"
    // va-checkbox
    cy.get(
      'input[type="checkbox"][name="root_view:selectableEvidenceTypes_view:hasPrivateMedicalRecords"]',
    ).check({
      force: true,
    });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Supporting Evidence > B. 1. Private medical records
    // ==========================================================
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // root_view:uploadPrivateRecordsQualifier_view:hasPrivateRecordsToUpload

    // IV. Supporting Evidence > B. 2. Private medical records
    // ==========================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Supporting Evidence > B. 3. Private medical records
    // ==========================================================
    cy.get('input[type="file"]').selectFile(
      'src/applications/disability-benefits/all-claims/tests/fixtures/data/terminal-cheat-sheet_protected.PDF',
      { force: true },
    );
    // cy.get('.schemaform-file-uploading').should('exist');
    cy.findByText(/terminal-cheat-sheet_protected.PDF/i).should('exist');
    // sends put to SIPF with update to privateMedicalRecordAttachments: file: {}, isEncrypted: true, name: 'filename.PDF'

    cy.get('.schemaform-file-uploading').should('not.exist');
    // cy.wait(100);
    cy.findByText(
      /This is an encrypted PDF document. In order for us to be able to view the document, we will need the password to decrypt it./,
    ).should('exist');
    cy.get('input[name="get_password_0"]').should('exist');
    cy.get('input[name="get_password_0"]').blur();
    // cy.wait(100);
    cy.get('input[name="get_password_0"]').should('be.visible');
    cy.get('va-button[text="Add password"]').should('be.visible');
    //  cy.wait(100);

    // cy.get('input[type="text"][name="get_password_0"]').clear().type('dancing');
    // Enter password
    cy.get('input[name="get_password_0"]')
      .clear()
      .type('dancing');
    // on adding password, then post to upload_supporting_documents (not sure what the request looks like)

    // Debug the button
    cy.get('va-button[text="Add password"]').then($btn => {
      const webComponent = $btn[0];

      // Try to access the shadow root
      if (webComponent.shadowRoot) {
        const shadowButton = webComponent.shadowRoot.querySelector('button');
        if (shadowButton) {
          shadowButton.click();
        }
      } else {
        // Fallback to direct click
        webComponent.click();
      }
    });

    // cy.get('input[name="get_password_0"]').type('{enter}');
    // cy.get('input[name="get_password_0"]').closest('form').submit();
    // on successfully clicking 'add password' another PUT to update the form with same data plus password: "dancing", uploading: true, isEncrypted: true
    // third put to update form has attachmentId still blank, confirmationCode, isEncrypted: true, name: "filename.PDF"
    // Fails here
    cy.get('strong')
      .contains('The PDF password has been added.')
      .should('be.visible');
    //   cy.get('va-radio')
    // .shadow()
    // .find('.usa-error-message')
    // .contains('You must choose a claim type');

    cy.get('[type="select"][value="L049"]').select(
      'Medical Treatment Record - Non-Government Facility',
    );
    // after this is selected, a fourth PUT captures the selection as 'attachmentId': 'L049'
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

  it('uploads and processes encrypted PDF with password', () => {
    cy.injectAxeThenAxeCheck();
    cy.wait('@submitClaim').then(({ request }) => {
      // Verify private medical records attachment with password
      expect(request.body.form526.privateRecordsAttachments).to.have.length(1);
      const attachment = request.body.form526.privateRecordsAttachments[0];
      expect(attachment.name).to.equal('terminal-cheat-sheet_protected.PDF');
      expect(attachment.isEncrypted).to.be.false; // Should be false after password added
      expect(attachment.docType).to.equal('L049');
      expect(attachment.confirmationCode).to.equal('test-code');
    });
  });

  it('successfully submits disability claim with encrypted PDF evidence', () => {
    cy.wait('@submitClaim').then(({ request }) => {
      cy.injectAxeThenAxeCheck();

      // Verify form submission structure
      expect(request.body.form526).to.exist;
      expect(request.body.form526.privateRecordsAttachments).to.have.length(1);

      // Verify the uploaded file details
      const attachment = request.body.form526.privateRecordsAttachments[0];
      expect(attachment.name).to.equal('terminal-cheat-sheet_protected.PDF');
      expect(attachment.isEncrypted).to.be.false;
      expect(attachment.docType).to.equal('L049');
    });
  });
});
