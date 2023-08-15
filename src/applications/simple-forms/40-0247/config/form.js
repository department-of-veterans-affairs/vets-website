// we're not using JSON schema for this form.
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '0247-pmc',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '40-0247',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your certificate request (40-0247) is in progress.',
    //   expired: 'Your saved certificate request (40-0247) has expired. If you want a certificate, please start a new request.',
    //   saved: 'Your certificate request has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to request a certificate.',
    noAuth: 'Please sign in again to continue your request for certificate.',
  },
  title: 'Request a Presidential Memorial Certificate',
  subTitle: 'Presidential Memorial Certificate request form (VA Form 40-0247)',
  defaultDefinitions: {
    privacyAgreementAccepted: {
      type: 'boolean',
      enum: [true],
    },
  },
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
  customText: {
    appType: 'request',
  },
};

export default formConfig;
