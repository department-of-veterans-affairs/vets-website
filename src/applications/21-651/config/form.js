import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import veteranInformation from '../pages/veteranInformation';
import electionStatement from '../pages/electionStatement';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'compensation-election-651-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_651,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Disability Compensation Election application (21-651) is in progress.',
      expired:
        'Your saved Disability Compensation Election application (21-651) has expired. If you want to apply for Disability Compensation Election, please start a new application.',
      saved:
        'Your Disability Compensation Election application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for Disability Compensation Election.',
    noAuth:
      'Please sign in again to continue your application for Disability Compensation Election.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    veteranInformationChapter: {
      title: 'Veteran information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
      },
    },
    electionStatementChapter: {
      title: 'Election statement',
      pages: {
        electionStatement: {
          path: 'election-statement',
          title: 'Compensation election',
          uiSchema: electionStatement.uiSchema,
          schema: electionStatement.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
