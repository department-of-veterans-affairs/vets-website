import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import content from '../../locales/en/content.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import mockPdfDownload from './fixtures/mocks/mock-pdf-download.json';
import { MOCK_ENROLLMENT_RESPONSE, API_ENDPOINTS } from '../../utils/constants';
import { selectYesNoWebComponent, goToNextPage } from './helpers';
import {
  fillContactPersonalInfo,
  fillContactAddress,
} from './helpers/emergency-contacts';
import { handleOptionalServiceHistoryPage } from './helpers/handleOptionalServiceHistoryPage';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['maximal-test', 'minimal-test'],
    fixtures: { data: path.join(__dirname, 'fixtures/data') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('[href="#start"]')
            .first()
            .click();
        });
      },
      'veteran-information/mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'view:doesMailingMatchHomeAddress',
              data['view:doesMailingMatchHomeAddress'],
            );
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'veteran-information/home-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'veteranHomeAddress';
            const fieldData = data.veteranHomeAddress;
            cy.fillAddressWebComponentPattern(fieldName, fieldData);
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'veteran-information/emergency-contacts-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('body').then($body => {
              if (
                $body.find(
                  'va-radio-option[name="root_view:hasEmergencyContacts"]',
                ).length
              ) {
                selectYesNoWebComponent(
                  'view:hasEmergencyContacts',
                  data['view:hasEmergencyContacts'],
                );
              }
            });
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'veteran-information/emergency-contacts/0/contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactPersonalInfo(data.emergencyContacts[0]);
          });
        });
      },
      'veteran-information/emergency-contacts/0/contact-address': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactAddress(data.emergencyContacts[0]);
          });
        });
      },
      'veteran-information/emergency-contacts/1/contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactPersonalInfo(data.emergencyContacts[1]);
          });
        });
      },
      'veteran-information/emergency-contacts/1/contact-address': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactAddress(data.emergencyContacts[1]);
          });
        });
      },
      'veteran-information/next-of-kin-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('body').then($body => {
              if (
                $body.find('va-radio-option[name="root_view:hasNextOfKin"]')
                  .length
              ) {
                selectYesNoWebComponent(
                  'view:hasNextOfKin',
                  data['view:hasNextOfKin'],
                );
              }
            });
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'veteran-information/next-of-kin/0/contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactPersonalInfo(data.nextOfKins[0]);
          });
        });
      },
      'veteran-information/next-of-kin/0/contact-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactAddress(data.nextOfKins[0]);
          });
        });
      },
      'veteran-information/next-of-kin/1/contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactPersonalInfo(data.nextOfKins[1]);
          });
        });
      },
      'veteran-information/next-of-kin/1/contact-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillContactAddress(data.nextOfKins[1]);
          });
          handleOptionalServiceHistoryPage();
        });
      },
      'household-information/spouse-contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'spouseAddress';
            const fieldData =
              data['view:spouseContactInformation'].spouseAddress;
            cy.fillAddressWebComponentPattern(fieldName, fieldData);
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get(
            'va-checkbox[name="privacyAgreementAccepted"]',
          ).scrollIntoView();
          cy.get('va-checkbox[name="privacyAgreementAccepted"]').shadow();
          cy.get('va-checkbox[name="privacyAgreementAccepted"]').find('label');
          cy.get('va-checkbox[name="privacyAgreementAccepted"]').click();
          cy.findByText(/submit/i, { selector: 'button' }).click();

          cy.get(`va-link[text="${content['button-pdf-download']}"]`)
            .as('downloadButton')
            .click();

          cy.wait('@downloadPdf');
          cy.get('@downloadButton').should('be.visible');
        });
      },
    },

    setupPerTest: () => {
      // Log in if the form requires an authenticated session.
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles).as(
        'mockFeatures',
      );
      cy.intercept('GET', `/v0/${API_ENDPOINTS.enrollmentStatus}*`, {
        statusCode: 200,
        body: MOCK_ENROLLMENT_RESPONSE,
      }).as('mockEnrollmentStatus');
      cy.intercept('/v0/in_progress_forms/10-10EZR', {
        statusCode: 200,
        body: mockPrefill,
      }).as('mockSip');
      cy.intercept('POST', formConfig.submitUrl, {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      }).as('mockSubmit');
      cy.intercept(
        'POST',
        `/v0/${API_ENDPOINTS.downloadPdf}`,
        mockPdfDownload,
      ).as('downloadPdf');
    },

    useWebComponentFields: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
