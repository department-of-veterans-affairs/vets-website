import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillAddressWebComponentPattern,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';
import user from './fixtures/mocks/user.json';
import sipPut from './fixtures/mocks/sip-put.json';
import sipGet from './fixtures/mocks/sip-get.json';

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
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    useWebComponentFields: true,
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Start/, { selector: 'a[href="#start"]' })
            .last()
            .click();
        });
      },
      'contact-information-1': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'veteran_address',
              data.veteran.address,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(data.veteran.fullName);
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('/v0/api', { status: 200 });
      cy.intercept('/v0/feature_toggles', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/26-4555', sipPut);
      cy.intercept('GET', '/v0/in_progress_forms/26-4555', sipGet);
      cy.intercept(formConfig.submitUrl, mockSubmit);
      cy.login(userLOA3);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
