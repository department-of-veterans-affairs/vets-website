import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-0966-intent-to-file-a-claim-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-0966',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits claims application (21-0966) is in progress.',
    //   expired: 'Your saved benefits claims application (21-0966) has expired. If you want to apply for benefits claims, please start a new application.',
    //   saved: 'Your benefits claims application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits claims.',
    noAuth:
      'Please sign in again to continue your application for benefits claims.',
  },
  title: 'Notify VA of your intent to file a claim',
  subTitle:
    'Intent to file a claim for compensation and/or pension, or survivors pension and/or DIC (VA Form 21-0966)',
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
