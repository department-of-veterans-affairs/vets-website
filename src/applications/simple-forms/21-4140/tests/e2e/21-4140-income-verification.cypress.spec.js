import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      'name-and-date-of-birth': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(_data => {
            // AI-specific validations
            cy.get('h1').should('have.length', 1); // Minimal header form
            cy.get('h1').should('contain.text', 'Name and date of birth');
            cy.get('va-text-input').should('have.length', 4); // First, middle, last, suffix
            cy.get('va-memorable-date').should('have.length', 1); // Date of birth

            // Standard completion pattern
            cy.fillPage();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'identification-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(_data => {
            // AI-specific validations
            cy.get('h1').should('have.length', 1); // Minimal header form
            cy.get('h1').should(
              'contain.text',
              'Your identification information',
            );
            cy.get('va-text-input').should('have.length', 3); // SSN, VA file number, service number

            // Standard completion pattern
            cy.fillPage();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      address: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // AI-specific validations
            cy.get('h1').should('have.length', 1); // Minimal header form
            cy.get('h1').should('contain.text', 'Address');

            // Address is the ONLY exception - must be filled manually
            cy.fillAddressWebComponentPattern('address', data.address);

            // Standard completion pattern (no cy.fillPage() for address pages)
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'phone-and-email-address': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(_data => {
            // AI-specific validations
            cy.get('h1').should('have.length', 1); // Minimal header form
            cy.get('h1').should('contain.text', 'Phone and email address');
            cy.get('va-text-input').should('have.length', 3); // Home phone, mobile phone, email

            // Standard completion pattern
            cy.fillPage();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      unemployed: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(_data => {
            // AI-specific validations
            cy.get('h1').should('have.length', 1); // Minimal header form
            cy.get('h1').should('contain.text', 'Unemployed');
            cy.get('va-checkbox-group').should('have.length', 1); // One checkbox group with two checkboxes

            // Standard completion pattern
            cy.fillPage();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      evidence: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(_data => {
            // AI-specific validations
            cy.get('h1').should('have.length', 1); // Minimal header form
            cy.get('h1').should(
              'contain.text',
              'Upload your supporting evidence',
            );
            cy.get('va-file-input-multiple').should('have.length', 1); // One multiple file input field

            // Standard completion pattern
            cy.fillPage();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      // Example page hook
      // All paths are already automatically filled out based on fixtures.
      // But if you want to manually test a page add the path.
      // 'name-and-date-of-birth': ({ afterHook }) => {
      //   cy.injectAxeThenAxeCheck();
      //   afterHook(() => {
      //     cy.get('@testData').then(() => {
      //       cy.fillPage(); // fills all fields based on fixtures.
      //       cy.axeCheck();
      //       cy.findByText(/continue/i, { selector: 'button' }).click();
      //     });
      //   });
      // },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
    skip: false, // Enable tests for development
  },
  manifest,
  formConfig,
);

testForm(testConfig);
