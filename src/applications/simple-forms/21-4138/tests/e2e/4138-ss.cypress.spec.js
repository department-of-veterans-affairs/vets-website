import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextAreaWebComponent,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import user from './fixtures/mocks/user.json';
import sipPut from './fixtures/mocks/sip-put.json';
import sipGet from './fixtures/mocks/sip-get.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

// mock logged in LOA3 user
const userLOA3 = {
  ...user,
  data: {
    ...user.data,
    attributes: {
      ...user.data.attributes,
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        ...user.data.attributes.profile,
        loa: {
          current: 3,
        },
      },
    },
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,

    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['user'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Start/, { selector: 'a[href="#start"]' })
            .last()
            .click();
        });
      },
      'statement-type': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaRadioOption('root_statementType', 'not-listed');
          cy.findAllByText(/^Continue/, { selector: 'button' })
            .last()
            .click();
        });
      },
      'personal-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern('fullName', data.fullName);
            fillDateWebComponentPattern('dateOfBirth', data.dateOfBirth);

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'identification-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('idNumber_ssn', data.idNumber.ssn);

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'mailingAddress',
              data.mailingAddress,
            );

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('phone', data.phone);
            fillTextWebComponent('emailAddress', data.emailAddress);

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      statement: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextAreaWebComponent('statement', data.statement);

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(
              `${data.fullName.first} ${data.fullName.last}`,
              'Submit application',
            );
          });
        });
      },
    },

    setup: () => {
      Cypress.config({
        defaultCommandTimeout: 10000,
      });
    },

    setupPerTest: () => {
      cy.intercept('/v0/api', { status: 200 });
      cy.intercept('/v0/feature_toggles', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/21-4138', sipPut);
      cy.intercept('GET', '/v0/in_progress_forms/21-4138', sipGet);
      cy.intercept(formConfig.submitUrl, mockSubmit);
      cy.login(userLOA3);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
