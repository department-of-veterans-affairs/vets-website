import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

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
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login();
      cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');
      cy.route('POST', '/v0/education_benefits_claims/0994', {
        data: {
          attributes: {
            confirmationNumber: 'BB935000000F3VnCAW',
            submittedAt: '2020-08-09T19:18:11+00:00',
          },
        },
      });
      cy.get('@testData').then(data => {
        cy.route('GET', '/v0/in_progress_forms/22-0994', data);
      });
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'button' })
            .first()
            .click();
        });
      },
    },
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(form);
