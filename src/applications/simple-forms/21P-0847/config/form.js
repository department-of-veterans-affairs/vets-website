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
  trackingPrefix: '21P-0847-substitute-claimant-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21P-0847',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your substitute claimant application (21P-0847) is in progress.',
    //   expired: 'Your saved substitute claimant application (21P-0847) has expired. If you want to apply for substitute claimant, please start a new application.',
    //   saved: 'Your substitute claimant application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for substitute claimant.',
    noAuth:
      'Please sign in again to continue your application for substitute claimant.',
  },
  title: 'Request to be a substitute claimant',
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
