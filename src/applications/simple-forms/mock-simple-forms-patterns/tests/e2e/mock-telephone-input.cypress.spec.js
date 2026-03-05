import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { introductionPageFlow } from 'applications/simple-forms/shared/tests/e2e/helpers';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { TELEPHONE_VALIDATION_ENDPOINT } from 'platform/forms-system/src/js/web-component-fields/vaTelephoneInputValidationCodes';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockFileUpload from '../../../shared/tests/e2e/fixtures/mocks/file-input.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const SELECTOR = 'root_wcv3InternationalPhoneSecondary';

const internationalPhonePage = 'international-phone';
const reviewAndSubmit = 'review-and-submit';
const CODE_DIGITS = '4456';
const CODE_500_DIGITS = '7777';
const CODE_401_DIGITS = '8888';
const CODE_NETWORK_FAILURE = '9999';

function checkServerResponse(code) {
  cy.fillVaTelephoneInput(SELECTOR, {
    contact: `(753) 456-${code}`,
    countryCode: 'US',
  });

  // verify that no error is set
  cy.get('va-telephone-input')
    .last()
    .shadow()
    .find('span#error-message')
    .should('be.empty');
}

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['default'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      'chapter-select': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`va-button[text="Deselect all"]`).click();
          cy.selectVaCheckbox('root_chapterSelect_internationalPhone', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      [internationalPhonePage]: ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('va-telephone-input')
            .first()
            .then($el => {
              cy.fillVaTelephoneInput($el, {
                contact: '(758) 456-5555',
                countryCode: 'US',
              });
            });

          cy.fillVaTelephoneInput(SELECTOR, {
            contact: `(755) 456-${CODE_DIGITS}`,
            countryCode: 'US',
          });

          cy.get('va-telephone-input')
            .last()
            .shadow()
            .find('span#error-message')
            .should(
              'contain.text',
              'Invalid Area Code. Area Codes do not end with the same two digits',
            );

          checkServerResponse('4457');
          checkServerResponse(CODE_500_DIGITS);
          checkServerResponse(CODE_NETWORK_FAILURE);
          checkServerResponse(CODE_401_DIGITS);

          // test that rapid successive calls don't flood server
          cy.fillVaTelephoneInput(SELECTOR, {
            contact: `(755) 456-${CODE_DIGITS}`,
            countryCode: 'US',
          });

          cy.fillVaTelephoneInput(SELECTOR, {
            contact: `(755) 456-1234`,
            countryCode: 'US',
          });

          cy.get('va-telephone-input')
            .last()
            .shadow()
            .find('span#error-message')
            .should('be.empty');

          cy.findByText(/continue/i, { selector: 'button' }).click();
          cy.url().should('include', '/review-and-submit');
        });
      },
      [reviewAndSubmit]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('va-accordion-item[data-chapter="internationalPhone"]').as(
              'internationalPhoneSection',
            );

            cy.get('@internationalPhoneSection').click();

            cy.get('@internationalPhoneSection')
              .find('div.review-row')
              .first()
              .within(() => {
                cy.get('dt').should('have.text', 'Home phone number');
                cy.get('dd').should('have.text', '+1 7584565555 (US)');
              });

            cy.get('@internationalPhoneSection')
              .find('va-button')
              .click();

            cy.get('@internationalPhoneSection')
              .find('va-telephone-input')
              .first()
              .then($el => {
                cy.fillVaTelephoneInput($el, {
                  contact: '(234) 567-8911',
                  countryCode: 'US',
                });
              });

            cy.get('@internationalPhoneSection')
              .contains('button', 'Update page')
              .click();

            cy.get('@internationalPhoneSection')
              .find('div.review-row')
              .first()
              .within(() => {
                cy.get('dt').should('have.text', 'Home phone number');
                cy.get('dd').should('have.text', '+1 2345678911 (US)');
              });
          });
          cy.findAllByText(/Submit application/i, {
            selector: 'button',
          }).click();
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept(
        'POST',
        formConfig.chapters.fileInput.pages.fileInput.uiSchema.wcv3FileInput[
          'ui:options'
        ].fileUploadUrl,
        mockFileUpload,
      );
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.intercept('POST', TELEPHONE_VALIDATION_ENDPOINT, req => {
        const { phoneNumber } = req.body.telephone;
        if (phoneNumber.endsWith(CODE_DIGITS)) {
          req.reply({
            statusCode: 400,
            body: {
              messages: [
                {
                  text:
                    'Invalid Area Code. Area Codes do not end with the same two digits',
                },
              ],
            },
          });
        } else if (phoneNumber.endsWith(CODE_500_DIGITS)) {
          req.reply({ statusCode: 500, body: {} });
        } else if (phoneNumber.endsWith(CODE_NETWORK_FAILURE)) {
          req.destroy();
        } else if (phoneNumber.endsWith(CODE_401_DIGITS)) {
          req.reply({ statusCode: 401, body: {} });
        } else {
          req.reply({ statusCode: 200, body: {} });
        }
      }).as('validatePhoneNumber');
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
