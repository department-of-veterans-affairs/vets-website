// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/2346-schema.json';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import { VA_FORM_IDS } from 'platform/forms/constants';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import ConfirmAddressPage from '../Components/ConfirmAddress';
import VeteranInformationPage from '../Components/VeteranInformationPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  VeteranInformationPage: 'Veteran Information',
  confirmAddressPage: 'Confirm Address Page',
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/posts',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'va-2346a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Request for hearing aid batteries and accessories',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    VeteranInformationChapter: {
      title: formPages.VeteranInformationPage,
      pages: {
        [formPages.VeteranInformationPage]: {
          path: 'veteran-information',
          title: formPages.VeteranInformationPage,
          uiSchema: {
            'ui:description': VeteranInformationPage,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    ConfirmAddressChapter: {
      title: formPages.confirmAddressPage,
      pages: {
        'Confirm Address': {
          path: 'confirm-address',
          title: "Veteran's Address Info",
          required: ['addressLine1', 'city', 'state', 'zip', 'email'],
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
