/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/2346-schema.json';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

const {
  fullName,
  ssn,
  date,
  dateRange,
  usaPhone,
  // bankAccount,
  // toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
// const formFields = {
//   fullName: 'fullName',
//   ssn: 'ssn',
//   toursOfDuty: 'toursOfDuty',
//   viewNoDirectDeposit: 'view:noDirectDeposit',
//   viewStopWarning: 'view:stopWarning',
//   bankAccount: 'bankAccount',
//   accountType: 'accountType',
//   accountNumber: 'accountNumber',
//   routingNumber: 'routingNumber',
//   address: 'address',
//   email: 'email',
//   altEmail: 'altEmail',
//   phoneNumber: 'phoneNumber',
// };

// function hasDirectDeposit(formData) {
//   return formData[formFields.viewNoDirectDeposit] !== true;
// }

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  confirmAddressPage: 'Confirm Address Page',
  orderHistoryPage: 'Order History Page',
  orderCommentsPage: 'Order Comments Page',
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/posts',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '2346',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Form 2346',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  prefillerTransformer: (pages, formData, metadata) => {
    pages, formData, metadata;
  },
  chapters: {
    firstChapter: {
      title: formPages.confirmAddressPage,
      pages: {
        'page-1': {
          path: 'page-1',
          title: formPages.confirmAddressPage,
          uiSchema: {
            firstName: {
              'ui:title': 'First Name',
            },
            middleName: {
              'ui:title': 'Middle Name',
            },
            lasttName: {
              'ui:title': 'Last Name',
            },
            dateOfBirth: {
              'ui:title': 'Date of Birth',
            },
          },
          schema: {
            type: 'object',
            // required: [formFields.fullName],
            properties: {
              firstName: {
                type: 'string',
              },
              middleName: {
                type: 'string',
              },
              lastName: {
                type: 'string',
              },
              dateOfBirth: {
                type: 'string',
              },
              // [formFields.fullName]: fullName,
              // [formFields.ssn]: ssn,
            },
          },
        },
      },
    },
    ConfirmAddressChapter: {
      title: 'Confirm Address Page',
      pages: {
        'Confirm Address Page': {
          path: 'confirm-address',
          title: 'Confirm Address Page',
          uiSchema: {
            address1: {
              'ui:title': 'Address 1',
            },
            address2: {
              'ui:title': 'Address 2',
            },
            city: {
              'ui:title': 'City',
            },
            state: {
              'ui:title': 'State',
            },
            zip: {
              'ui:title': 'Zip',
            },
            emailAddress: {
              'ui:title': 'Email Address',
            },
          },
          schema: {
            type: 'object',
            // required: [formFields.fullName],
            properties: {
              // [formFields.fullName]: fullName,
              // [formFields.ssn]: ssn,
              address1: {
                type: 'string',
              },
              address2: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              state: {
                type: 'string',
              },
              zip: {
                type: 'string',
              },
              emailAddress: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    // orderHistoryChapter: {
    //   title: formPages.orderHistoryPage,
    //   pages: {
    //     [formPages.orderHistoryPage]: {
    //       path: 'order-history-page',
    //       title: formPages.orderHistoryPage,
    //       uiSchema: {
    //         // [formFields.address]: address.uiSchema('Mailing address'),
    //         // [formFields.email]: {
    //         //   'ui:title': 'Primary email',
    //         // },
    //         // [formFields.altEmail]: {
    //         //   'ui:title': 'Secondary email',
    //         // },
    //         // [formFields.phoneNumber]: phoneUI('Daytime phone'),
    //         // 'ui:description': OrderHistory,
    //       },
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           // [formFields.address]: address.schema(fullSchema, true),
    //           // [formFields.email]: {
    //           //   type: 'string',
    //           //   format: 'email',
    //           // },
    //           // [formFields.altEmail]: {
    //           //   type: 'string',
    //           //   format: 'email',
    //           // },
    //           // [formFields.phoneNumber]: usaPhone,
    //         },
    //       },
    //     },
    // [formPages.directDeposit]: {
    //   path: 'direct-deposit',
    //   title: 'Direct Deposit',
    //   uiSchema: {
    //     'ui:title': 'Direct deposit',
    //     [formFields.viewNoDirectDeposit]: {
    //       'ui:title': 'I don’t want to use direct deposit',
    //     },
    //     [formFields.bankAccount]: _.merge(bankAccountUI, {
    //       'ui:order': [
    //         formFields.accountType,
    //         formFields.accountNumber,
    //         formFields.routingNumber,
    //       ],
    //       'ui:options': {
    //         hideIf: formData => !hasDirectDeposit(formData),
    //       },
    //       [formFields.accountType]: {
    //         'ui:required': hasDirectDeposit,
    //       },
    //       [formFields.accountNumber]: {
    //         'ui:required': hasDirectDeposit,
    //       },
    //       [formFields.routingNumber]: {
    //         'ui:required': hasDirectDeposit,
    //       },
    //     }),
    //     [formFields.viewStopWarning]: {
    //       'ui:description': directDepositWarning,
    //       'ui:options': {
    //         hideIf: hasDirectDeposit,
    //       },
    //     },
    //   },
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       [formFields.viewNoDirectDeposit]: {
    //         type: 'boolean',
    //       },
    //       [formFields.bankAccount]: bankAccount,
    //       [formFields.viewStopWarning]: {
    //         type: 'object',
    //         properties: {},
    //       },
    //     },
    //   },
    // },
    // },
    // },
  },
};

export default formConfig;
