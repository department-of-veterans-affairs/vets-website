import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-0972-alternate-signer-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-0972',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your alternate signer application (21-0972) is in progress.',
    //   expired: 'Your saved alternate signer application (21-0972) has expired. If you want to apply for alternate signer, please start a new application.',
    //   saved: 'Your alternate signer application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for alternate signer.',
    noAuth:
      'Please sign in again to continue your application for alternate signer.',
  },
  title: 'Sign for benefits on behalf of another person',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
