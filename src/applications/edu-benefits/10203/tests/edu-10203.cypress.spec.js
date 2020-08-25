import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'confirmation-stem-test'],
    fixtures: { data: path.join(__dirname, 'schema') },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start.+without signing in/i, { selector: 'button' })
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
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);
            cy.get('input[id="root_isPursuingTeachingCertNo"]').click();
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
              .find('fa-times')
              .to.have.lengthOf(3);
          }
        });
        cy.findByText(/Continue/i, { selector: 'button' }).click();
      },
    },

    setupPerTest: () => {
      cy.route('POST', '/v0/education_benefits_claims/10203', {
        data: {
          attributes: {
            confirmationNumber: '123fake-submission-id-567',
            submittedAt: '2016-05-16',
            regionalOffice: 'Test',
          },
        },
      });
    },
  },

  manifest,
  formConfig,
);

testForm(testConfig);
