// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/2346-schema.json';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import ConfirmAddressPage from '../components/ConfirmAddress';
import OrderCommentPage from '../components/OrderCommentPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import OrderHistory from '../containers/OrderHistory';
import VeteranInformationPage from '../components/VeteranInformationPage';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  VeteranInformationPage: 'Veteran Information',
  confirmAddressPage: 'Confirm Address Page',
  orderHistoryPage: 'Order History Page',
  orderCommentsPage: 'Order Comments Page',
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
  title: 'Form 2346',
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
        [formPages.confirmAddressPage]: {
          path: 'confirm-address',
          title: formPages.confirmAddressPage,
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
    orderCommentsChapter: {
      title: formPages.orderCommentsPage,
      pages: {
        [formPages.orderCommentsPage]: {
          path: 'order-comments-page',
          title: formPages.orderCommentsPage,
          uiSchema: {
            'ui:description': OrderCommentPage,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    orderHistoryChapter: {
      title: formPages.orderHistoryPage,
      pages: {
        [formPages.orderHistoryPage]: {
          path: 'order-history-page',
          title: formPages.orderHistoryPage,
          uiSchema: {
            'ui:description': OrderHistory,
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
