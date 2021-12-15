// Example of an imported schema:
import fullSchema from '../00-1234-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/00-1234-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';

// import fullSchema from 'vets-json-schema/dist/00-1234-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import { directDepositWarning } from '../helpers';
import toursOfDutyUI from '../definitions/toursOfDuty';

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  bankAccount,
  toursOfDuty,
} = commonDefinitions;

function hasDirectDeposit(formData) {
  return formData.viewNoDirectDeposit !== true;
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-1234',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '00-1234',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Mock form application (00-1234) is in progress.',
    //   expired: 'Your saved Mock form application (00-1234) has expired. If you want to apply for Mock form, please start a new application.',
    //   saved: 'Your Mock form application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Mock form.',
    noAuth: 'Please sign in again to continue your application for Mock form.',
  },
  title: 'Mock Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    // ** Complex Form
    applicantInformationChapter: {
      title: 'Chapter Title: Applicant Information (Basic Form elements)',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Section Title: Applicant Information',
          uiSchema: {
            fullName: fullNameUI,
            ssn: ssnUI,
          },
          schema: {
            type: 'object',
            required: fullName,
            properties: {
              fullName,
              ssn,
            },
          },
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Chapter Title: Service History (Simple array loop)',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Section Title: Service History',
          uiSchema: {
            toursOfDuty: toursOfDutyUI,
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty,
            },
          },
        },
      },
    },
    additionalInformationChapter: {
      title: 'Chapter Title: Additional Information (manual method)',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Section Title: Contact Information',
          uiSchema: {
            address: address.uiSchema('Mailing address'),
            email: {
              'ui:title': 'Primary email',
            },
            altEmail: {
              'ui:title': 'Secondary email',
            },
            phoneNumber: phoneUI('Daytime phone'),
          },
          schema: {
            type: 'object',
            properties: {
              address: address.schema(fullSchema, true),
              email: {
                type: 'string',
                format: 'email',
              },
              altEmail: {
                type: 'string',
                format: 'email',
              },
              phoneNumber: usaPhone,
            },
          },
        },
        directDeposit: {
          path: 'direct-deposit',
          title: 'Section Title: Direct Deposit',
          uiSchema: {
            'ui:title': 'Direct deposit',
            viewNoDirectDeposit: {
              'ui:title': 'I don’t want to use direct deposit',
            },
            bankAccount: {
              ...bankAccountUI,
              'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
              'ui:options': {
                hideIf: formData => !hasDirectDeposit(formData),
              },
              accountType: {
                'ui:required': hasDirectDeposit,
              },
              accountNumber: {
                'ui:required': hasDirectDeposit,
              },
              routingNumber: {
                'ui:required': hasDirectDeposit,
              },
            },
            viewStopWarning: {
              'ui:description': directDepositWarning,
              'ui:options': {
                hideIf: hasDirectDeposit,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              viewNoDirectDeposit: {
                type: 'boolean',
              },
              bankAccount,
              viewStopWarning: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },

    // ** Intermediate tutorial examples
    intermediateTutorialChapter: {
      title: 'Chapter Title: Intermediate tutorial examples',
      pages: {
        expandUnder: {
          path: 'expand-under',
          title: 'Section Title: Expand under', // ignored?
          uiSchema: {
            expandUnderExample: {
              'ui:title': 'Page Title: Expand under example',
              'ui:description':
                'Description: Choose "Yes" to reveal a conditional field',
              'ui:widget': 'yesNo',
              'ui:options': {
                labels: {
                  Y: 'Yes, this is what I want',
                  N: 'No, I do not want this',
                },
                widgetProps: {
                  Y: { 'data-info': 'yes' },
                  N: { 'data-info': 'no' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID's *must* exist on the page;
                // and we conditionally add content based on the selection
                selectedProps: {
                  Y: { 'aria-describedby': 'root_myConditionalField-label' },
                  // this ID doesn't exist, setting this would cause an axe error
                  // N: { 'aria-describedby': 'different_id' },
                },
              },
            },
            conditionalExpandUnderField: {
              'ui:title': 'Page Title: Conditional expand under field',
              'ui:description': 'Description: Conditional expand under field',
              'ui:options': {
                expandUnder: 'expandUnderExample',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              expandUnderExample: {
                type: 'boolean',
              },
              conditionalExpandUnderField: {
                type: 'string',
              },
            },
          },
        },
        conditionalFields: {
          path: 'conditionally-hidden',
          title: 'Section Title: Conditionally hidden',
          uiSchema: {
            conditionallyHiddenFieldExample: {
              'ui:title': 'Page Title: Conditionally hidden example',
              'ui:description':
                'Description: Choose "Yes" to reveal a conditionally hidden field, AND reveal the next condition page',
              'ui:widget': 'yesNo',
              'ui:options': {
                labels: {
                  Y: 'Yes, this is what I want',
                  N: 'No, I do not want this',
                },
                widgetProps: {
                  Y: { 'data-info': 'yes' },
                  N: { 'data-info': 'no' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID's *must* exist on the page;
                // and we conditionally add content based on the selection
                selectedProps: {
                  Y: { 'aria-describedby': 'some_id' },
                  // this ID doesn't exist, setting this would cause an axe error
                  // N: { 'aria-describedby': 'different_id' }
                },
              },
            },
            conditionalhiddenField: {
              'ui:title': 'Page Title: Conditionally hidden field',
              'ui:description': 'Description: Conditionally hidden field',
              'ui:options': {
                hideIf: formData => formData.conditionallyHiddenFieldExample !== true,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              conditionallyHiddenFieldExample: {
                type: 'boolean',
              },
              conditionalhiddenField: {
                type: 'string',
              },
            },
          },
        },
        conditionalPages: {
          title: 'Section Title: Conditional page',
          path: 'conditional-page',
          depends: form => form.conditionallyHiddenFieldExample,
          uiSchema: {
            conditionallyHiddenPageExample: {
              'ui:title': 'Page Title: Conditional page example',
              'ui:description':
                'Description: This page is shown when conditional field value on the previous page is selected',
              'ui:widget': 'yesNo',
              'ui:options': {
                labels: {
                  Y: 'Yes, this is what I want',
                  N: 'No, I do not want this',
                },
                widgetProps: {
                  Y: { 'data-info': 'yes' },
                  N: { 'data-info': 'no' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID's *must* exist on the page;
                // and we conditionally add content based on the selection
                selectedProps: {
                  Y: { 'aria-describedby': 'some_id' },
                  N: { 'aria-describedby': 'different_id' },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              conditionallyHiddenPageExample: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },

    // https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/available-features-and-usage-guidelines/
    availableFeaturesAndUsageChapter: {
      title: 'Chapter Title: Available features and usage guidelines examples',
      pages: {
        radioButtonGroup: {
          title: 'Section Title: Radio button group example',
          path: 'radio-button-group',
          uiSchema: {
            radioButtonGroupExample: {
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  dog: 'Dog',
                  cat: 'Cat',
                  octopus: 'Octopus',
                  sloth: 'Sloth',
                },
                widgetProps: {
                  dog: { 'data-info': 'dog_1' },
                  cat: { 'data-info': 'cat_2' },
                  octopus: { 'data-info': 'octopus_3' },
                  sloth: { 'data-info': 'sloth_4' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID's *must* exist on the page; and we
                // conditionally add content based on the selection
                selectedProps: {
                  // dog: { 'aria-describedby': 'some_id_1' },
                  // cat: { 'aria-describedby': 'some_id_2' },
                  // octopus: { 'aria-describedby': 'some_id_3' },
                  // sloth: { 'aria-describedby': 'some_id_4' },
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              radioButtonGroupExample: {
                type: 'string',
                enum: ['dog', 'cat', 'octopus', 'sloth'],
              },
            },
          },
        },
        checkboxGroupPattern: {
          title: 'Section Title: Checkbox group pattern',
          path: 'checkbox-group-pattern',
          uiSchema: {
            checkboxGroupPatternExample: {
              'ui:title': 'Page title: Which books have you read?',
              'ui:description': 'You may check more than one.',
              hasReadPrideAndPrejudice: {
                'ui:title': 'Pride and Prejudice by Jane Austen',
              },
              hasReadJaneEyre: {
                'ui:title': 'Jane Eyre by Charlotte Brontë',
              },
              hasReadGreatGatsby: {
                'ui:title': 'The Great Gatsby by F. Scott Fitzgerald',
              },
              hasReadBuddenbrooks: {
                'ui:title': 'Buddenbrooks by Thomas Mann',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              checkboxGroupPatternExample: {
                type: 'object',
                properties: {
                  hasReadPrideAndPrejudice: { type: 'boolean' },
                  hasReadJaneEyre: { type: 'boolean' },
                  hasReadGreatGatsby: { type: 'boolean' },
                  hasReadBuddenbrooks: { type: 'boolean' },
                },
              },
            },
          },
        },
        // checkboxGroupComponent: {
        //   title: 'Section Title: Checkbox group component',
        //   path: 'checkbox-group-component',

        // },
      },
    },
    workarounds: {
      title: 'Chapter Title: Workarounds for form widget problems',
      pages: {
        singleCheckbox: {
          title: 'Section Title: single checkbox validation',
          path: 'single-checkbox-validation',
          uiSchema: {
            'ui:title': 'Page Title: Single checkbox validation',
            'ui:description':
              'Page Description: Click continue, no error message will show',
            'ui:options': {
              // page title wrapped in a <label> breaking a11y, so use forceDivWrapper
              forceDivWrapper: true,
            },
            singleCheckboxExample: {
              'ui:title': 'Checkbox Title: Single checkbox validation example',
              'ui:description': 'Checkbox Description: click me later',
              'ui:widget': 'checkbox', // optional (set by schema type)
            },
          },
          schema: {
            type: 'object',
            required: ['singleCheckboxExample'],
            properties: {
              singleCheckboxExample: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
