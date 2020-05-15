import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';

import formConfig from '../config/form';

import {
  mockUser,
  mockItf,
  mockDocumentUpload,
  mockPaymentInformation,
  mockApplicationSubmit,
} from './all-claims.cypress.helpers.js';

const testConfig = {
  dataPathPrefix: 'data',
  dataSets: ['minimal-test', 'newOnly-test', 'maximal-test'],
  fixtures: {
    data: path.join(__dirname, 'data'),
  },
  formConfig,
  pageHooks: {
    '/disability/file-disability-claim-form-21-526ez/introduction': () => {
      // Hit the start button
      cy.findAllByText(/start/i, { selector: 'button' })
        .first()
        .click();

      // Click past the ITF message
      cy.findByText(/continue/i, { selector: 'button' }).click();
    },
    '/disability/file-disability-claim-form-21-526ez/disabilities/rated-disabilities': () => {
      cy.get('@testData').then(data => {
        data.ratedDisabilities.forEach((disability, index) => {
          if (disability['view:selected']) {
            cy.get(`input[name="root_ratedDisabilities_${index}"]`).click();
          }
        });
        cy.findByText(/continue/i, { selector: 'button' }).click();
      });
    },
    '/disability/file-disability-claim-form-21-526ez/payment-information': () => {
      cy.get('@testData').then(data => {
        if (data['view:bankAccount']) {
          cy.get('form.rjsf').then($form => {
            const editButton = $form.find('.usa-button-primary.edit-button');
            if (editButton) editButton.click();
          });

          cy.fillPage();
          cy.findByText(/save/i, { selector: 'button' }).click();
        }

        cy.findByText(/continue/i, { selector: 'button' }).click();
      });
    },
  },
  setupPerTest: () => {
    // Set up signed in session.
    window.localStorage.setItem('hasSession', true);

    // Stub API endpoints.
    cy.route('GET', '/v0/user', mockUser)
      .route('GET', '/v0/intent_to_file', mockItf)
      .route('GET', '/v0/ppiu/payment_information', mockPaymentInformation)
      .route('POST', '/v0/upload_supporting_evidence', mockDocumentUpload)
      .route(
        'POST',
        '/v0/disability_compensation_form/submit_all_claim',
        mockApplicationSubmit,
      );

    // Pre-fill with the expected ratedDisabilities,
    // but without view:selected, since that's not pre-filled
    cy.get('@testData').then(data => {
      const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
        ({ 'view:selected': _, ...obj }) => obj,
      );

      cy.route('GET', 'v0/in_progress_forms/21-526EZ', {
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
  },
  url: '/disability/file-disability-claim-form-21-526ez',
};

testForm('523 all claims', testConfig);
