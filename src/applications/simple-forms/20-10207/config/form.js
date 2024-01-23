// we're not using JSON schema for this form
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import preparerTypePg from '../pages/preparerType';
import personalInfoPg from '../pages/personalInfo';
import personalInfoThirdPartyVeteranPg from '../pages/personalInfoThirdPartyVeteran';
import personalInfoThirdPartyNonVeteranPg from '../pages/personalInfoThirdPartyNonVeteran';
import { PREPARER_TYPES, SUBTITLE, TITLE } from './constants';
import { getMockData, getPersonalInformationChapterTitle } from '../helpers';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran-minimal.json';

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
          pageClass: 'preparer-type',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
      },
    },
    personalInformationChapter: {
      title: ({ formData }) => getPersonalInformationChapterTitle(formData),
      pages: {
        personalInfoPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.NON_VETERAN,
          path: 'personal-information',
          title: 'Your personal information',
          uiSchema: personalInfoPg.uiSchema,
          schema: personalInfoPg.schema,
          pageClass: 'personal-information',
        },
        personalInfoThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'personal-information-third-party-veteran',
          title: 'Veteran’s name and date of birth',
          uiSchema: personalInfoThirdPartyVeteranPg.uiSchema,
          schema: personalInfoThirdPartyVeteranPg.schema,
          pageClass: 'personal-information',
        },
        personalInfoThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'personal-information-third-party-non-veteran',
          title: 'Claimant’s name and date of birth',
          uiSchema: personalInfoThirdPartyNonVeteranPg.uiSchema,
          schema: personalInfoThirdPartyNonVeteranPg.schema,
          pageClass: 'personal-information',
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
