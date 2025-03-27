import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockFeatureToggles from './fixtures/mocks/featureToggles.json';
import mockUser from './fixtures/mocks/loa3-user.json';
import mockSipPut from './fixtures/mocks/sip-put.json';
import mockSipGet from './fixtures/mocks/sip-get.json';
import mockScannedFormUpload from './fixtures/mocks/scanned-form-upload.json';

const TEST_URL = 'https://dev.va.gov/form-upload/21-686c/introduction';
const config = formConfig(TEST_URL);
const mockSubmit = JSON.stringify({
  confirmationNumber: '48fac28c-b332-4549-a45b-3423297111f4',
});

const fillTextWebComponent = (fieldName, value) => {
  cy.fillVaTextInput(`root_${fieldName}`, value);
};

// mock logged in LOA3 user
const userLOA3 = {
  ...mockUser,
  data: {
    ...mockUser.data,
    attributes: {
      ...mockUser.data.attributes,
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        ...mockUser.data.attributes.profile,
        loa: {
          current: 3,
        },
      },
    },
  },
};

const mockVamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const uploadImgPath =
  'src/applications/representative-form-upload/tests/e2e/fixtures/data/vba_21_686c.pdf';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,

    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['veteran'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Start/, { selector: 'a[href="#start"]' })
            .last()
            .click();
        });
      },
      'name-and-zip-code': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('fullName_first', data.fullName.first);
            fillTextWebComponent('fullName_last', data.fullName.last);
            fillTextWebComponent('address_postalCode', data.address.postalCode);
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
            fillTextWebComponent(
              'idNumber_vaFileNumber',
              data.idNumber.vaFileNumber,
            );
            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'phone-number-and-email': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('phoneNumber', data.phoneNumber);
            fillTextWebComponent('email', data.email);
            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      upload: ({ afterHook }) => {
        afterHook(() => {
          cy.axeCheck('.form-panel');
          cy.get('va-file-input')
            .shadow()
            .find('input')
            .selectFile(uploadImgPath, {
              force: true,
            });

          cy.findAllByText(/^Continue/, { selector: 'button' })
            .last()
            .click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/^Submit form/, { selector: 'button' })
            .last()
            .click();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('OPTIONS', '/v0/maintenance_windows', 'OK');
      cy.intercept('GET', '/v0/maintenance_windows', { data: [] });
      cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamcUser).as(
        'vamcUser',
      );
      cy.intercept('/v0/feature_toggles*', mockFeatureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/FORM-UPLOAD-FLOW', mockSipPut);
      cy.intercept('GET', '/v0/in_progress_forms/FORM-UPLOAD-FLOW', mockSipGet);
      cy.intercept(
        'POST',
        '/simple_forms_api/v1/scanned_form_upload',
        mockScannedFormUpload,
      );
      cy.intercept(
        'POST',
        '/simple_forms_api/v1/submit_scanned_form',
        mockSubmit,
      );
      cy.login(userLOA3);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  { ...manifest, rootUrl: '/form-upload/21-686c/' },
  config,
);

testForm(testConfig);
