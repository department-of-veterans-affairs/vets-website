import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = {
  dataPathPrefix: 'data',
  dataSets: ['minimal-test', 'maximal-test'],
  fixtures: {
    data: path.join(__dirname, 'schema'),
  },
  formConfig,
  manifest,
  pageHooks: {
    introduction: () => {
      cy.findAllByText(/start.+without signing in/i, { selector: 'button' })
        .first()
        .click();
    },
    'id-form': () => {
      cy.get('@testData').then(testData => {
        const { first, last } = testData.veteranFullName;

        const [year, month, day] = testData.veteranDateOfBirth.split('-');

        cy.findByLabelText(/first name/i).type(first);
        cy.findByLabelText(/last name/i).type(last);
        cy.findByLabelText(/month/i).select(parseInt(month, 10).toString());
        cy.findByLabelText(/day/i).select(parseInt(day, 10).toString());
        cy.findByLabelText(/year/i).type(year);
        cy.findByLabelText(/social security/i).type(
          testData.veteranSocialSecurityNumber,
        );
        cy.findAllByText(/continue/i, { selector: 'button' })
          .first()
          .click();
      });
    },
  },
  setupPerTest: () => {
    cy.route({
      method: 'GET',
      url: '/v0/health_care_applications/enrollment_status*',
      status: 404,
      response: {
        errors: [
          {
            title: 'Record not found',
            detail: 'The record identified by  could not be found',
            code: '404',
            status: '404',
          },
        ],
      },
    }).route('POST', '/v0/health_care_applications', {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16',
    });
  },
};

testForm(testConfig);
