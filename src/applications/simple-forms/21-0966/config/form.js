import footerContent from 'platform/forms/components/FormFooter';
import {
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';

import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
// pages
import claimantTypePg from '../pages/claimantType';

const pageFocus = () => {
  return () => {
    const focusSelector = document.location.pathname.includes('claimant-type')
      ? '.schemaform-block-title'
      : defaultFocusSelector;

    waitForRenderThenFocus(focusSelector);
  };
};

/** @type {FormConfig} */
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
    notFound: 'Please start over to apply for intent to file.',
    noAuth: 'Please sign in again to continue your intent to file.',
  },
  title: 'Notify VA of your intent to file a claim',
  subTitle:
    'Intent to file a claim for compensation and/or pension, or survivors pension and/or DIC (VA Form 21-0966)',
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    claimantTypeChapter: {
      title: 'Claimant type',
      pages: {
        claimantTypePage: {
          path: 'claimant-type',
          title: 'Is this the form I need?',
          scrollAndFocusTarget: pageFocus(),
          uiSchema: claimantTypePg.uiSchema,
          schema: claimantTypePg.schema,
          pageClass: 'claimant-type',
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
