import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'confirmation-stem-test'],
    fixtures: { data: path.join(__dirname, 'schema') },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start.+without signing in/i, { selector: 'a' })
            .first()
            .click();
        });
      },

      'benefits/initial-confirm-eligibility': () => {
        cy.findByText(/Continue/i, { selector: 'button' }).click();
      },

      'benefits/stem-eligibility': () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'confirmation-stem-test') {
            cy.get('input[id="root_isEnrolledStemNo"]').click();
            cy.get(
              'input[id="root_view:teachingCertClinicalTraining_isPursuingTeachingCertYes"]',
            ).click();
            cy.get('input[id="root_benefitLeft_0"]').click();
          } else {
            cy.get('input[id="root_isEnrolledStemYes"]').click();
            cy.get('input[id="root_benefitLeft_1"]').click();
          }
          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },

      'benefits/confirm-eligibility': () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'confirmation-stem-test') {
            cy.get('.stem-eligibility-ul')
              .find('va-icon')
              .to.have.lengthOf(2);
          }
        });
        cy.findByText(/Continue/i, { selector: 'button' }).click();
      },

      'active-duty': () => {
        cy.get('input[id="root_isActiveDutyYes"]')
          .click()
          .then(() => {
            // check for the housing alert message
            cy.get('.feature').should('exist');
          });
        cy.get('input[id="root_isActiveDutyNo"]')
          .click()
          .then(() => {
            // check for the housing alert message
            cy.get('.feature').should('not.exist');
          });
        cy.findByText(/Continue/i, { selector: 'button' }).click();
      },

      'review-and-submit': () => {
        cy.findByText('Applicant information', { selector: 'button' }).click();
        cy.findByText('Education benefit', { selector: 'button' }).click();
        cy.findByText('Program details', { selector: 'button' }).click();
        cy.findByText('Military details', { selector: 'button' }).click();
        cy.findByText('Personal information', { selector: 'button' }).click();
        cy.get('.edit-btn').click({ multiple: true });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', '/v0/education_benefits_claims/10203', {
        data: {
          attributes: {
            confirmationNumber: '123fake-submission-id-567',
            submittedAt: '2016-05-16',
            regionalOffice: 'Test',
          },
        },
      });
    },
    skip: true, // skip allowed while removing the secondary wizard. will turn to false after secondary wizard has been removed
  },

  manifest,
  formConfig,
);

testForm(testConfig);
