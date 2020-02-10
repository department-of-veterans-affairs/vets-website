/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/2346-schema.json';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import ConfirmAddressPage from '../Components/ConfirmAddress';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

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
  chapters: {
    firstChapter: {
      title: "Veteran's Info",
      pages: {
        'Personal Details': {
          path: 'personal-details',
          title: "Veteran's Info",
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
            },
          },
        },
        'Confirm Address': {
          path: 'confirm-address',
          title: "Veteran's Info",
          uiSchema: {
            'ui:description': ConfirmAddressPage,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
