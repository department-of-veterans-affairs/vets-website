import path from 'path';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import { expect } from 'chai';
import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
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
    // User authentication
    cy.intercept('GET', '/v0/user', mockUser);

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
      'GET',
      '/disability/file-disability-claim-form-21-526ez/review-and-submit',
      req => {
        req.reply({
          statusCode: 200,
        });
      },
    ).as('review-and-submit');

    cy.intercept(
      'PUT',
      '/v0/disability_compensation_in_progress_forms/21-526EZ',
      req => {
        req.reply({
          statusCode: 200,
          body: {
            formData: {
              privateMedicalRecordsAttachments: {
                isEncrypted: true,
                name: 'foo_protected.PDF',
                file: {},
              },
            },
            metadata: {
              version: 1,
              returnUrl:
                '/disability/file-disability-claim-form-21-526ez/supporting-evidence/private-medical-records-upload',
              savedAt: Date.now(),
              expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
              lastUpdated: Date.now(),
            },
          },
        });
      },
    ).as('saveInProgressFormAddedFile');

    cy.intercept(
      'PUT',
      '/v0/disability_compensation_in_progress_forms/21-526EZ',
      req => {
        req.reply({
          statusCode: 200,
          body: {
            formData: {
              privateMedicalRecordsAttachments: {
                isEncrypted: true,
                name: 'foo_protected.PDF',
                password: 'dancing',
                uploading: true,
              },
            },
            metadata: {
              version: 1,
              returnUrl:
                '/disability/file-disability-claim-form-21-526ez/supporting-evidence/private-medical-records-upload',
              savedAt: Date.now(),
              expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
              lastUpdated: Date.now(),
            },
          },
        });
      },
    ).as('saveInProgressFormAddedPassword');

    cy.intercept(
      'PUT',
      '/v0/disability_compensation_in_progress_forms/21-526EZ',
      req => {
        req.reply({
          statusCode: 200,
          body: {
            formData: {
              attachmentId: '',
              confirmationCode: 'kdfjaadsf',
              isEncrypted: true,
              name: 'foo_protected.PDF',
            },
            metadata: {
              version: 1,
              returnUrl:
                '/disability/file-disability-claim-form-21-526ez/supporting-evidence/private-medical-records-upload',
              savedAt: Date.now(),
              expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
              lastUpdated: Date.now(),
            },
          },
        });
      },
    ).as('saveInProgressFormconfirmedFilePassword');

    cy.intercept(
      'PUT',
      '/v0/disability_compensation_in_progress_forms/21-526EZ',
      req => {
        req.reply({
          statusCode: 200,
          body: {
            formData: {
              privateMedicalRecordsAttachments: {
                attachmentId: 'L049',
                confirmationCode: 'kdfjaadsf',
                isEncrypted: true,
                name: 'foo_protected.PDF',
              },
              additionalDocuments: {
                attachmentId: 'L015',
                confirmationCode: 'kdfjaadsf',
                isEncrypted: true,
                name: 'foo_protected.PDF',
              },
            },
            metadata: {
              version: 1,
              returnUrl:
                '/disability/file-disability-claim-form-21-526ez/supporting-evidence/additional-evidence',
              savedAt: Date.now(),
              expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
              lastUpdated: Date.now(),
            },
          },
        });
      },
    ).as('saveInProgressFormAdditionalDocFileTypeAdded');

    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/submission_status/*',
      {
        statusCode: 200,
        body: { data: { attributes: { status: 'pending' } } },
      },
    ).as('submissionStatus');

    cy.intercept(
      'PUT',
      '/v0/disability_compensation_in_progress_forms/21-526EZ',
      req => {
        req.reply({
          statusCode: 200,
          body: {
            formData: {
              privateMedicalRecordsAttachments: {
                attachmentId: 'L049',
                confirmationCode: 'kdfjaadsf',
                isEncrypted: true,
                name: 'foo_protected.PDF',
              },
            },
            metadata: {
              version: 1,
              returnUrl:
                '/disability/file-disability-claim-form-21-526ez/supporting-evidence/private-medical-records-upload',
              savedAt: Date.now(),
              expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
              lastUpdated: Date.now(),
            },
          },
        });
      },
    ).as('saveInProgressFormAddedFileType');
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
    cy.intercept('POST', '/v0/upload_supporting_evidence', req => {
      req.reply({
        body: {
          data: {
            attributes: {
              guid: 'test-guid-12345',
            },
            id: '11',
            type: 'supporting_evidence_attachments',
          },
        },
      });
    }).as('uploadFile');

    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim',
      mockSubmit,
    ).as('submitClaim');

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
    cy.get(
      'input[type="checkbox"][name="root_view:selectableEvidenceTypes_view:hasPrivateMedicalRecords"]',
    ).check({
      force: true,
    });

    cy.get(
      'input[type="checkbox"][name="root_view:selectableEvidenceTypes_view:hasOtherEvidence"]',
    ).check({
      force: true,
    });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Supporting Evidence > B. 1. Private medical records
    // ==========================================================
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Supporting Evidence > B. 2. Private medical records
    // ==========================================================
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Supporting Evidence > B. 3. Upload - Private medical records
    // ==========================================================
    cy.get('input[type="file"]').selectFile(
      'src/applications/disability-benefits/all-claims/tests/fixtures/data/foo_protected.PDF',
      { force: true },
    );

    cy.findByText(/foo_protected.PDF/i).should('exist');

    cy.get('.schemaform-file-uploading').should('not.exist');

    // IV. Supporting Evidence > B. 4. Add Password - Private medical records
    // ==========================================================
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

    cy.wait('@saveInProgressFormAddedFileType').then(
      ({ _request, response }) => {
        expect(response.statusCode).to.eq(200);
        cy.log('File Type selection successful');
      },
    );

    cy.findByText(/continue/i, { selector: 'button' }).click();

    // IV. Supporting Evidence > B. Upload other evidence
    // =================================================

    cy.get('input[type="file"]').selectFile(
      'src/applications/disability-benefits/all-claims/tests/fixtures/data/foo_protected.PDF',
      { force: true },
    );

    cy.findByText(/foo_protected.PDF/i).should('exist');

    cy.get('.schemaform-file-uploading').should('not.exist');

    // IV. Supporting Evidence > B. 4. Add Password - Other evidence
    // ==========================================================
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
      .contains('option', 'Buddy/Lay Statement')
      .parent()
      .select('L015');
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
      .clear()
      .type('Mark Tux Polarbear');
    cy.get('input[type="checkbox"][name="veteran-certify"]').check({
      force: true,
    });

    // Check for validation errors before submitting
    cy.get('.usa-input-error').should('not.exist');
    cy.get('.input-error-date').should('not.exist');
    cy.get('[aria-invalid="true"]').should('not.exist');

    // Ensure form is ready for submission
    cy.get('input[name="veteran-signature"]').should(
      'have.value',
      'Mark Tux Polarbear',
    );
    cy.get('input[type="checkbox"][name="veteran-certify"]').should(
      'be.checked',
    );

    // Wait for any auto-save to complete
    cy.wait('@saveInProgressFormAddedFileType', { timeout: 10000 }).then(
      ({ response }) => {
        expect(response.statusCode).to.eq(200);
      },
    );
    // VI. Submit application
    // ======================

    cy.findByText('Submit application', {
      selector: 'button',
      timeout: 10000,
    })
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });

    // Check for error messages
    cy.get('.usa-alert-error').should('not.exist');
    cy.get('[data-testid="error-message"]').should('not.exist');
  });

  it('uploads and processes encrypted PDF with password for Private Medical Records', () => {
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

  it('uploads and processes encrypted PDF with password for Additional Documents', () => {
    cy.injectAxeThenAxeCheck();
    cy.wait('@submitClaim').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      const additionalDoc = request.body.form526.attachments[1];
      const { name, isEncrypted, attachmentId } = additionalDoc;

      expect(name).to.equal('foo_protected.PDF');
      expect(isEncrypted).to.equal(true);
      expect(attachmentId).to.equal('L015');
    });
  });
});
