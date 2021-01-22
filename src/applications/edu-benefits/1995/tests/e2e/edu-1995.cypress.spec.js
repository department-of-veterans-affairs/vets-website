import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user.json';

Cypress.config('waitForAnimations', true);

const form = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    setupPerTest: () => {
      cy.login(mockUser);
      cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');
      cy.route('POST', '/v0/education_benefits_claims/1995', {
        data: {
          attributes: {
            confirmationNumber: 'BB935000000F3VnCAW',
            submittedAt: '2020-08-09T19:18:11+00:00',
          },
        },
      });
      cy.get('@testData').then(testData => {
        cy.route('GET', '/v0/in_progress_forms/22-1995', testData);
      });
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        cy.findByText(/Find the right application form/i, {
          selector: 'button',
        })
          .first()
          .click();
        cy.get('#NewBenefit-1').check();
        cy.get('#TransferredBenefits-1').check();
        cy.get('#apply-now-link').click();
        afterHook(() => {
          cy.findAllByText(/Start the education application/i, {
            selector: 'button',
          })
            .first()
            .click();
        });
      },
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(form);
