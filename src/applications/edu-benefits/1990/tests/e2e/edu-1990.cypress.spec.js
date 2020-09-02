import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../e2e/fixtures/mocks/feature-toggles.json';
import mockUser from './mock-user.json';

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
      cy.route('GET', '/v0/feature_toggles?*', featureToggles);
      cy.route('POST', '/v0/education_benefits_claims/1990', {
        data: {
          attributes: {
            confirmationNumber: 'BB935000000F3VnCAW',
            submittedAt: '2020-08-09T19:18:11+00:00',
          },
        },
      });
    },
    pageHooks: {
      introduction: () => {
        cy.findByText(/Find the right application form/i, {
          selector: 'button',
        }).click();
        cy.get('#NewBenefit-0').check();
        cy.get('#ClaimingBenefitOwnService-0').check();
        cy.get('#NationalCallToService-1').click();
        cy.get('#VetTec-1').click();
        cy.get('#apply-now-link').click();
        cy.get('#2-continueButton').click();
      },
    },
  },
  manifest,
  formConfig,
);

testForm(form);
