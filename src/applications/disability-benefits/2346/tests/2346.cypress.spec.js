import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import gregUserData from './data/gregUserData.json';
import happyPathData from './data/happyPath.json';

const testConfig = createTestConfig(
  {
    // This will be derived from the manifest using `createTestConfig`,
    // so it doesn't need to be explicitly included.
    // appName: 'ID-001-99 example form',

    // This will be derived from the form config using `createTestConfig`,
    // so it doesn't need to be explicitly included.
    // arrayPages: {},

    dataPrefix: 'formData',

    dataSets: ['../data/happyPath'],

    fixtures: {
      data: path.join(__dirname, 'data'),
    },

    pageHooks: {
      // Due to automatic path resolution, this URL expands to:
      // '/some-form-app-url/introduction'. Either format can be used.
      introduction: () => {
        cy.findAllByText(/order/i, { selector: 'button' })
          .first()
          .click();
      },

      'veteran-information/addresses': () => {
        cy.findAllByText('Edit permanent address', { selector: 'button' })
          .first()
          .click();
        cy.findByLabelText(/Country/i).select('Canada');
        cy.findByLabelText(/Province/i).type('Alberta');
        cy.findByLabelText(/International Postal Code/i).type('T7N');
        cy.findByText(/Save permanent address/i).click();
        // cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
        cy.findByText(/Continue/i).click();
      },

      supplies: () => {
        cy.get('#1').click();
        cy.get('#3').click();
        cy.get('#5').click();
        cy.findAllByText(/Continue/i, { selector: 'button' })
          .first()
          .click();
      },
    },

    setup: () => {
      cy.log('Logging something before starting tests.');
    },

    setupPerTest: () => {
      // Start an auth'd session here if your form requires it.
      cy.login();
      cy.route('GET', '/v0/user', gregUserData);
      cy.route('GET', '/v0/in_progress_forms/MDOT', happyPathData);
      cy.route('POST', '/v0/mdot/supplies', 200);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
