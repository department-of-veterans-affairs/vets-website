import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockUser from './fixtures/test-user.json';
import mockVaFileNumber from './fixtures/va-file-number.json';

import formConfig from 'applications/disability-benefits/686c-674/config/form';
import manifest from 'applications/disability-benefits/686c-674/manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['spouse-child-all-fields'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      cy.login(mockUser);
      cy.route('GET', '/v0/profile/valid_va_file_number', mockVaFileNumber).as(
        'mockVaFileNumber',
      );
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        cy.wait('@mockVaFileNumber');
        cy.injectAxe();

        afterHook(() => {
          cy.findAllByText(/Add or remove a dependent/i, { selector: 'button' })
            .first()
            .click();
        });
      },
      'current-marriage-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('#root_currentMarriageInformation_location_country').select(
            'Argentina',
          );
          cy.get('.usa-button-primary').click();
        });
      },
      'add-child/0/additional-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_doesChildLiveWithYouYes').click();
          cy.get('.usa-button-primary').click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
