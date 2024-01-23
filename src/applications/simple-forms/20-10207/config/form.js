// we're not using JSON schema for this form
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import { TITLE, SUBTITLE } from './constants';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import preparerTypePg from '../pages/preparerType';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran-minimal.json';
import { getMockData } from '../helpers';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  dev: {
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'pp-10207-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10207',
  hideUnauthedStartLink: true,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your priority processing request application (20-10207) is in progress.',
    //   expired: 'Your saved priority processing request application (20-10207) has expired. If you want to apply for priority processing request, please start a new application.',
    //   saved: 'Your priority processing request application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for priority processing request.',
    noAuth:
      'Please sign in again to continue your application for priority processing request.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  v3SegmentedProgressBar: true,
  chapters: {
    preparerTypeChapter: {
      title: 'Your identity',
      pages: {
        preparerTypePage: {
          path: 'preparer-type',
          title: 'Which of these best describes you?',
          uiSchema: preparerTypePg.uiSchema,
          schema: preparerTypePg.schema,
          pageClass: 'preparer-type-page',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
