import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['2346-data'],
    fixtures: {
      data: path.join(__dirname, 'data'),
    },
    pageHooks: {
      introduction: () => {
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },

      // Since there is automatic path resolution, this can simply be:
      // 'some-page': () => { ... },
      'veteran-information': () => {
        // cy.get('.expand-button').click();
        // cy.fillPage();
        cy.findAllByText(/continue/i)
          .first()
          .click();
      },
    },

    setup: () => {
      cy.log('Log before starting tests.');
    },

    // setupPerTest: () => {
    //   // `cy.server` is already'Log before starting tests.'start adding routes.

    //   cy.route({
    //     method: 'GET',
    //     url: '/v0/endpoint',
    //     response: { body: 'mock body' },
    //   });

    //   cy.route({
    //     method: 'POST',
    //     url: '/v0/endpoint',
    //     status: 200,
    //   });
    // },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
