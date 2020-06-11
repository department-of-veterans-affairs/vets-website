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
      // 'sample-file': path.join(__dirname, 'some-folder/some-file.json'),
      // 'sample-folder': path.join(__dirname, 'other-folder'),
    },

    pageHooks: {
      // Due to automatic path resolution, this URL expands to:
      // '/some-form-app-url/introduction'. Either format can be used.
      introduction: () => {
        cy.findAllByText(/order/i, { selector: 'button' })
          .first()
          .click();
      },

      // 'sub-page/do-stuff-before-filling': () => {
      //   // The `@testData` alias is available in `pageHooks` and `setupPerTest`.
      //   cy.get('@testData').then(testData => {
      //     // if (testData.isSomethingTrue) doSomething();
      //   });

      //   // Fill out the rest of the page like normal.
      //   cy.fillPage();

      //   // Don't forget to click continue!
      //   cy.findAllByText(/continue/i, { selector: 'button' })
      //     .first()
      //     .click();
      // },
    },

    // This will be derived from the manifest using `createTestConfig`,
    // so it doesn't need to be explicitly included.
    // rootUrl: '/some-form-app-url',

    setup: () => {
      cy.log('Logging something before starting tests.');
    },

    setupPerTest: () => {
      // Start an auth'd session here if your form requires it.
      cy.login();
      cy.route('GET', '/v0/user', gregUserData);
      cy.route('GET', '/v0/in_progress_forms/MDOT', happyPathData);
      cy.route({
        method: 'POST',
        url: '/v0/mdot/supplies',
        status: 200,
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
